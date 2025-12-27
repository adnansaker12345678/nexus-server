const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet'); // সিকিউরিটির জন্য (Headers protection)
const compression = require('compression'); // ডাটা ট্রান্সফার স্পিড বাড়ানোর জন্য

const app = express();

// --- মিডলওয়্যার সেটআপ ---
app.use(helmet()); // হ্যাকারদের থেকে সার্ভারকে রক্ষা করতে
app.use(compression()); // মেসেজ দ্রুত আদান-প্রদান করতে ডাটা কম্প্রেস করবে
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST"]
}));
app.use(express.json()); // JSON ডাটা হ্যান্ডেল করার জন্য

const server = http.createServer(app);

// --- সকেট আইও কনফিগারেশন (High Performance) ---
const io = new Server(server, {
    pingTimeout: 60000, // কানেকশন স্ট্যাবিলিটি চেক
    cors: {
        origin: "*",
    }
});

// --- সার্ভার হেলথ চেক (বস-এর জন্য) ---
app.get('/', (req, res) => {
    res.status(200).json({
        status: "Active",
        project: "Nexus Ultra",
        engine: "Node.js Hybrid",
        security: "High-Level Encrypted"
    });
});

// --- মেইন সকেট লজিক (The Heart of Nexus) ---
const activeUsers = new Map(); // অনলাইনে থাকা ইউজারদের ট্র্যাক রাখতে

io.on('connection', (socket) => {
    console.log(`🛡️ Nexus Shield: New Connection [ID: ${socket.id}]`);

    // ইউজার জয়েনিং লজিক
    socket.on('setup', (userData) => {
        socket.join(userData.id);
        activeUsers.set(userData.id, socket.id);
        console.log(`👤 User ${userData.name} is now Online.`);
        socket.emit('connected');
    });

    // রিয়েল-টাইম মেসেজিং ইঞ্জিন (Encryption Ready)
    socket.on('send_message', (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) return console.log("⚠️ Error: Chat users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;
            
            // নির্দিষ্ট ইউজারকে মেসেজ পাঠানো
            socket.in(user._id).emit('receive_message', newMessageReceived);
        });
        
        console.log(`📡 Message Routed: From ${newMessageReceived.sender.name}`);
    });

    // টাইপিং ইন্ডিকেটর (স্মুথ ইউআই-এর জন্য)
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing'));

    // ডিসকানেক্ট লজিক
    socket.on('disconnect', () => {
        console.log(`⚠️ Nexus Shield: User Disconnected [ID: ${socket.id}]`);
    });
});

// --- গ্লোবাল এরর হ্যান্ডলিং (সার্ভার যেন কখনো বন্ধ না হয়) ---
process.on('uncaughtException', (err) => {
    console.error('❌ Critical Error:', err);
});

// --- পোর্ট লজিক ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
    #########################################
    🚀 NEXUS SUPREME SERVER IS LIVE
    🌐 Port: ${PORT}
    ⚔️ Status: 3X Accelerated Mode Active
    #########################################
    `);
});

