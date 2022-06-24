const mongoose = require('mongoose');
const express = require("express");
const bcrypt = require('bcryptjs');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const app = express();
const cors = require("cors");
const jwt=require('jsonwebtoken');
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
}));

app.post("/signup", async (req, res) => {
try{
const { username, password } = req.body;
if(!(username &&  password))
return res.status(400).json({message:"Field can't be empty"});
const user=new Users({username,password});
user.password = await bcrypt.hash(user.password, 10);
await user.save();
const token = jwt.sign(
{ _id: user._id},
'iugiuvhgeliuvgeiuvgfeuvgeivg'
);
res.header('x-auth-token', token);
res.json({message:"User registered successfully"});
}catch(err){
if(err.code===11000)
return res.status(409).json({message:'User already exist'});
res.status(400).json({message:''+err});
}
});

app.post('/login', async (req,res)=> {
try {
const { username, password } = req.body;
if(!(username &&  password))
return res.status(400).json({message:"Field can't be empty"});
const user = await Users.findOne({ username });
if(!user) {
return res.status(401).json({ message: 'User Not Found' });
}
const passwordMatch = await bcrypt.compare(password, user.password);
if (passwordMatch) {
const token = jwt.sign(
{ _id: user._id},
'iugiuvhgeliuvgeiuvgfeuvgeivg'
);
res.header('x-auth-token', token);
return res.status(200).json({ message: 'Success' });
}
res.status(401).json({ message: 'Invalid Password' });
} catch (err) {
return res.status(401).json({ message: ` ${err}` });
}});

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
})
})
});
httpServer.listen(5000);
