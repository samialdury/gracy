# Gracy

[![Latest release](https://badgen.net/github/release/samialdury/gracy)](https://github.com/samialdury/gracy/releases/latest)
[![Latest tag](https://badgen.net/github/tag/samialdury/gracy)](https://github.com/samialdury/gracy/tags)
[![npm](https://badgen.net/npm/v/gracy)](https://www.npmjs.com/package/gracy)
[![License](https://badgen.net/github/license/samialdury/gracy)](LICENSE)
[![CI status](https://github.com/samialdury/gracy/actions/workflows/ci.yaml/badge.svg)](https://github.com/samialdury/gracy/actions/workflows/ci.yaml)

Execute custom cleanup functions before Node.js exits. Zero dependencies.

## Usage

```sh
pnpm i gracy
```

```ts
import { onExit } from 'gracy'

onExit(
  { logger: pinoInstance },
  closeHttpServer,
  closeDatabaseConnection
)
```

## Configuration

The `onExit` function accepts an configuration object as its first argument. The following options are available:

| Name      | Default value                                 | Description                                                                                                                                                                                           |
| --------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger`  |                                               | Logger to use. You should use libraries for structured logging such as [pino](https://github.com/pinojs/pino), but you can also use the built-in `console` object. Set to `false` to disable logging. |
| `events`  | `['uncaughtException', 'unhandledRejection']` | Events to listen to. Triggering these events will cause the process to exit with code `1`.                                                                                                            |
| `signals` | `['SIGTERM', 'SIGINT']`                       | Signals to listen to. Triggering these signals will cause the process to exit with code `0`.                                                                                                          |

## Stack

This project has been scaffolded with [create-npm-library](https://github.com/samialdury/create-npm-library).

## License

[MIT](LICENSE)
