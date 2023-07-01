interface LogFn {
    (object: unknown, message?: string, ...args: unknown[]): void
    (message: string, ...args: unknown[]): void
}

export interface Logger {
    debug: LogFn
    fatal: LogFn
}

export type OnExitFn = () => void | Promise<void>

export interface OnExitOptions {
    /**
     * Logger to use.
     * You should use libraries for structured logging such as
     * [pino](https://github.com/pinojs/pino), but you can also use the built-in `console` object.
     *
     * Set to `false` to disable logging.
     */
    logger: Logger | Console | false
    /**
     * Events to listen to.
     * Triggering these events will cause the process to exit with code `1`.
     *
     * Defaults to
     * `['uncaughtException', 'unhandledRejection']`
     */
    events?: string[]
    /**
     * Signals to listen to.
     * Triggering these signals will cause the process to exit with code `0`.
     *
     * Defaults to
     * `['SIGTERM', 'SIGINT']`
     */
    signals?: NodeJS.Signals[]
}
