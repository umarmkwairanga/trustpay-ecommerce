import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js'; // Assuming you have a DB config file
import foodRoutes from './routes/foodRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Configure this to your frontend URL in production
});

// 1. Connect Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Socket.io Logic
io.on('connection', (socket) => {
    console.log("Client connected to socket:", socket.id);

    socket.on('join-booking', (bookingId) => {
        socket.join(bookingId);
    });

    socket.on('send-location', (data) => {
        io.to(data.bookingId).emit('update-location', { 
            lat: data.lat, 
            lng: data.lng 
        });
    });
});

// 4. Routes
app.use('/api/food', foodRoutes);
// Mount future routes here (e.g., app.use('/api/travel', travelRoutes))

// 5. Global Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`TrustPayEcommerce Server running on port ${PORT}`);
});