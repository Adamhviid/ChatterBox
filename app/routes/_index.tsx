import { useEffect, useState } from "react";
import { useSocket } from "~/context";
import moment from "moment";
import "../App.css";

export default function Index() {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ message: string; timestamp: string }[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connection_messages", handleConnectionMessages);
    socket.on("message", handleMessage);

    // Clean up the event listeners on component unmount
    return () => {
      socket.off("connection_messages", handleConnectionMessages);
      socket.off("message", handleMessage);
    };
  }, [socket]);

  // Function to format messages
  const formatMessages = (data: { timestamp: moment.MomentInput }[]) => {
    return data.map((msg) => {
      const formattedDate = moment(msg.timestamp).calendar();
      return { message: "", ...msg, timestamp: formattedDate };
    });
  };

  // Get 10 messages when connecting
  const handleConnectionMessages = (data: { timestamp: moment.MomentInput }[]) => {
    const formattedMessages = formatMessages(data);
    setMessages((prevMessages) => [...prevMessages, ...formattedMessages]);
  };

  // Listen for the "message" event
  const handleMessage = (data: { timestamp: moment.MomentInput }) => {
    const formattedDate = moment(data.timestamp).calendar();
    const formattedMessage = { ...data, timestamp: formattedDate };
    setMessages((prevMessages) => [...prevMessages, { message: "", ...formattedMessage }]);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket?.emit("message", message);
      setMessage(""); // Clear the input field after sending the message
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix Chatterbox</h1>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.timestamp}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button
          type="button"
          onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
