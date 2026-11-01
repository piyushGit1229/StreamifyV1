import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    // ORIGINAL IMPLEMENTATION – PRESERVED FOR REFERENCE
    // socket = io("http://localhost:5000", {
    //   transports: ["websocket", "polling"],
    //   withCredentials: true,
    // });

    // NEW IMPLEMENTATION – CONFIGURABLE SOCKET URL
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
