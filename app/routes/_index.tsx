import { useEffect, useState } from "react";

import Chatterboxes from "~/components/listOfChatterboxes";

export default function Index() {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const fetchBoxes = async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}` + "/api/boxes");
      const data = await response.json();
      setBoxes(data.boxes);
    };

    fetchBoxes();
  }, []);

  return (
    <div className="flex">
      <div className="w-1/2">
        <Chatterboxes boxes={boxes} />
      </div>
    </div>
  );
}

//TODO
//https://ui.shadcn.com/docs/installation/remix
