import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import type { NextApiResponseIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function ioHandler(
  _req: NextApiRequest,
  res: NextApiResponseIo
) {
  // Make sure the socket server exists before initializing IO
  if (!res.socket?.server) {
    console.error("Socket server is not ready yet.");
    res.status(500).end();
    return;
  }

  if (!res.socket.server.io) {
    console.log("Starting new Socket.io server...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  } else {
    console.log("Socket.io server already running.");
  }

  res.end();
}
