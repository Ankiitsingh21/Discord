"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get the correct URL for different environments
    const serverURL = process.env.NEXT_PUBLIC_API_URL || 
                      (typeof window !== 'undefined' ? window.location.origin : '');
    
    const socketInstance = new (ClientIO as any)(serverURL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      transports: ["websocket", "polling"], // Ensure compatibility
      upgrade: true,
      rememberUpgrade: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", async (err: any) => {
      console.log("Socket connection error:", err);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      console.log("Socket disconnecting....");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};