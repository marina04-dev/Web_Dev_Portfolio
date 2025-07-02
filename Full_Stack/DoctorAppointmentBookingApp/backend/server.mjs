import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.mjs';
import connectCloudinary from './config/cloudinary.mjs';
import adminRouter from './routes/adminRoute.mjs';
import doctorRouter from './routes/doctorRoute.mjs';
import userRouter from './routes/userRoute.mjs';

// app config 
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/admin', adminRouter);
// e.x. localhost:4000/api/admin/add-doctor
app.use('/api/doctor', doctorRouter);
// e.x. localhost:4000/api/doctor/list
app.use('/api/user', userRouter);
// e.x. localhost:4000/api/user/register

app.get('/', (req, res) => {
    res.send('API Is Working Successfully!');
});

app.listen(port, () => console.log("Server Is Running On Port ", port));