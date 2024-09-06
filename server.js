import { createServer } from "http";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

// You need to create the HTTP server from the Express app
const httpServer = createServer(app);

// And then attach the socket.io server to the HTTP server
const io = new Server(httpServer);

//connect to database
const database = new MongoClient(process.env.MONGODB_URI);

async function connectToMongoDB() {
  try {
    await database.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

io.on("connection", async (socket) => {
  socket.emit("confirmation", "connected!");

  const db = database.db('chatterbox')

  try {
    const messages = await db.collection("messages")
      .find()
      .limit(10)
      .toArray();

    socket.emit("connection_messages", messages);
  } catch (err) {
    console.error("Failed to retrieve messages", err);
  }

  socket.on("message", async (data) => {
    const timestamp = new Date()
    const messageData = { message: data, timestamp };

    await db.collection("messages").insertOne(messageData)

    // Broadcast the message to all connected clients
    io.emit("message", messageData);
  });
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;

// instead of running listen on the Express app, do it on the HTTP server
httpServer.listen(port, async () => {
  console.log(`Express server listening at http://localhost:${port}`);
  await connectToMongoDB();
});