import type { LogLevel, Logger } from './types.js'

export class GracyLogger {
    public enabled: boolean
    public logger: Console | Logger | false
    public level: LogLevel
    public prefix: string

    constructor(
        type: Console | Logger | false,
        level: LogLevel,
        prefix: string,
    ) {
        if (type === false) {
            this.enabled = false
        }

        this.enabled = true
        this.logger = type as Console | Logger
        this.level = level
        this.prefix = prefix
    }

    private useConsole(logger: typeof this.logger): logger is Console {
        // eslint-disable-next-line no-console
        return logger instanceof console.Console
    }

    private shouldLog(logger: typeof this.logger): logger is Console | Logger {
        return this.enabled && logger !== false
    }

    private logLevelToNumber(level: LogLevel): number {
        switch (level) {
            case 'debug': {
                return 20
            }
            case 'info': {
                return 30
            }
            case 'error': {
                return 50
            }
        }
    }

    private log(
        level: LogLevel,
        objectOrMessage: unknown,
        message?: string,
    ): void {
        if (!this.shouldLog(this.logger)) {
            return
        }

        if (this.logLevelToNumber(level) < this.logLevelToNumber(this.level)) {
            return
        }

        if (typeof objectOrMessage === 'string' && !message) {
            // Only a message was passed
            if (this.useConsole(this.logger)) {
                this.logger[level](`${this.prefix}${objectOrMessage}`)
            } else {
                this.logger[level](this.prefix + objectOrMessage)
            }
        } else if (message) {
            // An object and a message were passed
            if (this.useConsole(this.logger)) {
                this.logger[level](`${this.prefix}${message}`, objectOrMessage)
            } else {
                this.logger[level](objectOrMessage, this.prefix + message)
            }
        }
    }

    debug(object: unknown, message?: string): void
    debug(message: string): void
    debug(objectOrMessage: unknown, message?: string): void {
        this.log('debug', objectOrMessage, message)
    }

    info(object: unknown, message?: string): void
    info(message: string): void
    info(objectOrMessage: unknown, message?: string): void {
        this.log('info', objectOrMessage, message)
    }

    error(object: unknown, message?: string): void
    error(message: string): void
    error(objectOrMessage: unknown, message?: string): void {
        this.log('error', objectOrMessage, message)
    }
}
