import express from 'express';
import pino from 'pino';

const app = express();
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const PORT = process.env.PORT || 3003;
const SERVICE_NAME = 'Order Management Service';

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: SERVICE_NAME,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: `CropFresh `,
    version: '0.1.0'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(` running on port `);
});

export default app;
