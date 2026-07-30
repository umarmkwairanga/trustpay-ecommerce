import { errorHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';

app.use('/api/products', productRoutes);

// Always place this AFTER your routes
app.use(errorHandler);