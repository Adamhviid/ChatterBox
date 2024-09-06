import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getDatabase } from "../../src/database";

export const loader: LoaderFunction = async ({ request }) => {
  const box = new URL(request.url).searchParams.get("box");
  const db = getDatabase();

  const messages = await db.collection("messages").find({ box }).toArray();
  return json({ messages });
};
