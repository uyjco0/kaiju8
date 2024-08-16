from __future__ import annotations

import os
import time
import urllib
from typing import Any, Callable
from typing import TYPE_CHECKING

from contextlib import asynccontextmanager
from typing import AsyncContextManager
from litestar.channels import ChannelsPlugin
from litestar.channels.backends.memory import MemoryChannelsBackend
from litestar.exceptions import WebSocketDisconnect
from litestar import Controller, Litestar, WebSocket, get
from litestar.handlers import WebsocketListener, websocket_listener
from litestar_asyncpg import AsyncpgConfig, AsyncpgPlugin, PoolConfig

if TYPE_CHECKING:
    from asyncpg import Connection

# Get the needed environment variables
db_user = urllib.parse.quote(os.environ['DB_USER'])
db_user_pass = urllib.parse.quote(os.environ['DB_PASS'])
db_host = urllib.parse.quote(os.environ['DB_HOST'])
db_port = urllib.parse.quote(str(os.environ['DB_PORT']))
db_db_name = urllib.parse.quote(os.environ['DB_NAME'])

# Build the PostgreSQL connection string
dsn = f'postgresql://{db_user}:{db_user_pass}@{db_host}:{db_port}/{db_db_name}'


async def add_conn_listener(
    conn: Connection, channel: str, handler: Callable[[Connection, str, str, str], None]
) -> None:
    """Suscribe the given db connection to the given channel using the LISTEN/NOTIFY api."""
    # Add to the connection 'conn' the callback 'handler' associated to the channel 'channel'
    await conn.add_listener(channel, handler)


async def remove_conn_listener(
    conn: Connection, channel: str, handler: Callable[[Connection, str, str, str], None]
) -> None:
    """Remove from the given connection the subscription to the given channel."""
    # Remove from the connection 'conn' the callback 'handler' associated to the channel 'channel'
    await conn.remove_listener(channel, handler)


@get('/sync_hello', sync_to_thread=False)
def sync_hello_route() -> dict[str, Any]:
    """A synchronous route handler test that returns a json object with the 'hello world'."""
    return {'hello': 'world'}


class AsyncDbController(Controller):
    """Asynchronous controller test."""
    @get(path='/async_db')
    async def async_db_route(self, db_connection: Connection) -> dict[str, str]:
        """Check if the database available and returns the result from a query to the database."""
        result = await db_connection.fetch('select * from test')
        return {'select from test': str(result)}


class AsyncWebsocketController(WebsocketListener):
    """Asynchronous WebSocket controller using the LISTEN/NOTIFY api with 'asyncpg'."""
    path = '/ws_asyncpg'
    conn = None
    channel = 'test_channel'
    handler = None

    async def on_accept(self, socket: WebSocket, db_connection: Connection) -> None:

        self.conn = db_connection

        # Callback to manage a given notification from the channel where it is associated
        async def test_notification_handler(
            conn: Connection, pid: str, channel: str, payload: str
        ) -> None:
            # Send the payload through the associated WebSocket's socket
            await socket.send_data(payload)

        self.handler = test_notification_handler

        # Subscribe to the channel
        await add_conn_listener(self.conn, self.channel, test_notification_handler)

    async def on_disconnect(self, socket: WebSocket) -> None:
        await remove_conn_listener(self.conn, self.channel, self.handler)

    async def on_receive(self, data: str) -> None:
        # Publish to the channel
        await self.conn.execute(f"NOTIFY {self.channel}, 'testing'")


@asynccontextmanager
async def chat_room_lifespan(
    socket: WebSocket, channels: ChannelsPlugin
) -> AsyncContextManager[None]:
    async with channels.start_subscription('kaiju8', history=5) as subscriber:
        try:
            async with subscriber.run_in_background(socket.send_data):
                yield
        except WebSocketDisconnect:
            return


@websocket_listener('/kaiju8', connection_lifespan=chat_room_lifespan)
def kaiju8_handler(data: str, channels: ChannelsPlugin) -> None:
    """Handle to manage WebSockets using Channels."""
    channels.publish(data, channels=['kaiju8'])


trials = 0
end = False
while not end:
    try:
            trials += 1

            # Initialize the Asyncpg plugin
            asyncpg_plug = AsyncpgPlugin(config=AsyncpgConfig(pool_config=PoolConfig(dsn=dsn)))

            # Create the application object
            app = Litestar(
                plugins=[
                    asyncpg_plug, ChannelsPlugin(channels=['kaiju8'],
                                                 backend=MemoryChannelsBackend(history=5))
                ],
                route_handlers=[
                    sync_hello_route, AsyncDbController, AsyncWebsocketController, kaiju8_handler
                ]
            )
            end = True
    except Exception as e:
        if trials >= 3:
            end = True
            print(f'There was not possible to start the server: {e}')
        else:
            time.sleep(2)
