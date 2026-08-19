type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const formattedLevel = level.toUpperCase().padEnd(5);
    const metaString = meta ? ` | ${typeof meta === 'object' ? JSON.stringify(meta) : meta}` : '';
    return `[${timestamp}] [${formattedLevel}]: ${message}${metaString}`;
  }

  info(message: string, meta?: unknown): void {
    console.log(`\x1b[36m${this.formatMessage('info', message, meta)}\x1b[0m`);
  }

  warn(message: string, meta?: unknown): void {
    console.warn(`\x1b[33m${this.formatMessage('warn', message, meta)}\x1b[0m`);
  }

  error(message: string, meta?: unknown): void {
    console.error(`\x1b[31m${this.formatMessage('error', message, meta)}\x1b[0m`);
  }

  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`\x1b[35m${this.formatMessage('debug', message, meta)}\x1b[0m`);
    }
  }
}

export const logger = new Logger();
export default logger;
