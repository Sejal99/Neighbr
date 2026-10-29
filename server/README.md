# Neighbr server

The server is an independent Yarn project. Run commands from this directory:

```sh
corepack yarn install
corepack yarn dev
```

Copy `.env.example` to `.env` and set the database URL and JWT secret before starting the server.

Other commands: `corepack yarn build`, `corepack yarn start`, `corepack yarn db:check`, and `corepack yarn db:migrate`.
