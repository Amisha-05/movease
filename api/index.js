import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors package
import userRouter from './Routes/user.route.js';
import authRouter from './Routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './Routes/listing.route.js'
dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Use cors middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend domain
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing',listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
