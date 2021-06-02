# Bichard7 vNext: User Service

A Next.js application powered by AWS Cognito to provide user authentication within the new Bichard7 architecture.

## Building

The user-service portal is hosted on AWS via ECS using a custom Docker image. To build the image locally, you need to:

1. Make sure you have installed and configured the [AWS CLI](https://aws.amazon.com/cli/). You can optionally also install and configure [`aws-vault`](https://github.com/99designs/aws-vault).

1. Run the `build-docker.sh` script:
   ```shell
   # Without aws-vault
   $ ./scripts/build-docker.sh

   # With aws-vault
   $ aws-vault exec <account_name> -- ./scripts/build-docker.sh
   ```

This will use the AWS CLI to login to the AWS container repository (ECR), fetch the latest version of the `nodejs` image from the repository, and then build the user-service Docker image on top of that.

You can now run the Docker image as usual:

```shell
$ docker run \
    -p 3000:3000 \
    -e BICHARD_REDIRECT_URL="http://localhost:9443/foobar/" \
    user-service
```

## Configuration

The application makes use of the following environment variables to permit configuration:

| Variable                       | Default                               | Description                                                                               |
|--------------------------------|---------------------------------------|-------------------------------------------------------------------------------------------|
| `$BICHARD_REDIRECT_URL`        | `https://localhost:9443/Authenticate` | The URL to redirect to with a token as a GET parameter when authentication is successful  |
| `$LOCAL_AUTH_TOKEN_SECRET`     | `OliverTwist`                         | The HMAC secret to use for signing the tokens                                             |
| `$LOCAL_AUTH_TOKEN_EXPIRES_IN` | `5 seconds`                           | The amount of time the tokens should be valid for after issuing                           |

## Development

### Installing requirements

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to allow you to use/switch between node versions

1. Install and use the version of node specified by this project:
   ```shell
   $ cd /path/to/bichard7-next-services
   $ nvm install
   ```

1. Install the npm dependencies:
   ```shell
   $ npm i
   ```
   N.B. This will also configure git hooks with [husky](https://typicode.github.io/husky/) to automatically lint the code, and copy the GOV.UK Frontend assets into the location that Next.js serves static files from.

### Running the app

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
