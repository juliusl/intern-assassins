# Intern Assassins
[![Build Status](https://travis-ci.org/JoshuaKGoldberg/intern-assassins.svg?branch=master)](https://travis-ci.org/JoshuaKGoldberg/intern-assassins)

Microsoft 2016 ISC Intern Assassins. Go wild or go home.

## Project Structure

### Front-end

Under `src/site` is a React-based TypeScript application.
It's served by an `expressjs` server.

### Back-end

Under `src/server` is an `expressjs` server.


## Building

Required software:
* [Node.js](http://node.js.org) >= 6.X
* [MongoDB](https://www.mongodb.com/)
    * *[Windows installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)*

To build from scratch, run the following commands:

```
npm install -g gulp
npm install
gulp
```


## Running

In one shell, start MongoDB locally:
```shell
mongod
```

In another shell, start the server:
```shell
node src\main
```

The command `mongod` should is required in that format for tests.
* On Windows, add the path to `mongod.exe` to your PATH. For example, `C:\Program Files\MongoDB\Server\3.2\bin`.

Settings for the server are read from `assassins.json` at startup.
This file contains the server `port`.

Before running the app, copy `assassins.default.json` to `assassins.json`.
You'll also need to build first.


### Individual Gulp tasks

* `gulp browserify` - Compresses and converts compiled .js files under `src/site` from the `tsc` task into a browser-compatible bundle.
* `gulp less` - Runes the [Less](http://lesscss.org/) compiler.
* `gulp test` - Runs tests in `tests/`. 
* `gulp tsc` - Runs the [TypeScript](https://typescriptlang.org/) compiler.
* `gulp tslint` - Runs [TSLint](https://github.com/palantir/tslint).
* `gulp watch` - Runs the appropriate `less` or `tsc`+`tslint` tasks when a source file changes.

#### Integration tests

Integration tests are done with cucumber-js, but seem to be hanging weirdly.
Run one at a time:

```shell
cls && gulp && gulp test:integration{test}
```

Tests:
* `leaders`
* `login`
* `users`
