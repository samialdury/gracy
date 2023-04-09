import process from 'node:process'
import { types } from 'node:util'

import type { Logger, OnExitFn, OnExitOptions } from './types.js'

const LOG_PREFIX = '[gracy]'

const DEFAULT_EVENTS: string[] = ['uncaughtException', 'unhandledRejection']
const DEFAULT_SIGNALS: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']

/**
 * Execute custom cleanup functions before Node.js exits.
 *
 * `options` - See {@link OnExitOptions}.
 *
 * `fns` - Functions to run before exiting the process.
 *         Could be synchronous or asynchronous.
 *         Will be called in the order they are passed.
 */
export function onExit(options: OnExitOptions, ...fns: OnExitFn[]): void {
	const logger = options.logger
	const events = options.events ?? DEFAULT_EVENTS
	const signals = options.signals ?? DEFAULT_SIGNALS

	function loggerEnabled(
		logger: Logger | Console | false
	): logger is Logger | Console {
		return logger !== false
	}

	function useConsole(logger: Logger | Console): logger is Console {
		return logger instanceof console.Console
	}

	function logFatal(err: unknown, msg: string): void {
		if (!loggerEnabled(logger)) {
			return
		}

		if (useConsole(logger)) {
			logger.error(`${LOG_PREFIX} ${msg}`, err)
			return
		}

		logger.fatal(err, `${LOG_PREFIX} ${msg}`)
	}

	function logDebug(object: unknown, msg?: string): void
	function logDebug(msg: string): void
	function logDebug(objectOrMsg: unknown, msg?: string): void {
		if (!loggerEnabled(logger)) {
			return
		}

		if (typeof msg === 'undefined') {
			msg = objectOrMsg as string
			logger.debug(`${LOG_PREFIX} ${msg}`)
			return
		}

		const object = objectOrMsg

		if (useConsole(logger)) {
			logger.debug(`${LOG_PREFIX} ${msg}`, object)
			return
		}

		logger.debug(object, `${LOG_PREFIX} ${msg}`)
	}

	logDebug('Registering exit handlers')

	for (const fn of fns) {
		if (typeof fn !== 'function') {
			throw new TypeError(`Expected a function, got ${typeof fn}`)
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	process.on('beforeExit', async (code) => {
		try {
			logDebug({ code }, 'Received beforeExit hook')

			for (const fn of fns) {
				if (types.isAsyncFunction(fn)) {
					await fn()
				} else {
					void fn()
				}
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
