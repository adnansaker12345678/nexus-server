const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// সার্ভার পোর্ট সেটআপ
const PORT = 3000;

io.on('connection', (socket) => {
    console.log('Nexus User Connected: ' + socket.id);

    // মেসেজ রিসিভ এবং সেন্ড করার লজিক
    socket.on('send_message', (data) => {
        console.log('New Message: ', data);
        // এটি মেসেজটি সবাইকে পাঠিয়ে দেবে (Broadcast)
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected: ' + socket.id);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexus Server is running on port ${PORT}`);
});


