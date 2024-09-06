import React, { useState } from "react";
import moment from "moment";

interface Message {
  message: string;
  timestamp: string;
}

interface MessagingProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const Messaging: React.FC<MessagingProps> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div>
      <ul className="list-none p-0 mb-5">
        {messages.map((msg, index) => (
          <li
            key={index}
            className="my-1 p-1 rounded">
            <strong>{moment(msg.timestamp).calendar()}:</strong> {msg.message}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          className="p-2 w-48 border border-gray-300 rounded mr-2"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="p-2 px-4 border-none bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default Messaging;
