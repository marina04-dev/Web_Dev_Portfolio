import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

// Initialize Express App
const app = express();

const PORT = process.env.PORT || 5000;

await connectDB();

// Middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Running!');
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

app.listen(PORT, () => console.log(`Server Is Listening On Port ${PORT}`));