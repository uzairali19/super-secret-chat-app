import { useState, useEffect } from "react";
import { Body } from "../body";
import { Header } from "../header";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const App: React.FC = () => {
  const [theme, setTheme] = useState("years");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const res = await fetch("http://localhost:3001/login", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.loggedIn) {
        setLoggedIn(data.loggedIn);
        setUsername(data.username);
        setUserId(data.userId);
        setMessages(data.messages);
        socket.emit("join_room", data.username);
      }
    };

    fetchData()
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <div data-theme={theme} className="min-h-screen">
      <div className="flex flex-col min-h-screen justify-center items-center">
        <progress className="progress w-80 progress-warning"></progress>
      </div>
    </div>
  ) : (
    <div data-theme={theme} className="min-h-screen">
      <Header
        theme={theme}
        setTheme={setTheme}
        loggedIn={loggedIn}
        username={username}
        setLoggedIn={setLoggedIn}
      />
      <Body
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        setUsername={setUsername}
        socket={socket}
        username={username}
        userId={userId}
        setUserId={setUserId}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};

export default App;
