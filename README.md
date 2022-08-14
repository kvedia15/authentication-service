# Sleep Tracker Nest js/Prisma Application

A backend project that allows users to register, authenticate and make authenticated requests. This service allows users to enter their sleep time and wake time. It also allows the users to see how many hours they slept on average and other useful metrics.

## Requirements

The project requires [Node.js](https://nodejs.org/) and [Docker Desktop](https://www.docker.com/) installed.

## Install project dependencies

```bash
$ npm install
```

## Running the postgres docker instance
```bash
docker-compose up
```

## Run the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Then go to [http://localhost:3000/api to read api documentation](http://localhost:3000/api)


