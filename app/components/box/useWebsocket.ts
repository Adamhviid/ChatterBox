import { useEffect, useState } from "react";
import { useSocket } from "~/context";

interface Message {
  message: string;
  timestamp: string;
}

interface SocketData {
  message?: string;
  timestamp: string;
}

export const useWebSocket = (box: string, initialMessages: Message[]) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([...initialMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connection_messages", handleConnectionMessages);
    socket.on("message", handleMessage);

    return () => {
      socket.off("connection_messages", handleConnectionMessages);
      socket.off("message", handleMessage);
    };
  }, [socket, box]);

  const handleConnectionMessages = (data: SocketData[]) => {
    const formattedMessages = formatMessages(data);
    setMessages((prevMessages) => [...prevMessages, ...formattedMessages]);
  };

  const handleMessage = (data: SocketData) => {
    const formattedMessage = { ...data, message: data.message || "", box };
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);
  };

  const formatMessages = (data: SocketData[]) => {
    return data.map((msg) => ({
      message: msg.message || "",
      timestamp: msg.timestamp,
      box,
    }));
  };

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit("message", { message, box });
    }
  };

  return { messages, sendMessage };
};
