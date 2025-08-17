import React, { createContext, useContext, useMemo } from "react";

const SocketContext = createContext({ socket: null });

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
  const value = useMemo(() => ({ socket: null }), []);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
