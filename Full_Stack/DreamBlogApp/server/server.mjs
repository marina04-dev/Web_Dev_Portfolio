import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.mjs';
import adminRouter from './routes/adminRoutes.mjs';
import blogRouter from './routes/blogRoutes.mjs';


const app = express();
await connectDB()

// Middlewares 
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('API is Working'));
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server Is Listening On Port ' + PORT);
});

export default app;