import process from 'node:process'
import { types } from 'node:util'

import type { Logger, OnExitFn, OnExitOptions } from './types.js'

const LOG_PREFIX = '[gracy]'

const DEFAULT_EVENTS: string[] = ['uncaughtException', 'unhandledRejection']
const DEFAULT_SIGNALS: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']

function loggerEnabled(
    logger: Logger | Console | false,
): logger is Logger | Console {
    return logger !== false
}

function useConsole(logger: Logger | Console): logger is Console {
    // eslint-disable-next-line no-console
    return logger instanceof console.Console
}

/**
 * Execute custom cleanup function before Node.js exits.
 *
 * `options` - See {@link OnExitOptions}.
 *
 * `fn` - Function to run before exiting the process.
 *        Could be synchronous or asynchronous.
 */
export function onExit(options: OnExitOptions, fn: OnExitFn): void {
    const logger = options.logger
    const events = options.events ?? DEFAULT_EVENTS
    const signals = options.signals ?? DEFAULT_SIGNALS

    function logFatal(err: unknown, message: string): void {
        if (!loggerEnabled(logger)) {
            return
        }

        if (useConsole(logger)) {
            logger.error(`${LOG_PREFIX} ${message}`, err)
            return
        }

        logger.fatal(err, `${LOG_PREFIX} ${message}`)
    }

    function logDebug(object: unknown, message?: string): void
    function logDebug(message: string): void
    function logDebug(objectOrMessage: unknown, message?: string): void {
        if (!loggerEnabled(logger)) {
            return
        }

        if (message === undefined) {
            message = objectOrMessage as string
            logger.debug(`${LOG_PREFIX} ${message}`)
            return
        }

        const object = objectOrMessage

        if (useConsole(logger)) {
            logger.debug(`${LOG_PREFIX} ${message}`, object)
            return
        }

        logger.debug(object, `${LOG_PREFIX} ${message}`)
    }

    logDebug('Registering exit handlers')

    if (typeof fn !== 'function') {
        throw new TypeError(`Expected a function, got ${typeof fn}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    process.on('beforeExit', async (code) => {
        try {
            logDebug({ code }, 'Received beforeExit hook')

            if (types.isAsyncFunction(fn)) {
                await fn()
            } else {
                void fn()
            }

            logDebug({ code }, 'beforeExit hook finished')
        } catch (err) {
            logFatal(err, 'Error during beforeExit hook')
            code = 1
        } finally {
            process.exit(code)
        }
    })

    for (const event of events) {
        process.on(event, (err) => {
            logFatal(err, `Received ${event}`)
            process.emit('beforeExit', 1)
        })
    }

    for (const signal of signals) {
        process.on(signal, () => {
            logDebug(`Received ${signal}`)
            process.emit('beforeExit', 0)
        })
    }

    logDebug('Exit handlers registered')
}
