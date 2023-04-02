import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [socket, setSocket] = useState(io("http://localhost:8000"));

  const [user, setUser] = useState("");

  const [message, setMessage] = useState("");

  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    setSocket(io("http://localhost:8000"));
  }, []);

  console.log(messageList);

  useEffect(() => {
    socket.on("notice enter", (notice) => {
      console.log(notice);
      setMessageList((prev) => [...prev, notice]);
    });
  }, [socket]);

  return (
    <>
      <button
        onClick={() => {
          if (user !== "") return;

          const userName = makeRandomName();
          setUser(userName);

          socket.emit("enter room", userName);
        }}
      >
        들어가기
      </button>
      <button
        onClick={() => {
          if (user === "") return;

          const userName = user;

          socket.emit("leave room", userName);
          socket.on("notice leave", (notice) => {
            setMessageList(() => [notice]);
          });

          setUser("");
        }}
      >
        나가기
      </button>
      <div>
        <input
          placeholder="새 메시지 입력"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          onClick={() => {
            socket.emit("new message", message);
            setMessage("");
          }}
        >
          메시지 보내기
        </button>
      </div>
      <div>
        {messageList.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </>
  );
}

function makeRandomName() {
  let name = "";
  let possible = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 3; i++) {
    name += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return name;
}
