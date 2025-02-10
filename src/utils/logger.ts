import fs from 'fs';
import path from 'path';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta ? JSON.stringify(meta) : ''}`;
    })
);

// Log rotation transport
const dailyRotateTransport = new transports.DailyRotateFile({
    filename: path.join(logDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,  // GZIP logs after rotation
    maxSize: '20m',       // Maximum log file size
    maxFiles: '30d'       // Keep logs for 30 days
});

// Create Winston logger
const logger = createLogger({
    level: 'info', // Default log level
    format: logFormat,
    transports: [
        new transports.Console({ format: format.combine(format.colorize(), logFormat) }),
        dailyRotateTransport
    ],
    exitOnError: false,
});

// Morgan logging stream
import morgan from 'morgan';
const logStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
const requestLogger = morgan('combined', { stream: logStream });

export { logger, requestLogger };
