import process from 'node:process'
import type { OnExitFn, OnExitOptions } from './types.js'
import { GracyLogger } from './logger.js'

export const defaultOptions: Required<OnExitOptions> = {
    logger: console,
    logLevel: 'info',
    logPrefix: '[gracy] ',
    timeout: 10_000,
    events: ['uncaughtException', 'unhandledRejection'],
    signals: ['SIGTERM', 'SIGINT'],
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Execute custom cleanup function before Node.js exits.
 *
 * `fn` - Function to run before exiting the process.
 *        Could be synchronous or asynchronous.
 *
 * `options` - See {@link OnExitOptions}.
 */
export function onExit(fn: OnExitFn, options?: OnExitOptions): void {
    const { logger, logLevel, logPrefix, timeout, events, signals } = {
        ...defaultOptions,
        ...options,
    } as typeof defaultOptions

    const log = new GracyLogger(logger, logLevel, logPrefix)

    log.debug('Registering exit handlers')

    if (typeof fn !== 'function') {
        throw new TypeError(`Expected a function, got ${typeof fn}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    process.on('beforeExit', async (code) => {
        try {
            log.info({ code }, 'Shutting down gracefully')

            await Promise.race([
                sleep(timeout).then(() => {
                    throw new Error(
                        `Cleanup function did not finish in time (${timeout}ms)`,
                    )
                }),
                fn(),
            ])

            log.info({ code }, 'Graceful shutdown complete')
        } catch (err) {
            log.error(err, 'Cleanup function failed')
            code = 1
        } finally {
            log.info({ code }, 'Exiting process')
            process.exit(code)
        }
    })

    for (const event of events) {
        process.once(event, (err) => {
            log.error(err, `Received ${event}`)

            process.once(event, () => {
                log.debug(`Received ${event} again`)
                log.error({ code: 1 }, 'Forcing exit')
                process.exit(1)
            })

            process.emit('beforeExit', 1)
        })
    }

    for (const signal of signals) {
        process.once(signal, () => {
            log.debug(`Received ${signal}`)

            process.once(signal, () => {
                log.debug(`Received ${signal} again`)
                log.error({ code: 1 }, 'Forcing exit')
                process.exit(1)
            })

            process.emit('beforeExit', 0)
        })
    }

    log.debug('Exit handlers registered')
}
