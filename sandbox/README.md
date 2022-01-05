[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)

# React Starter

A simple cmdo full stack starter project using react.

## DISCLAIMER

This starter is currently a early work in progress sample, only use this for fun and games as it is not yet production ready.

## QUICK START

Run dependency install in `root`, `api` and `app`:

```sh
$ npm i
```

```sh
$ cd ./api && npm i
```

```sh
$ cd ./app && npm i
```

Build the shared folder:

```sh
$ cd ./shared && npm run build
```

Start API docker container:

```sh
$ cd api
$ docker-compose up -d
```

Now that all the dependencies are installed, shared folder is built and docker is running we can start the api and app. Open two terminals and run the api and app in the following way:

```sh
$ cd api
$ npm start
```

```sh
$ cd app
$ npm start
```
