import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getDatabase } from "../../src/database";

export const loader: LoaderFunction = async ({ request }) => {
  const box = new URL(request.url).searchParams.get("box");
  const db = getDatabase();
  const query = box ? { box } : {};
  const messages = await db.collection("messages").find(query).toArray();
  return json({ messages });
};
