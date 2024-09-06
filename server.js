import { createServer } from "http";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

import { databaseConnection } from './src/database.js'
import { initializeWebSocket } from './src/websocket.js'

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
const httpServer = createServer(app);
initializeWebSocket(httpServer);

app.use(compression());
app.disable("x-powered-by");

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

app.use(express.static("build/client", { maxAge: "1h" }));
app.use(morgan("tiny"));
app.all("*", remixHandler);

const port = process.env.PORT || 3000;

httpServer.listen(port, async () => {
  console.log(`Express server listening at http://localhost:${port}`);
  await databaseConnection();
});