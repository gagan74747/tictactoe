const mongoose = require('mongoose');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const app = express();
const cors = require("cors");
const User=require('./models/user');
const Users = require('./models/user');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});
  mongoose.connect('mongodb://localhost/tictactoe')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error(`${err}`));

instrument(io, {
  auth: false,
});
app.use(express.json());
app.use(
  cors({
origin: "*",
credentials: "true",
  })
);
app.post("/signup", async (req, res) => {
    try{
    const { username, password } = req.body;
    const user=new Users({username,password});
    await user.save();
    res.send("user registered successfully");
    }catch(err){
     res.send(err);
    }
});
io.on("connection", (socket) => {
console.log(socket.id);
socket.on("joinRoom", (roomId) => {
console.log("joinRoom", roomId);
const room = roomId.toString();
if (
io.sockets.adapter.rooms.get(room) &&
io.sockets.adapter.rooms.get(room).size === 2
){
socket.emit("roomFull");
}else {
socket.emit("roomAvailable");
socket.join(room);
}
    socket.on("leaveRoom", () => {
      socket.leave(room);
    });
    socket.on("opponentTurnPayload", (arg) => {
      socket.to(room).emit("message", arg);
    });
    socket.on("nextturn", () => {
      socket.to(room).emit("setturn");
    });
    socket.on("onGameComponentMount", () => {
      io.sockets.adapter.rooms.get(room) &&
        io.sockets.adapter.rooms.get(room).size === 1 &&
      socket.emit("inWaiting");
      io.sockets.adapter.rooms.get(room) &&
      io.sockets.adapter.rooms.get(room).size === 2 &&
        socket.to(room).emit("startGame");
    });
    socket.on("disconnect", () => {
      socket.to(room).emit("anotherplayerdisconnected"); // undefined
    });
  });
});
httpServer.listen(5000);
