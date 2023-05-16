import { onExit } from './on-exit.js'

describe('onExit', () => {
    it('should be a function', () => {
        expect(onExit).toBeInstanceOf(Function)
    })

    it('should throw TypeError if not passed a function', () => {
        try {
            onExit(
                {
                    logger: false,
                },
                'not a function' as unknown as () => void
            )

            expect.fail('Should throw error by now')
        } catch (err) {
            if (err instanceof Error) {
                expect(err).toBeInstanceOf(TypeError)
                expect(err.message).toBe('Expected a function, got string')
            } else {
                expect.fail(`Should throw Error, got ${typeof err}`)
            }
        }
    })

    it('should register function', () => {
        const mockExitFn = vi.fn().mockResolvedValue(null)

        const mockLogger = {
            debug: vi.fn(),
            fatal: vi.fn(),
        }

        onExit(
            {
                logger: mockLogger,
            },
            mockExitFn
        )

        expect(mockExitFn).not.toHaveBeenCalled()
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            1,
            '[gracy] Registering exit handlers'
        )
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            2,
            '[gracy] Exit handlers registered'
        )
        expect(mockLogger.fatal).not.toHaveBeenCalled()
    })

    describe('logger', () => {
        it('should log to console', () => {
            const mockExitFn = vi.fn()

            const consoleDebugSpy = vi
                .spyOn(console, 'debug')
                .mockImplementation(() => {
                    return
                })

            onExit({ logger: console }, mockExitFn)

            expect(mockExitFn).not.toHaveBeenCalled()
            expect(consoleDebugSpy).toHaveBeenCalled()
        })

        it('should disable log if logger option is set to false', () => {
            const mockExitFn = vi.fn()

            const consoleDebugSpy = vi.spyOn(console, 'debug')

            onExit({ logger: false }, mockExitFn)

            expect(mockExitFn).not.toHaveBeenCalled()
            expect(consoleDebugSpy).not.toHaveBeenCalled()
        })

        it('should use custom logger', () => {
            const mockExitFn = vi.fn()

            const mockLogger = {
                debug: vi.fn(),
                fatal: vi.fn(),
            }

            const consoleDebugSpy = vi.spyOn(console, 'debug')

            onExit({ logger: mockLogger }, mockExitFn)

            expect(mockExitFn).not.toHaveBeenCalled()
            expect(mockLogger.debug).toHaveBeenCalled()
            expect(consoleDebugSpy).not.toHaveBeenCalled()
        })
    })

    it('should call registered function on beforeExit', () => {
        const mockExitFn = vi.fn().mockResolvedValue(null)

        const mockLogger = {
            debug: vi.fn(),
            fatal: vi.fn(),
        }

        const mockProcessExit = vi
            .spyOn(process, 'exit')
            .mockReturnValue(null as never)

        onExit(
            {
                logger: mockLogger,
            },
            mockExitFn
        )

        expect(mockExitFn).not.toHaveBeenCalled()
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            1,
            '[gracy] Registering exit handlers'
        )
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            2,
            '[gracy] Exit handlers registered'
        )
        expect(mockLogger.fatal).not.toHaveBeenCalled()

        process.emit('beforeExit', 0)

        expect(mockExitFn).toHaveBeenCalledTimes(1)
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            3,
            { code: 0 },
            '[gracy] Received beforeExit hook'
        )
        expect(mockLogger.debug).toHaveBeenNthCalledWith(
            4,
            { code: 0 },
            '[gracy] beforeExit hook finished'
        )

        expect(mockLogger.fatal).not.toHaveBeenCalled()

        expect(mockProcessExit).toHaveBeenCalledWith(0)
    })

    describe.todo('events', () => {
        it('should handle uncaughtException', () => {
            return
        })
        it('should handle unhandledRejection', () => {
            return
        })
    })

    describe.todo('signals', () => {
        it('should handle SIGTERM', () => {
            return
        })
        it('should handle SIGINT', () => {
            return
        })
    })
})
