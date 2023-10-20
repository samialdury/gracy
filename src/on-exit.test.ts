/* eslint-disable unicorn/no-useless-promise-resolve-reject */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { LogFn } from './types.js'
import { defaultOptions, onExit } from './on-exit.js'

await test('onExit', async (t) => {
    type MockLogFn = ReturnType<typeof t.mock.fn<LogFn>>

    let mockLogger: {
        debug: MockLogFn
        info: MockLogFn
        error: MockLogFn
    }

    t.beforeEach(() => {
        t.mock.restoreAll()
        t.mock.reset()

        mockLogger = {
            debug: t.mock.fn(),
            info: t.mock.fn(),
            error: t.mock.fn(),
        } satisfies typeof mockLogger

        for (const event of [
            ...defaultOptions.events,
            ...defaultOptions.signals,
            'beforeExit',
        ]) {
            process.removeAllListeners(event)
        }
    })

    await t.test('should be a function', () => {
        assert.equal(typeof onExit, 'function')
    })

    await t.test('should throw TypeError if not passed a function', () => {
        try {
            onExit('not a function' as unknown as () => void, {
                logger: false,
            })

            assert.fail('Should throw error by now')
        } catch (err) {
            if (err instanceof Error) {
                assert(err instanceof TypeError, 'Should be TypeError')
                assert.equal(err.message, 'Expected a function, got string')
            } else {
                assert.fail(`Should throw Error, got ${typeof err}`)
            }
        }
    })

    await t.test('should register function', (t) => {
        const mockExitFn = t.mock.fn(async () => {
            return Promise.resolve()
        })

        onExit(mockExitFn, {
            logger: mockLogger,
            logLevel: 'debug',
        })

        assert.equal(mockExitFn.mock.calls.length, 0)
        assert.equal(mockLogger.debug.mock.calls.length, 2)
        assert.equal(
            mockLogger.debug.mock.calls[0]?.arguments[0],
            '[gracy] Registering exit handlers',
        )
        assert.equal(
            mockLogger.debug.mock.calls[1]?.arguments[0],
            '[gracy] Exit handlers registered',
        )
        assert.equal(mockLogger.error.mock.calls.length, 0)
    })

    t.todo('should call registered function on beforeExit')

    await t.test('should log to console', () => {
        const mockExitFn = t.mock.fn(async () => {
            return Promise.resolve()
        })

        const consoleDebugSpy = t.mock.method(console, 'debug')
        const consoleErrorSpy = t.mock.method(console, 'error')

        onExit(mockExitFn, { logger: console, logLevel: 'debug' })

        assert.equal(mockExitFn.mock.calls.length, 0)
        assert.equal(consoleDebugSpy.mock.calls.length, 2)
        assert.equal(
            consoleDebugSpy.mock.calls[0]?.arguments[0],
            '[gracy] Registering exit handlers',
        )
        assert.equal(
            consoleDebugSpy.mock.calls[1]?.arguments[0],
            '[gracy] Exit handlers registered',
        )
        assert.equal(consoleErrorSpy.mock.calls.length, 0)
    })

    await t.test('should disable log if logger option is set to false', () => {
        const mockExitFn = t.mock.fn(async () => {
            return Promise.resolve()
        })

        const consoleDebugSpy = t.mock.method(console, 'debug')
        const consoleErrorSpy = t.mock.method(console, 'error')

        onExit(mockExitFn, { logger: false })

        assert.equal(mockExitFn.mock.calls.length, 0)
        assert.equal(consoleDebugSpy.mock.calls.length, 0)
        assert.equal(consoleErrorSpy.mock.calls.length, 0)
    })

    await t.test('should use custom logger', () => {
        const mockExitFn = t.mock.fn(async () => {
            return Promise.resolve()
        })

        const consoleDebugSpy = t.mock.method(console, 'debug')
        const consoleErrorSpy = t.mock.method(console, 'error')

        onExit(mockExitFn, {
            logger: mockLogger,
            logLevel: 'debug',
        })

        assert.equal(mockExitFn.mock.calls.length, 0)
        assert.equal(mockLogger.debug.mock.calls.length, 2)
        assert.equal(
            mockLogger.debug.mock.calls[0]?.arguments[0],
            '[gracy] Registering exit handlers',
        )
        assert.equal(
            mockLogger.debug.mock.calls[1]?.arguments[0],
            '[gracy] Exit handlers registered',
        )
        assert.equal(mockLogger.error.mock.calls.length, 0)
        assert.equal(consoleDebugSpy.mock.calls.length, 0)
        assert.equal(consoleErrorSpy.mock.calls.length, 0)
    })

    await t.test('should log without prefix', () => {
        const mockExitFn = t.mock.fn(async () => {
            return Promise.resolve()
        })

        const consoleDebugSpy = t.mock.method(console, 'debug')
        const consoleErrorSpy = t.mock.method(console, 'error')

        onExit(mockExitFn, {
            logger: mockLogger,
            logPrefix: '',
            logLevel: 'debug',
        })

        assert.equal(mockExitFn.mock.calls.length, 0)
        assert.equal(mockLogger.debug.mock.calls.length, 2)
        assert.equal(
            mockLogger.debug.mock.calls[0]?.arguments[0],
            'Registering exit handlers',
        )
        assert.equal(
            mockLogger.debug.mock.calls[1]?.arguments[0],
            'Exit handlers registered',
        )
        assert.equal(mockLogger.error.mock.calls.length, 0)
        assert.equal(consoleDebugSpy.mock.calls.length, 0)
        assert.equal(consoleErrorSpy.mock.calls.length, 0)
    })

    t.todo('events')
    t.todo('signals')
})
