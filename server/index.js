const console = require("console");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const app = express();
const httpServer = createServer(app);
const io = new Server(5000, {
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io"],
        credentials: true
    }
});

instrument(io, {
    auth: false
});
let room;
io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on('joinRoom', (roomId) => {
        room = roomId.toString();
        console.log(room)
        socket.join(room)
        socket.on("hello", (arg) => {
            console.log('fire', room)
            socket.to('a').emit('message', arg);
            // socket.broadcast.emit('message', arg);
        });
        socket.on('nextturn', () => {
            console.log('fire1', room)
            socket.to('a').emit('setturn')
            // socket.broadcast.emit('setturn')
        })
    });
});
