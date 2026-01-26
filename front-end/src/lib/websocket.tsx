import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  // Track retry count for exponential backoff or similar (simple implementation for now)
  const retryCount = useRef(0);

  useEffect(() => {
    const connect = () => {
      // In dev, Vite proxies /api but usually not ws://. We assume default localhost:8000 for backend
      // Adjust if env vars provided
      const wsUrl = 'ws://localhost:8000/ws';
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        retryCount.current = 0;
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        socketRef.current = null;

        // Simple reconnect logic: try again in 3s
        setTimeout(() => {
            if (!socketRef.current) {
                console.log('Attempting to reconnect...');
                connect();
            }
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      socketRef.current = ws;
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
