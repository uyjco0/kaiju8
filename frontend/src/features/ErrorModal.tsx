export function ErrorModal() {
  return (
    <div className="z-40 transition-all flex flex-col justify-center items-center h-screen w-screen absolute">
      <div className="z-50 w-4/5 h-3/5 lg:w-2/5 lg:h-2/5 bg-duck-red flex flex-col justify-center items-center rounded-xl shadow-md">
        <div className="text-lg lg:text-2xl text-white text-center m-5">
          )-: Sorry, there is no connection to the server. Try again in a few
          minutes, and if the problem persists, talk to the technical service.
          :-(
        </div>
      </div>
    </div>
  );
}
