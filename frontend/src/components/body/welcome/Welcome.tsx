import { useState } from "react";
import { WelcomeProps } from "../../types";
import LoginInput from "./LoginInput";

const Welcome: React.FC<WelcomeProps> = ({
  setLoggedIn,
  setUsername,
  socket,
  setUserId,
  setMessages,
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const loginUser = async () => {
    await fetch("http://localhost:3001/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name.replace(/\s+/g, " ").trim().toLocaleLowerCase(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setLoggedIn(true);
          setUsername(name);
          setUserId(data.userId);
          setMessages(data.messages);
          socket.emit("join_room", name);
        }
        if (data.errorMessage) {
          setError({
            error: true,
            message: data.errorMessage,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container flex justify-center min-h-screen flex-col mx-auto items-center">
      <h1 className="text-2xl">Welcome to Super Secret Chat APP</h1>
      <h3 className="text-sm my-5">
        Please enter your name below and click "Login"
      </h3>
      <div className="form-control">
        <LoginInput name={name} setName={setName} loginUser={loginUser} />
        <button className="btn btn-primary text-white" onClick={loginUser}>
          Login
        </button>
        {error.error && (
          <div className="alert alert-error shadow-lg">
            <div>
              <div
                onClick={() => {
                  setError({
                    error: false,
                    message: "",
                  });
                }}
                className="btn btn-error m-0 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span>{error.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
