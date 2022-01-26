[![Maintainability](https://api.codeclimate.com/v1/badges/d12a6788570bda777116/maintainability)](https://codeclimate.com/github/kodemon/valkyr/maintainability)&nbsp;
[![Test Coverage](https://api.codeclimate.com/v1/badges/d12a6788570bda777116/test_coverage)](https://codeclimate.com/github/kodemon/valkyr/test_coverage)

# Valkyr

Valkyr SDK. A collection of TypeScript + JavaScript tools and libraries to build full stack software applications.

## Dependencies

| Package       | Instructions                            |
| ------------- | --------------------------------------- |
| NodeJS 16 LTS | https://github.com/nvm-sh/nvm           |
| Docker\*      | https://docs.docker.com/engine/install/ |

> *Docker is only required in development as it's used to set up necessary back end services during development that is likely run outside of this space on staging and production environments.

### Step 1 - Setup

Install and build dependencies across all project folders:

```sh
$ npm install
$ npm run build
```

### Step 2 - Start

Open up two terminals and run the api and app respectively:

```sh
$ npm run api # Terminal 1
$ npm run app # Terminal 2
```
