import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

/** 서버 인스턴스 */
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
});

io.on("connection", (socket) => {
  socket.once("enter room", (userName) => {
    socket.join("room1");

    console.log(`${userName} 님이 입장하셨습니다.`);
    io.to("room1").emit("notice enter", `${userName} 님이 입장하셨습니다.`);

    socket.on("new message", ({ userName, message }) =>
      io
        .to("room1")
        .emit("new message", { userName: userName, message: message })
    );

    socket.on("disconnect", () => {
      console.log(`${userName} 님이 나가셨습니다.`);
      io.to("room1").emit("notice leave", `${userName} 님이 나가셨습니다.`);
    });
  });
});

io.engine.on("connection_error", (err) => console.log(err));

httpServer.listen(8000);
