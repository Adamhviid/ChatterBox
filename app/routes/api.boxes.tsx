import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getDatabase } from "../../src/database";

// Read (GET)
export const loader: LoaderFunction = async () => {
  const db = getDatabase();
  const boxes = await db.collection("boxes").find().toArray();
  return json({ boxes });
};

/* export const action: ActionFunction = async ({ request }) => {
  const db = getDatabase();
  const formData = await request.formData();
  const method = request.method;

  switch (method) {
    case "POST": {
      const name = formData.get("name");
      const result = await db.collection("boxes").insertOne({ name });
      return json({ insertedId: result.insertedId });
    }

    case "PUT": {
      const id = formData.get("id");
      const name = formData.get("name");
      const result = await db.collection("boxes").updateOne({ _id: new Object(id) }, { $set: { name } });
      return json({ modifiedCount: result.modifiedCount });
    }

    case "DELETE": {
      const id = formData.get("id");
      const result = await db.collection("boxes").deleteOne({ _id: new Object(id) });
      return json({ deletedCount: result.deletedCount });
    }

    default:
      return json({ error: "Method not allowed" }, { status: 405 });
  }
}; */
