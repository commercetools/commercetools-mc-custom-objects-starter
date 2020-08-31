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
