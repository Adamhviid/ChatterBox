import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Chatterboxes from "~/components/listOfChatterboxes";
import Websocket from "~/components/box/websocket";

export default function Box() {
  const { box } = useParams<{ box: string }>();

  const [messages, setMessages] = useState<{ message: string; timestamp: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialMessages();
  }, [box]);

  const fetchInitialMessages = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/messages?box=${box}`);
    const data = await response.json();
    setTimeout(() => {
      setMessages(data.messages);
      setIsLoading(false);
    }, 250); // 2-second delay
  };

  return (
    <div className="flex">
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Websocket
            box={box ?? ""}
            initialMessages={messages}
          />
        )}
      </div>
    </div>
  );
}
