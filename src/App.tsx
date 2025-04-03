import { useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
const socket = io("http://localhost:3000");

function App() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
    socket.emit("messages", data);
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("desde el servidor");
    });
    socket.on("messages", (data) => {
      console.log(data);
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" />
          <button> enviar </button>
        </form>
      </div>
    </>
  );
}
export default App;
