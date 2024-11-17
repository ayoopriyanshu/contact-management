import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/config.js';
import contactRoutes from './routes/contact.js';

const __dirname = path.resolve();

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.use('/api/contacts', contactRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));