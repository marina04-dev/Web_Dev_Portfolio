// --------------- IMPORTS AND INITIALIZATIONS ---------------
// Importing necessary modules
import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as authRoutes } from '#routes/auth.routes.js';
import { router as userRoutes } from '#routes/user.routes.js';
import securityMiddleware from '#middlewares/security.middleware.js';

// Initializing the Express application
const app = express();

// --------------- MIDDLEWARES ---------------

// Middleware to enhance security with various HTTP headers
app.use(helmet());

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware for logging HTTP requests in 'combined' format
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

// Custom security middleware to protect routes
app.use(securityMiddleware);

// --------------- ROUTES ---------------
// Defining a simple route to respond with "API Is Working!"
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.status(200).send('API Is Working!');
});

// Defining the health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check endpoint accessed');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Defining the base path for api
app.get('/api', (req, res) => {
  logger.info('API base endpoint accessed');
  res.status(200).json({ message: "Application's API is running!" });
});

// using authentication routes
app.use('/api/auth', authRoutes);
// using user routes
app.use('/api/users', userRoutes);

// route for not found page
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Exporting the app for potential testing or further configuration
export default app;
