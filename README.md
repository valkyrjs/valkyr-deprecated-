[![Maintainability](https://api.codeclimate.com/v1/badges/d12a6788570bda777116/maintainability)](https://codeclimate.com/github/kodemon/valkyr/maintainability)&nbsp;
[![Test Coverage](https://api.codeclimate.com/v1/badges/d12a6788570bda777116/test_coverage)](https://codeclimate.com/github/kodemon/valkyr/test_coverage)

# Valkyr

Valkyr SDK. A collection of TypeScript + JavaScript tools and libraries to build full stack software applications.

## Dependencies

| Package       | Instructions                            |
| ------------- | --------------------------------------- |
| NodeJS 16 LTS | https://github.com/nvm-sh/nvm           |
| Docker\*      | https://docs.docker.com/engine/install/ |

> \*Docker is only required in development as it's used to set up necessary back end services during development that is likely run outside of this space on staging and production environments.

### Setup

Install and build dependencies across all project folders:

```sh
$ npm install
```

### Testing

We use jest for testing, just run the following command from root:

```ts
$ npm test
```

### Playground

When you want to test package functionality from a product perspective we can jump into the playground environment.

Open up two terminals and run the api and app respectively:

```sh
$ npm run stores # Any terminal
$ npm run api # Terminal 1
$ npm run app # Terminal 2
```

## Documentation

Go to our [documentation website](https://docs.kodemon.net) for valkyr documentation.

> This is however currently not ready, and this section will be updated once its ready for prime time.
