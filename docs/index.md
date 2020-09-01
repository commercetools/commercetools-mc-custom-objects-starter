---
layout: default
title: Custom Objects
nav_order: 1
---

<!--prettier-ignore-start-->
# Custom Objects
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }
<!--prettier-ignore-end-->

<!--prettier-ignore-->
1. TOC 
{:toc}

## Application Overview

commercetools offers unparalleled data configuration; however, there are
situations where a company needs to store information that does not fit neatly
into an existing endpoint. In these situations, commercetools offers a generic
endpoint called
[Custom Objects](https://docs.commercetools.com/http-api-projects-custom-objects).
Custom Objects are a great way to store JSON data partitioned into separate
namespaces. Some example use-cases include store data, company profiles, shared
product data, and feature flags.

When managed through the commercetools API, Custom Object values are not
validated with their value consisting of a JSON string. This Custom Application
enables the creation of Custom Object schemas, which are then used to create and
manage Custom Objects that are validated against a defined schema.

## Technology

- [ReactJS](https://reactjs.org/)
- [Apollo](https://www.apollographql.com/docs/react/) &
  [GraphQL](https://graphql.org/learn/)
- [Merchant Center Application Kit](https://docs.commercetools.com/custom-applications/)
- [UI Kit](https://uikit.commercetools.com/?path=/story/introduction--getting-started) -
  Merchant Center component library
- [Yarn](https://classic.yarnpkg.com/en/docs/getting-started) - Package manager
- [Jest](https://jestjs.io/docs/en/getting-started) - Test runner
- [Enzyme](https://enzymejs.github.io/enzyme/) - React testing utility
- [Prettier](https://prettier.io/docs/en/index.html) - Code formatter
- [ESLint](https://eslint.org/docs/user-guide/getting-started) - JS, CSS, and
  GraphQL linter

## Installation

Simply run `yarn` or `yarn install` from the repository root to install the
application's dependencies.

The application has a dependency on the private package
`@commercetools-us-ps/mc-app-core`, which requires an
[npm auth token](https://docs.npmjs.com/about-authentication-tokens). To acquire
an auth token, request access to the `@commercetools-us-ps` scope from the US
Professional Services team.
[Create](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) the
auth token then run the following commands to configure npm. This will allow the
installation of the private package.

```shell
export NPM_TOKEN=xxxx-xxxx-xxxx-xxxx
```

## Development

### Start the development server

Run the following command to start the development server and launch the
application:

```shell
yarn start
```

If this is the first time running the application locally, create an `env.json`
file at the root directory using `env.local.json` as an example. Based on your
[region](https://docs.commercetools.com/http-api.html#regions), you may find it
necessary to modify the values of `frontendHost`, `mcApiUrl`, and `location`.

### Linting & Formatting

#### Formatting code

Run the following command to format JS, CSS, JSON and GraphQL files

```shell
yarn format
```

#### Linting code

Run the following command to lint JS, CSS, and GraphQL files

```shell
yarn lint
```

<!--prettier-ignore-start-->
##### Linting GraphQL Queries
{: .no_toc }
<!--prettier-ignore-end-->

A prerequisite for linting GraphQL queries is generating a `schema.graphql`
file, which contains the Types exposed by CTP API. Every time the API introduces
new Types, Queries or Mutations, the local `schema.graphql` must be updated.

<!--prettier-ignore-start-->
##### Generating CTP GraphQL schema
{: .no_toc }
<!--prettier-ignore-end-->

1. If you haven't done so already, create an API client under
   `Settings -> Developer Settings` in Merchant Center for your project
2. Generate an access token using the
   [Client Credentials flow](https://docs.commercetools.com/http-api-authorization#client-credentials-flow)
3. Export both your Merchant Center project key and generated access token as
   environment variables
4. Retrieve schema with `graphql-cli`

```shell
export PROJECT_KEY={project_key}
export AUTH_TOKEN={access_token}
npx graphql-cli get-schema
```

### Git Hooks

Git hooks are configured using
[Husky](https://github.com/typicode/husky/blob/master/DOCS.md).

- **Pre-commit**: JS, CSS, and GraphQL files are linted (ESLint/Stylelint) and
  formatted (Prettier). Fixes are automatically added to Git.
- **Commit Message**: Commit messages are linted against the
  [conventional commit format](https://www.conventionalcommits.org) using
  commitlint

## Tests

Run the following command to run the tests:

```shell
yarn test
```

To run the tests in watch mode:

```shell
yarn test:watch
```

To run the tests with coverage:

```shell
yarn test:coverage
```

## Build & Deployment

Run the following command to build the
[production bundles](https://docs.commercetools.com/custom-applications/deployment/production-build)
with webpack:

```bash
yarn build
```

The application includes configuration for both AWS (S3 & CloudFront) and
Firebase serverless deployments built with `mc-script compile-html`.

- [Firebase](https://appkit.commercetools.com/deployment/example-firebase):
  `yarn compile-html:firebase`
- [AWS - S3 & CloudFront](https://appkit.commercetools.com/deployment/example-aws-s3-cloudfront):
  `yarn compile-html:aws`

For either deployment option, the corresponding `production-{cloud}.env.json`
and `production-{cloud}.headers.json` files must be modified with values that
match your deployment environment.

### Registration with Merchant Center

After deploying the custom application, it needs to be
[registered](https://docs.commercetools.com/custom-applications/register-applications/configuring-a-custom-application)
with a Merchant Center project.

<!--prettier-ignore-start-->
#### Configuration Values
{: .no_toc }
<!--prettier-ignore-end-->

- **Main Route Path**: `custom-objects`
- **Link Permissions**: Manage Products, Manage Orders, Manage Customers
- **Sub Navigation** _(Optional)_
  - Custom Object List
    - **Link To**: `/`
    - **Link Permissions**: Manage Products, Manage Orders, Manage Customers
  - Container Schema List
    - **Link To**: `containers`
    - **Link Permissions**: Manage Products, Manage Orders, Manage Customers

![Merchant Center Registration - Main Nav](assets/custom-application-registration-main.png)
![Merchant Center Registration - Sub Nav](assets/custom-application-registration-sub.png)

## Support

Contact the US Professional Services team for all support requests related to
the ensemble discounts solution.
