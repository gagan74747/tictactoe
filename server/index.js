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

io.on("connection", (socket) => {
            console.log(socket.id)
            socket.on('joinRoom', (roomId) => {
            console.log('joinRoom',roomId);
            const room = roomId.toString();
            socket.join(room);
            socket.on('opponentTurnPayload', (arg) => {
            console.log('fire', arg);
            socket.to(room).emit('message', arg);
        });
            socket.on('nextturn', () => {
            console.log('nextturn', room)
            socket.to(room).emit('setturn')
        })
    });
});
