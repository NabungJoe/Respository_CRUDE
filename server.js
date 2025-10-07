import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import User from './models/usersModel.js';

//ROUTER

import authRouter from './routers/authRouter.js';
import postRouter from './routers/postRouter.js';


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
dotenv.config();
app.use(cors({
    origin: [
        'http://localhost:5173', // Vite dev
        'http://localhost:3000', // Backend (if frontend served from here)
    ],
    credentials: true
}));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database connected');
}).catch(err=>{
 console.log(err);
});


app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);






app.get('/', async (req, res) => {
    try{
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
