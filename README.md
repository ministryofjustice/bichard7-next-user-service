# Bichard7 vNext: User Service

A Next.js application powered by AWS Cognito to provide user authentication within the new Bichard7 architecture.

## Development

### Installing requirements

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to allow you to use/switch between node versions
1. Install and use the version of node specified by this project:
   ```
   $ cd /path/to/bichard7-next-services
   $ nvm install
   ```
1. Install the npm dependencies:
   ```
   $ npm i
   ```
   N.B. This will also configure git hooks with [husky](https://typicode.github.io/husky/) to automatically lint the code, and copy the GOV.UK Frontend assets into the location that Next.js serves static files from.

### Running the app

The application can be started in development mode, which includes features such as extra error reporting and hot-code reloading, by running:

```
$ npm run dev
```

Alternatively, an optimized production build of the application can be built and then served with:

```
$ npm run build
$ npm run start
```

### Testing

The application has UI tests that are run by [Cypress](https://www.cypress.io/). These can be run against a production build of the app with:

```
$ npm run test:ui
```

Alternatively, if you want to run the tests against a dev build of the app that is already running, you can use:

```
$ npm run cypress:run
```

Cypress has a UI that enables individual tests to be run and debugged in a visible browser, this can be accessed via the command:

```
$ npm run cypress:open
```

### Code formatting

This project utilises [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to code linting and auto-formatting. They are run as part of a pre-commit git hook, as well as in the CI.

To run them manually without making any auto-corrections, you can use:

```
$ npm run lint
```

And similarly, to run them and make any possible auto-corrections, use:

```
$ npm run lint:fix
```
