import { useEffect, useRef, useState } from "react";
import { ChatProps } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { ChatInput } from "./StyledChatComponents";
import { io, Socket } from "socket.io-client";

const Chat: React.FC<ChatProps> = ({ username, userId, messages }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState(messages);
  const [showMessageOptions, setShowMessageOptions] = useState({
    show: false,
    id: "",
  });
  const [showEditMessage, setShowEditMessage] = useState({
    show: false,
    id: "",
  });
  const scrollView = useRef<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const timeAmPm = (time: string) => {
    const timeArr = time.split(":");
    const hour = parseInt(timeArr[0]);
    const minutes = timeArr[1];
    if (hour > 12) {
      return `${hour - 12}:${minutes} PM`;
    } else {
      return `${hour}:${minutes} AM`;
    }
  };

  const handleMessageClick = (e: any) => {
    e.preventDefault();
    messageList.forEach((message: any) => {
      if (e.target.id === message.id) {
        if (showMessageOptions.show && showMessageOptions.id === message.id) {
          setShowMessageOptions({ show: false, id: "" });
          return;
        } else if (
          showMessageOptions.show &&
          showMessageOptions.id !== message.id
        ) {
          setShowMessageOptions({ show: true, id: message.id });
          return;
        } else {
          setShowMessageOptions({ show: true, id: message.id });
          return;
        }
      }
    });
  };

  const handleDeleteMessage = async (e: any) => {
    const messageId = e.target.id;
    await fetch("http://localhost:3001/message", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: messageId,
        time: timeAmPm(new Date().toLocaleTimeString()),
        edited: false,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setMessageList(data.messages);
          setShowMessageOptions({ show: false, id: "" });
          socket?.emit("delete_message", data);
        }
      });
  };

  const editMessage = (e: any) => {
    const messageId = e.target.id;
    setMessage(
      messageList.filter((message: any) => message.id === messageId)[0].message
    );
    setShowEditMessage({
      show: true,
      id: messageId,
    });
  };

  const sendMessage = async () => {
    if (message !== "") {
      const data = {
        id: uuidv4(),
        message: message,
        edited: false,
        username,
        userId,
        time: timeAmPm(new Date().toLocaleTimeString()),
      };
      await socket?.emit("send_message", data);
      setMessageList((messageList: any) => [...messageList, data]);
      setMessage("");
    }
  };

  const handleEditMessage = async () => {
    if (showMessageOptions.id === showEditMessage.id && message !== "") {
      await fetch("http://localhost:3001/message", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: showEditMessage.id,
          message: message,
          edited: true,
          time: timeAmPm(new Date().toLocaleTimeString()),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setMessageList(data.messages);
            setShowMessageOptions({ show: false, id: "" });
            socket?.emit("edit_message", data);
          }
        });
    }
    setMessage("");
    setShowEditMessage({
      show: false,
      id: "",
    });
  };

  const capitalCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    setMessageList(messages);
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("receive_message", (data: any) => {
      setMessageList((messageList: any) => [...messageList, data]);
    });
    newSocket.on("delete_message", (data: any) => {
      setMessageList(data.messages);
    });
    newSocket.on("edit_message", (data: any) => {
      setMessageList(data.messages);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [messages]);

  useEffect(() => {
    scrollView.current.scrollTop = scrollView.current.scrollHeight;
  }, [messageList]);

  return (
    <div className="container mx-auto flex flex-col justify-between min-h-[74vh] h-[100px] mt-2">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-scroll" ref={scrollView}>
          {messageList?.map((message: any) => {
            return (
              <div
                key={message.id}
                className={`chat ${
                  message.userId === userId ? "chat-start" : "chat-end"
                }`}
              >
                <div className="chat-header">
                  {message.username ? capitalCase(message.username) : null},
                  {message.edited ? " Edited at" : null}
                  <time className="pl-1 text-xs opacity-50">
                    {message.time}
                  </time>
                </div>
                <div
                  className={`chat-bubble relative pr-7 min-w-[200px] text-white
                ${message.userId === userId ? "bg-accent" : "bg-neutral"}`}
                >
                  {message.message}
                  {message.message !== "This message has been deleted" &&
                  message.userId === userId ? (
                    <span
                      className="absolute right-2 top-1 hover:cursor-pointer hover:opacity-70"
                      id={message.id}
                      onClick={handleMessageClick}
                    >
                      ...
                    </span>
                  ) : null}
                  {showMessageOptions.show &&
                    showMessageOptions.id === message.id && (
                      <div className="flex flex-col items-end">
                        <button
                          id={message.id}
                          className="hover:opacity-50"
                          onClick={editMessage}
                        >
                          Edit
                        </button>
                        <button
                          id={message.id}
                          className="hover:opacity-50"
                          onClick={handleDeleteMessage}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex">
        <div className="relative min-w-[85vw]">
          <ChatInput
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (showEditMessage.show) {
                  handleEditMessage();
                } else {
                  sendMessage();
                }
              }
            }}
          />
          {showEditMessage.show && (
            <button
              className="btn btn-success absolute right-2 bottom-4 h-8 min-h-0 px-14 py-0 text-xs"
              onClick={handleEditMessage}
            >
              Edit
            </button>
          )}
          {!showEditMessage.show && (
            <button
              className="btn btn-success absolute right-2 bottom-4 h-8 min-h-0 px-14 py-0 text-xs"
              onClick={sendMessage}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
