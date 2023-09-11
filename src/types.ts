interface LogFn {
    (object: unknown, message?: string, ...args: unknown[]): void
    (message: string, ...args: unknown[]): void
}

export interface Logger {
    debug: LogFn
    fatal: LogFn
}

export type OnExitFn = () => Promise<void> | void

export interface OnExitOptions {
    /**
     * Events to listen to.
     * Triggering these events will cause the process to exit with code `1`.
     *
     * Defaults to
     * `['uncaughtException', 'unhandledRejection']`
     */
    events?: string[]
    /**
     * Logger to use.
     * You should use libraries for structured logging such as
     * [pino](https://github.com/pinojs/pino), but you can also use the built-in `console` object.
     *
     * Set to `false` to disable logging.
     */
    logger: Console | Logger | false
    /**
     * Signals to listen to.
     * Triggering these signals will cause the process to exit with code `0`.
     *
     * Defaults to
     * `['SIGTERM', 'SIGINT']`
     */
    signals?: NodeJS.Signals[]
}
