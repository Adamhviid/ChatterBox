import React from "react";
import Messaging from "./Messaging";
import { useWebSocket } from "./useWebsocket";

interface WebsocketProps {
  box: string;
  initialMessages: { message: string; timestamp: string }[];
}

const Websocket: React.FC<WebsocketProps> = ({ box, initialMessages }) => {
  const { messages, sendMessage } = useWebSocket(box, initialMessages);

  return (
    <div className="font-sans leading-7">
      <h1>current box: {box}</h1>
      <Messaging
        messages={messages}
        onSendMessage={sendMessage}
      />
    </div>
  );
};

export default Websocket;
