# Athlete API

A small serverless REST API for managing Swedish Athletes(dummy data), built with the Serverless Framework on AWS (Lambda + API Gateway HTTP API, Node.js 24, region `eu-north-1`). Request handling uses [Middy](https://middy.js.org/) for JSON body parsing and error handling.

Athletes live in an in-memory array ([data/index.mjs](data/index.mjs)), so there is no database. Changes are lost when a Lambda instance is recycled.

## Endpoints

| Method | Path                 | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| GET    | `/api/athletes`      | List all athletes                        |
| GET    | `/api/athletes/{id}` | Get one athlete                          |
| POST   | `/api/athletes`      | Add an athlete (`name`, `sport`, `age`)  |
| PUT    | `/api/athletes/{id}` | Replace an athlete                       |
| PATCH  | `/api/athletes/{id}` | Update one or more of `name`/`sport`/`age` |
| DELETE | `/api/athletes/{id}` | Delete an athlete                        |

Example athlete:

```json
{ "id": "ine22", "name": "Armand Duplantis", "sport": "Stavhopp", "age": 26 }
```

Invalid input returns `400`; unknown ids return `404`.

## Getting started

```bash
npm install
serverless deploy
```

Then call the endpoint printed after deployment:

```bash
curl https://<api-id>.execute-api.eu-north-1.amazonaws.com/api/athletes
```

Use `serverless dev` for local development against the deployed function.

## Project structure

```
functions/   one folder per Lambda handler
data/        in-memory athlete data
responses/   shared response helper
serverless.yml
```
