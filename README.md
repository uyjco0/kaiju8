![Kaiju8 logo](frontend/public/logo.png)

`Kaiju8` is an example of a fullstack application providing a very simple real time chat.

---

## **Usage**

```
Usage: ./scripts/start_compose.sh


  It starts the Docker containers providing the chat application.


Containers:
  - Nginx: serve the UI files (React, Typescript & Tailwind), reverse proxy for the backend and HTTPS.
  - Backend: the Websockets backend (Litestar/Python).
  - Database: the PostgreSQL database (it enables using the chat through the PostgreSQL's LISTEN/NOTIFY api).
```

## **Configuration Options**

1. Environment variables

   - The `.env` file (central configuration, use `env_dev` as an example):
     - `NGINX_HTTP_PORT` - public unsecure port for Nginx
     - `NGINX_HTTPS_PORT` - public secure port (ssl) for Nginx
     - `APP_PORT` - internal port where the backend is listening
     - `DB_HOST` - internal name of the Docker's database service
     - `DB_PORT` - internal port where the database is listening
     - `DB_USER` - database user being used by the backend
     - `DB_PASS` - database user's password
     - `POSTGRES_USER` - default database user (official Docker container)
     - `POSTGRES_PASSWORD` - default database user's password
     - `POSTGRES_DB` - name of the database being used by the backend

2. Nginx configuration

   - The `nginx/nginx.conf` file:
     - Replace the appearances of `NGINX_HTTP_PORT` with its real value (defined in `.env`)
     - Replace the appearances of `NGINX_HTTPS_PORT` with its real value
     - Replace the appearances of `YOUR_OWN_DOMAIN_HERE` with the name of your custom domain
     - Replace `APP_PORT` with its real value

3. Application UI (React + Tpescript + Tailwind) configuration

   - The `frontend/src/config.json` file:
     - Replace `YOUR_OWN_DOMAIN_HERE` with the name of your custom domain

4. Docker Compose configuration

   - The `docker-compose.yml` file:
     - The path `./frontend/dist` points to the folder created when building the Application UI (`npm run build`)
     - The path `./nginx/keys/fullchain.pem` points to the folder with the certificate for your domain
     - The path `./nginx/keys/privkey.pem` points to the folder with the certificate key

5. Database configuration

   - The `backend/sql/init.sql` file:
     - Run the following Perl script to configure it:
       - `./scripts/process_env.pl .env backend/sql/init.sql`
         - It replaces the tokens (e.g. `__db_user__`) by their corresponding values from the `.env` file

6. General observations

   - Remember to add the needed execution permissions (`chmod +x FILE_NAME`):
     - For the scripts `scripts/start_compose.sh`, `scripts/stop_compose.sh` and `scripts/process_env.pl`
   - Remember to open in the Firewall the ports for `NGINX_HTTP_PORT` and `NGINX_HTTPS_PORT`
