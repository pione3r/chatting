import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [socket] = useState(io("http://localhost:8000"));

  const [userName, setUserName] = useState("");

  const [message, setMessage] = useState("");

  const [messageLog, setMessageLog] = useState([]);

  useEffect(() => {
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("notice enter", (notice) =>
      setMessageLog((prev) => [...prev, notice])
    );

    socket.on("notice leave", (notice) =>
      setMessageLog((prev) => [...prev, notice])
    );

    socket.on("new message", (message) => {
      setMessageLog((prev) => [...prev, message]);
      setMessage("");
    });
  }, [socket]);

  return (
    <>
      <button
        onClick={() => {
          socket.connect();
          const userName = makeRandomName();
          socket.emit("enter room", userName);
          setUserName(userName);
        }}
      >
        들어가기
      </button>
      <button
        onClick={() => {
          socket.disconnect();
        }}
      >
        나가기
      </button>
      <div>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          onClick={() => {
            socket.emit("new message", {
              userName: userName,
              message: message,
            });
          }}
        >
          메시지 보내기
        </button>
      </div>
      <div>
        메시지 로그
        <div>
          {messageLog.map((message, index) => (
            <div key={index}>
              {message.userName ? (
                <>
                  <div>{message.userName}</div>
                  <div>{message.message}</div>
                </>
              ) : (
                <div>{message}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function makeRandomName() {
  var 감정 = ["미운", "고마운", "사랑하는", "증오하는", "끔찍한", "무서운"];

  var 색상 = ["빨강", "노랑", "주황", "파랑", "초록", "하양", "까망"];

  var 자연 = ["숲", "나무", "꽃", "풀", "바다", "절벽"];

  var 단어 = ["날개", "번개", "해", "달", "팬티", "모자"];

  return (
    감정[Math.floor(Math.random() * 감정.length)] +
    " 나의 " +
    색상[Math.floor(Math.random() * 색상.length)] +
    "색 " +
    단어[Math.floor(Math.random() * 단어.length)]
  );
}
