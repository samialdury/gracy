# `gracy`

[![CI status](https://github.com/samialdury/gracy/actions/workflows/ci.yml/badge.svg)](https://github.com/samialdury/gracy/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/samialdury/gracy)](LICENSE)
[![npm version](https://img.shields.io/npm/v/gracy)](https://www.npmjs.com/package/gracy)

Gracy is a zero-dependency library that provides a simple way to execute custom function before a Node.js process exits. It helps you ensure that your applications perform cleanup tasks, gracefully close resources, and maintain data integrity during (un)expected shutdowns or terminations.

## Installation

```sh
pnpm i -E gracy
```

## Usage

```ts
import { onExit } from 'gracy'

onExit(
    async () => {
        closeHttpServer()
        await closeDatabaseConnection()
    },
    { logger: pinoInstance }
)
```

## Configuration

The `onExit` function accepts an configuration object as its second argument. The following options are available:

| Name      | Default value                                 | Description                                                                                                                                                                                           |
| --------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger`  |                `console`                               | Logger to use. You should use libraries for structured logging such as [pino](https://github.com/pinojs/pino). Set to `false` to disable logging. |
| `logLevel`  |         `'info'`                                     | Log level to use. Valid options are `'debug'`, `'info'`, `'error'`. |
| `logPrefix`  |         `'[gracy] '`                                     | Prefix to use for log messages. Set to empty string to disable prefixing. |
| `timeout`  |         `10_000`                                     | Timeout (in milliseconds) to wait for the function to finish. If the function does not finish in time, the process will exit with code `1`. |
| `events`  | `['uncaughtException', 'unhandledRejection']` | Events to listen to. Triggering these events will cause the process to exit with code `1`.                                                                                                            |
| `signals` | `['SIGTERM', 'SIGINT']`                       | Signals to listen to. Triggering these signals will cause the process to exit with code `0`.                                                                                                          |

## License

[MIT](LICENSE)
