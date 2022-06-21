import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
export default socket;

export const socketEvents={
    joinRoom:(roomId)=>{
    socket.emit("joinRoom", roomId);
    },
    opponentTurn:(payload)=>{
        socket.emit('opponentTurnPayload',payload);
    },
    nextTurn:()=>{""
        socket.emit("nextturn");
    }}
   socket.on("message",(ar)=>{
   console.log(ar);
    });