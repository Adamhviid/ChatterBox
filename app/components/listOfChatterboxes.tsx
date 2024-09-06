import React from "react";
import { useNavigate } from "react-router-dom";

export default function Chatterboxes({ boxes }: { boxes: Array<any> }) {
  const navigate = useNavigate();

  const handleBoxClick = (box: string) => {
    navigate(`/box/${box}`);
  };

  return (
    <div>
      <h2>Join a new chatterbox</h2>
      <ul className="list-none p-0 mb-5">
        {boxes.map((box, index) => (
          <li
            key={index}
            className="my-1 p-2 rounded bg-gray-200 cursor-pointer"
            onClick={() => handleBoxClick(box.name)}>
            {box.name}
          </li>
        ))}
      </ul>
      {/* <button
        type="button"
        className="p-2 px-4 border-none bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700">
        Send
      </button> */}
    </div>
  );
}
