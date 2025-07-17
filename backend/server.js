const express = require('express');
const app = express();
app.use(express.json());

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require('cors'); 
const axios = require('axios');

const { addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Routes
app.get('/', (req, res) => {
  res.send("This is the MERN realtime collaborative whiteboard backend");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

// Run code endpoint with polling
app.post('/run', async (req, res) => {
  const { code, language } = req.body;

  const languageMap = {
    javascript: 63,
    python: 71,
    c: 50,
    cpp: 54,
  };

  try {
    const submissionRes = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        source_code: code,
        language_id: languageMap[language] || 63,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '191bea411emshea9d29947f8f32dp1eadf1jsn88386b501171',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const { token } = submissionRes.data;

    const pollResult = async () => {
      try {
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': '191bea411emshea9d29947f8f32dp1eadf1jsn88386b501171',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        if (result.data.status.id <= 2) {
          setTimeout(pollResult, 1000);
        } else {
          res.json(result.data);
        }
      } catch (pollErr) {
        console.error("Error polling code execution result:", pollErr);
        res.status(500).json({ error: 'Error fetching execution result' });
      }
    };

    pollResult();

  } catch (err) {
    console.error("Code execution error:", err);
    res.status(500).json({ error: 'Failed to run code' });
  }
});

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST"]
  }
});

let imgURLGlobal = null; // keep latest whiteboard image

io.on("connection", (socket) => {

  socket.on("userJoined", (data) => {
  const { name, userId, roomId, host, presenter } = data;
  socket.join(roomId);

  const users = addUser({ name, userId, roomId, host, presenter, socketId: socket.id });

  // Send success + users list to the joining user
  socket.emit("userIsJoined", { success: true, user: data, users });

  // Send a toast message to the joining user explicitly
  socket.emit("userJoinedMessageBroadcast", "You joined the room");

  // Broadcast to others in the room that someone joined
  socket.broadcast.to(roomId).emit("userJoinedMessageBroadcast", name);

  socket.broadcast.to(roomId).emit("allUsers", users);

  if (imgURLGlobal) {
    socket.emit("WhiteBoardDataResponse", { imgURL: imgURLGlobal });
  }
});;

  socket.on("WhiteBoardData", (data) => {
    const user = getUser(socket.id);
    if (user) {
      imgURLGlobal = data;
      socket.broadcast.to(user.roomId).emit("WhiteBoardDataResponse", { imgURL: data });
    }
  });

  socket.on("typing", () => {
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(user.roomId).emit("typingResponse", `${user.name} is typing...`);
    }
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("codeUpdate", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate",{roomId, code});
  });

  socket.on("message", (data) => {
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(user.roomId).emit("messageResponse", { message: data.message, name: user.name });
    }
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast.to(user.roomId).emit("userLeftMessageBroadcast", user.name);

      const updatedUsers = getUsersInRoom(user.roomId);
      socket.broadcast.to(user.roomId).emit("allUsers", updatedUsers);
    }
  });

});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
