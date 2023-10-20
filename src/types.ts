export type LogLevel = 'debug' | 'error' | 'info'

export interface LogFn {
    (object: unknown, message?: string, ...args: unknown[]): void
    (message: string, ...args: unknown[]): void
}

export interface Logger {
    debug: LogFn
    info: LogFn
    error: LogFn
}

export type OnExitFn = () => Promise<void> | void

export interface OnExitOptions {
    /**
     * Logger to use.
     * You should use libraries for structured logging such as
     * [pino](https://github.com/pinojs/pino), but you can also use the built-in `console` object.
     *
     * Set to `false` to disable logging.
     *
     * @default
     * console
     */
    logger?: Console | Logger | false
    /**
     * Log level to use.
     *
     * @default
     * 'info'
     */
    logLevel?: LogLevel
    /**
     * Prefix to use for log messages.
     *
     * Set to empty string to disable prefixing.
     *
     * @default
     * '[gracy] '
     */
    logPrefix?: string
    /**
     * Timeout (in milliseconds) to wait for the function to finish.
     * If the function does not finish in time, the process will exit with code `1`.
     *
     * @default
     * 10_000
     */
    timeout?: number
    /**
     * Events to listen to.
     * Triggering these events will cause the process to exit with code `1`.
     *
     * @default
     * ['uncaughtException', 'unhandledRejection']
     */
    events?: string[]
    /**
     * Signals to listen to.
     * Triggering these signals will cause the process to exit with code `0`.
     *
     * @default
     * ['SIGTERM', 'SIGINT']
     */
    signals?: NodeJS.Signals[]
}
