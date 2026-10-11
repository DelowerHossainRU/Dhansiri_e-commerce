require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

let server;

// Verify required environment variables
const checkRequiredEnv = () => {
  const missing = [];
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    missing.push('JWT_SECRET');
  }
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    console.warn('[Warning] MONGO_URI not explicitly set; defaulting to local mongodb instance.');
  }
  if (missing.length > 0) {
    console.error(`[Fatal Config Error] Missing required production environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

const startServer = async () => {
  checkRequiredEnv();
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`[Server] Dhansiri Agro Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
};

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      try {
        await mongoose.connection.close(false);
        console.log('[Database] MongoDB connection closed cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('[Database] Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    // Fallback force exit if shutdown hangs
    setTimeout(() => {
      console.error('[Server] Could not close connections within timeout, forcefully terminating.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', error);
  gracefulShutdown('uncaughtException');
});

startServer();
