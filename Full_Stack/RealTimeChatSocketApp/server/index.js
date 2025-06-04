const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors({
    origin: "http://localhost:3000", // Adjust if your frontend runs on a different port
    methods: ["GET", "POST"]
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust if your frontend runs on a different port
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        if (data) {
            socket.join(data);
            console.log(`User With ID: ${socket.id} Joined Room: ${data}`);
        } else {
            console.error(`User With ID: ${socket.id} tried to join with invalid room data`);
        }
    });

    socket.on("send_message", (data) => {
        if (data && data.room) {
            io.to(data.room).emit("receive_message", data);
        } else {
            console.error(`User With ID: ${socket.id} tried to send invalid message data`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => { // Backend is set to listen on port 3001
    console.log("Server Listening On Port 3001");
});