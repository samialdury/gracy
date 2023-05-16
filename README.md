# Gracy

[![NPM version](https://img.shields.io/npm/v/gracy)](https://www.npmjs.com/package/gracy)
[![CI status](https://github.com/samialdury/gracy/actions/workflows/ci.yaml/badge.svg)](https://github.com/samialdury/gracy/actions/workflows/ci.yaml)

Gracy is a zero-dependency library that provides a simple way to execute custom function before a Node.js process exits. It helps you ensure that your applications perform cleanup tasks, gracefully close resources, and maintain data integrity during (un)expected shutdowns or terminations.

## Usage

```sh
pnpm i gracy
```

```ts
import { onExit } from 'gracy'

onExit(
    { logger: pinoInstance },
    // Supports sync/async functions
    async () => {
        closeHttpServer()
        await closeDatabaseConnection()
    }
)
```

## Configuration

The `onExit` function accepts an configuration object as its first argument. The following options are available:

| Name      | Default value                                 | Description                                                                                                                                                                                           |
| --------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger`  |                                               | Logger to use. You should use libraries for structured logging such as [pino](https://github.com/pinojs/pino), but you can also use the built-in `console` object. Set to `false` to disable logging. |
| `events`  | `['uncaughtException', 'unhandledRejection']` | Events to listen to. Triggering these events will cause the process to exit with code `1`.                                                                                                            |
| `signals` | `['SIGTERM', 'SIGINT']`                       | Signals to listen to. Triggering these signals will cause the process to exit with code `0`.                                                                                                          |

## License

[MIT](LICENSE)
