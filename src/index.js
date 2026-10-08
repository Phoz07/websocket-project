import express from "express";
import http from "http";
import matchesRouter from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Server is running",
    statusCode: response.statusCode,
  });
});

app.use("/matches", matchesRouter);
const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  console.log(`WebSocket server is running at ws://${HOST}:${PORT}/ws`);
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
