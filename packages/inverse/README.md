# Inverse

Minimal type safe dependency injection library for TypeScript.

## Install

```sh
$ npm install @valkyr/inverse
```

## Introduction

Inverse is a small personal dependency injection library used mainly to allow for developing against contracts instead of concrete implementations. It is not meant to be a full blown dependency injection framework, but rather a simple way to allow for swapping out implementations without having to change the code that uses them.

It's unorthodox in that it does not use common pattern of decorator based injection, but allowing for the container to retrieve dependencies in any part of your code base using a class or string identifier _(token)_.

The following documentation will give a brief and simple overview to get your started.

## Getting Started

This getting started guide will take you through the basics of using Inverse for dependency injection:

1.  [Creating a Dependency](#creating-a-dependency)

### Creating a Dependency

A contract represents the interface in which we develop against. It does not provide any implementation, but rather defines the methods and properties that must be implemented by the concrete implementation.

In our recommended approach we use an abstract class to define the contract, this allows us to use the class as a dependency `Token` which serves as a guard and contract interface.

Let's start by creating a simple contract for a `Logger`:

```ts
export abstract class Logger {
  abstract log(message: string): void;
}
```

> This contract defines a single method `log` which takes a `string` as an argument and does not return anything.

Now that we have a contract we can create a concrete implementation of the `Logger`:

```ts
import { Logger } from "~Logger";

export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

export class StdLogger implements Logger {
  log(message: string): void {
    process.stdout.write(message);
  }
}
```

> This implementation simply logs the message to the console.

Now that we have a contract and a concrete implementation we can register the concrete implementation with the container:

```ts
import { Container, token } from "@valkyr/inverse";

import { ConsoleLogger } from "~ConsoleLogger";
import { Logger } from "~Logger";

const container = new Container([token.transient(Logger, ConsoleLogger)]);
```

> The `token.transient` method is used to register a concrete implementation with the container. The first argument is the contract `Token` and interface, the second argument is the concrete implementation.

Inverse uses the concept of optionally providing a default set of implementations when the container is created. When provided the default implementation should be a safe default for your application.

You can register or replace a dependency at any time using the `set` method:

```ts
import { container } from "~Container";
import { Logger } from "~Logger";
import { StdLogger } from "~StdLogger";

container.set(Logger, StdLogger);
```
