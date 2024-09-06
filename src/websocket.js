import { Server } from "socket.io";
import { getDatabase } from "./database.js";

let io;

export function initializeWebSocket(httpServer) {
  io = new Server(httpServer);

  io.on("connection", async (socket) => {
    socket.emit("confirmation", "connected!");

    const db = getDatabase();

    socket.on("message", async (data) => {
      const timestamp = new Date();
      const messageData = { message: data.message, box: data.box, timestamp };

      await db.collection("messages").insertOne(messageData);

      io.emit("message", messageData);
    });
  });
}