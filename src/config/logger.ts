import { createLogger, transports, format } from 'winston';

const { combine, timestamp, printf, colorize } = format;

/**
 * Custom log format that includes timestamp and level
 */
const logFormat = printf(({ level, message, timestamp }) => {
  const time = new Date(timestamp as string).toLocaleTimeString();
  return `[${level}] ${time} ${message}`;
});

/**
 * Winston logger configuration with console transport
 */
export const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize({ all: false, colors: { info: 'cyan' } }),
    logFormat,
  ),
  transports: [new transports.Console()],
});
