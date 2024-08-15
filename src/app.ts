import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config';
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';

dotenv.config(); 

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
