const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorHandler = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const catalogRoutes = require('./routes/catalog.routes');
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const orderRoutes = require('./routes/order.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const wholesaleRoutes = require('./routes/wholesale.routes');
const cmsRoutes = require('./routes/cms.routes');
const adminRoutes = require('./routes/admin.routes');
const farmerRoutes = require('./routes/farmer.routes');
const qualityRoutes = require('./routes/quality.routes');

const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    platform: 'Dhansiri Agro Industries Enterprise Platform',
    timestamp: new Date().toISOString(),
    currency: 'BDT'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
