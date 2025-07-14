const express = require('express');
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");

const { addUser } = require('./utils/users');

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend
    methods: ["GET", "POST"]
  }
});

// Routes
app.get('/', (req, res) => {
  res.send("This is the MERN realtime collaborative whiteboard backend");
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    const users=addUser(data);
    // socket.emit("userIsJoined", { success: true,users });
    socket.emit("userIsJoined", { success: true, user: data, users });

    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast.to(roomId).emit("WhiteBoardDataResponse", {
      imgURL: imgURLGlobal,
    });
  });

  socket.on("WhiteBoardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("WhiteBoardDataResponse", {
      imgURL: data,
    });
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
