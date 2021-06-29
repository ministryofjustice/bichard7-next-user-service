# Bichard7 vNext: User Service

A Next.js application to provide user authentication within the new Bichard7 architecture.

## Building

AWS CodeBuild automatically builds the user-service Docker image and pushes into the AWS container repository (ECR). The image is built upon the `nodejs` image from our ECR repo.

In order to build the user-service image locally, you'll need to have installed and configured the [AWS CLI](https://aws.amazon.com/cli/) and [`aws-vault`](https://github.com/99designs/aws-vault), so that you can authenticate with AWS and pull down the `nodejs` image from ECR.

You can then run the build process via `aws-vault`:

```shell
$ aws-vault exec bichard7-sandbox-shared -- make build
```

## Running

Once you've built the Docker image (see [above](#building)), you run the Docker image as usual:

```shell
$ docker run -p 3443:443 user-service

# Or, a shortcut to run the above:
$ make run
```

Either of these commands will expose the service at https://localhost:3443/.

## Configuration

The application makes use of the following environment variables to permit configuration:

| Variable                  | Default                                            | Description                                                                                     |
|---------------------------|----------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `$BICHARD_REDIRECT_URL`   | `"https://localhost:9443/bichard-ui/Authenticate"` | The URL to redirect to with a token as a GET parameter when authentication is successful        |
| `$DB_AUTH`                | `false`                                            | Whether to validate users against the database (true) or the static local list of users (false) |
| `$DB_AUTH_HOST`           | `"localhost"`                                      | The hostname of the database server                                                             |
| `$DB_AUTH_USER`           | `"bichard"`                                        | The username to use when connecting to the database                                             |
| `$DB_AUTH_PASSWORD`       | `"password"`                                       | The password to use when connecting to the database                                             |
| `$DB_AUTH_DATABASE`       | `"bichard"`                                        | The name of the database containing the user information                                        |
| `$DB_AUTH_PORT`           | `5432`                                             | The port number to connect to the database on                                                   |
| `$DB_AUTH_SSL`            | `false`                                            | Whether to use SSL when connecting to the database                                              |
| `$TOKEN_EXPIRES_IN`       | `"5 seconds"`                                      | The amount of time the tokens should be valid for after issuing                                 |
| `$TOKEN_ISSUER`           | `"Bichard"`                                        | The string to use as the token issuer (`iss`)                                                   |
| `$TOKEN_QUERY_PARAM_NAME` | `"token"`                                          | The name to use for the token query parameter when redirecting to `$BICHARD_REDIRECT_URL`       |
| `$TOKEN_SECRET`           | `"OliverTwist"`                                    | The HMAC secret to use for signing the tokens                                                   |

These can be passed through to the docker container with the `-e` flag, for example:

```shell
$ docker run \
   -p 3443:443 \
   -e TOKEN_SECRET="SECRET" \
   -e TOKEN_EXPIRES_IN="10 seconds" \
   user-service
```

### Authentication Mechanism

By default, the user-service will validate login attempts against a [static list of users](/src/data/users.ts).

In order to validate users against a local instance of the Bichard Postgres database, you need to:

1. Spin up a local instance of the database (if you don't already have one running):
   ```shell
   $ cd /path/to/bichard7-next
   $ make run-pg
   ```

1. Pass through the environment variables to turn on database-backed auth, and to specify the docker host as the database host:
   ```shell
   $ cd /path/to/bichard7-next-user-service
   $ docker run \
      -p 3443:443 \
      -e DB_AUTH=true \
      -e DB_AUTH_HOST=host.docker.internal

   # Or, a shortcut to run the above:
   $ make run-db
   ```

To customise other database connection parameters, see the `$DB_AUTH_*` parameters in [the table above](#Configuration). The other database configuration defaults should be sufficient for connceting to a local instance of the database.

### SSL Certificates

The Docker image is configured to run NGINX in front of the Next.js application, to allow us to do SSL termination.

A self-signed certificate is generated and included in the Docker image, but this can be overridden by mounting a different certificate and key at `/certs/server.{crt,key}`:

```shell
$ docker run \
   -p 3443:443 \
   -v /path/to/your/certificates:/certs \
   user-service
```

## Development

### Installing requirements

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to allow you to use/switch between node versions

1. Install and use the version of node specified by this project:
   ```shell
   $ cd /path/to/bichard7-next-user-service
   $ nvm install
   ```

1. Install the npm dependencies:
   ```shell
   $ npm i
   ```
   N.B. This will also configure git hooks with [husky](https://typicode.github.io/husky/) to automatically lint the code, and copy the GOV.UK Frontend assets into the location that Next.js serves static files from.

### Running the app locally

The application can be started in development mode, which includes features such as extra error reporting and hot-code reloading, by running:

```shell
$ npm run dev
```

Alternatively, an optimized production build of the application can be built and then served with:

```shell
$ npm run build
$ npm run start
```

### Testing

The application has unit tests written using [Jest](https://jestjs.io/), which can be run with:

```shell
$ npm run test:unit
```

The application also has UI tests that are run by [Cypress](https://www.cypress.io/). These can be run against a production build of the app with:

```shell
$ npm run test:ui
```

Alternatively, if you want to run the tests against a dev build of the app that is already running, you can use:

```shell
$ npm run cypress:run
```

Cypress has a UI that enables individual tests to be run and debugged in a visible browser, this can be accessed via the command:

```shell
$ npm run cypress:open
```

### Code formatting

This project utilises [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to code linting and auto-formatting. They are run as part of a pre-commit git hook, as well as in the CI.

To run them manually without making any auto-corrections, you can use:

```shell
$ npm run lint
```

And similarly, to run them and make any possible auto-corrections, use:

```shell
$ npm run lint:fix
```
