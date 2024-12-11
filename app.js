import express from 'express';
import cors from 'cors';
import winston from 'winston';
import routes from './src/routes.js';
import errorMiddleware from './middleware/error-middleware.js';
import response from './lib/shared/src/http/response.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(errorMiddleware);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level} ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

app.use((req, res, next) => {
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  logger.log('error', 'This is an error message');
  logger.log('warn', 'This is a warning message');
  logger.log('info', 'This is an info message');
  logger.log('verbose', 'This is a verbose message');
  logger.log('debug', 'This is a debug message');
  logger.log('silly', 'This is a silly message');
  res.send('Hello, world!');
});

app.get('/error', (req, res, next) => {
  throw new Error('This is a test error');
});

routes(app);

app.use((req, res, next) => {
  const status = response.status.NOT_FOUND;
  const data = response.dispatch({
    error: 'Not Found',
    code: status,
  });
  return res.status(status).json(data);
});

export default app;
