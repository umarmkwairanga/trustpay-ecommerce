import { writeFileSync } from 'fs';

const code = `import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
});

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TrustPayEcommerce';
const PORT = process.env.PORT || 5000;

console.log("Connecting to MongoDB...");

mongoose.connect(dbUri)
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        app.listen(PORT, () => console.log(\`Server is live at http://localhost:\${PORT}\`));
    })
    .catch(err => console.error("Failed to connect to MongoDB:", err.message));
`;

writeFileSync('server.js', code);
console.log("server.js has been overwritten with clean code.");