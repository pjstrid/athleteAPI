# Athlete API

A small serverless REST API for managing Swedish Athletes(dummy data), built with the Serverless Framework on AWS (Lambda + API Gateway HTTP API, Node.js 24, region `eu-north-1`). Request handling uses [Middy](https://middy.js.org/) for JSON body parsing and error handling.

Athletes are stored in a DynamoDB table (`athlete-db`). All database calls are in [services/athletes.mjs](services/athletes.mjs).

## Endpoints

| Method | Path                 | Description                                        |
| ------ | -------------------- | -------------------------------------------------- |
| GET    | `/api/athletes`      | List athletes (optional query: `sport`, `search`)  |
| GET    | `/api/athletes/{id}` | Get one athlete                                    |
| POST   | `/api/athletes`      | Add an athlete (`name`, `sport`)                   |
| PUT    | `/api/athletes/{id}` | Update an athlete (`name`, `sport`, `autograph`)   |
| PATCH  | `/api/athletes/{id}` | Update `autograph` only                            |
| DELETE | `/api/athletes/{id}` | Delete an athlete                                  |

`sport` must match exactly and `search` matches part of the name. Neither is case-sensitive. New athletes start with `autograph` set to `false`.

Example athlete:

```json
{ "type": "athlete", "id": "ine22", "name": "Armand Duplantis", "sport": "Stavhopp", "autograph": false }
```

Invalid input returns `400`; unknown ids return `404`.

## Getting started

The project's database and AWS resources are private and are not shared with other developers. To run the API yourself, use your own AWS account and create these in `eu-north-1` first, since deploying does not create the database:

- A DynamoDB table named `athlete-db`, with partition key `type` (string) and sort key `id` (string). The table definition is commented out in [serverless.yml](serverless.yml).
- An IAM role the Lambdas can use, with access to the table.

Add your role to a `config.yml` file in the project root:

```yaml
role: arn:aws:iam::<account-id>:role/<role-name>
```

Then install and deploy:

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
services/    DynamoDB client and database functions
data/        old in-memory athlete data, no longer used by the API
responses/   shared response helper
config.yml   your IAM role ARN
serverless.yml
```
