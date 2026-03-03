import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/dbConnect.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
dotenv.config()
connectDB();

// middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

 //start server
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));