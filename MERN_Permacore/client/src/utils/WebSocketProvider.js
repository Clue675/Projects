import React, { createContext, useContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:5000';
    const ws = new WebSocket(wsUrl);

    const onOpen = () => {
      console.log('WebSocket connected');
      setWebSocket(ws);
    };

    const onMessage = (event) => {
      console.log('Received message:', event.data);
    };

    const onClose = () => {
      console.log('WebSocket disconnected');
      setWebSocket(null);
    };

    const onError = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };

    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onclose = onClose;
    ws.onerror = onError;

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(message);
    } else {
      console.log("WebSocket not connected. Message not sent:", message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ webSocket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
