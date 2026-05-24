let io;
module.exports = {
  init: (httpServer) => {
    if (io) {
      console.warn("Socket.io already initialized.");
      return io;
    }
    io = require('socket.io')(httpServer, { 
      cors: { 
        origin: "*", // Keep this for development, change to specific domain for production
        methods: ["GET", "POST"]
      } 
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized. Call init() first!");
    return io;
  }
};