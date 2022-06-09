const console = require("console");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    socket.on("hello", (arg) => {
        console.log(arg);
        socket.broadcast.emit('message', arg);
    });
    socket.on('nextturn', () => {
        socket.broadcast.emit('setturn')
    });
    socket.on('resetState',() => {
     socket.broadcast.emit('onReset');
    })
});
httpServer.listen(5000);