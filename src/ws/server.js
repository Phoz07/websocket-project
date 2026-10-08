import { WebSocketServer, WebSocket } from "ws";

const sendJson = (ws, data) => {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(data));
};

const broadcast = (wss, payload) => {
  for (const client of wss.clients) {
    sendJson(client, payload);
  }
};

export const attachWebSocketServer = (server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    sendJson(socket, { type: "connected" });
    socket.on("error", console.error);
  });

  const broadcastMatchCreated = (match) => {
    broadcast(wss, { type: "match_created", match });
  };

  return { broadcastMatchCreated };
};
