# cortex

[![Heroku CI Status](https://ci-badges.herokuapp.com/pipelines/58050917-a6c7-4199-b953-75b12973bbaa/master.svg)](https://dashboard.heroku.com/pipelines/58050917-a6c7-4199-b953-75b12973bbaa/tests)

The main Octave repo.

## Setup

Make sure to have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli), [NVM](https://github.com/creationix/nvm), Node 10.



```
brew install heroku/brew/heroku
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
nvm install 10 && nvm alias default 10
```

Copy over a .env file

```
heroku config --app=mindset-cortex-staging | grep -E `cat .env.example | grep REPLACE | cut -f1 -d= | xargs | tr ' ' \\|` | sed -e 's/:\\ /=/g' | sed -e 's/ //g' > .env
```

Then install dependencies and start the server

```
npm install
npm start
```

Before submitting a pull request make sure your code passes linting and tests.

```
npm test
```


## Tech. Architecture

The project will be composed of sub-express apps mostly leveraging Apollo Server (model-like code) and Next.js (view/controller-like code) with a very rare addition of Apollo Client or Redux (complex controller-like code). Any non-trivial Next or Apollo app will include a ./lib directory that can opportunistically pull common concepts out into their own top-evel directory e.g. a /middleware or /mutations or /hocs directories. Code should default to being app/component-local first and only moved out/upward when there's significant DRY-voilating going on. Apps inside the ./apps directory should designed in a way that they could be extracted as a microservice, and as such should not require directly into other apps or depend heavily on global state. Modules inside the ./lib directory should be designed in a way that they could be extracted as their own npm packages, and as such should strive to be loosely coupled and are requireable without a relative path like node_modules.

Jest for unit and integration testing, Nightmare for end-to-end tests. Prettier-standard for linting, suggested to use VSCode with format-on-save, but tests will fail on issues too. Use your judgement for refactoring code. A common pattern can be pulling out blocks of complex code from UI components or GraphQL resolvers into libs written around a logical domain (e.g. an "appointment" or "user" lib) with the IO and business logic pieces separated into functions of their pure/impure parts (kinda like a functional [Active Record](https://www.martinfowler.com/eaaCatalog/activeRecord.html) pattern). Complex flows of logic can combine a bunch of these libs into logical ["services"](https://www.martinfowler.com/eaaCatalog/serviceLayer.html) e.g. a /services/checkout.js lib.

Generally speaking, a sorta "classic MVC"-like mindset should be applied to this full-stack GraphQL/React architecture. That is our models (GraphQL layer) should be fat with business/auth/persistence logic, our views (React components) should be dumb and strive to mostly just render the data returned from models, and our controllers (Next.js router + React event handlers) should be skinny and just delegate to models and views.

When designing GraphQL schemas, we'll default to CRUD/OO-like language. So `createUser`, `updateUser` mutation language and `user`, `users` query language. Of course there will be the need for language beyond a [kingdom of nouns](https://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html), so when necessary use your judgement to use language like `${action}${Object}` e.g. `followUser` or as a last resort, invent a new ad-hoc/aggregated term like `homeFeed` or `sendMailingList`. Givin this "object oriented" structure we'll follow-that "Active Record-like" pattern here and encapsulate Apollo Server types and resolvers alongside business and persistence logic as modules under a /models folder. Because we can quickly get clients stuck using fields we expose, we'll strive for minimalistic CRUD-like coverage vs. exposing every GraphQL field out of the box. When evolving the API, aim to treat schemas as append-only, mark old fields deprecated, and only when necessary carefuly delete fields by migrating clients off and monitoring their usage. Authorization will use JWTs passed in the Authorization header to do role base auth logic which will simply throw auth errors in resolvers. Authentication will be handled by a service like Auth0.

A jobs app will hold code for managing backgrounds jobs such as polling a service for updates and scheduling emails and SMS. At first this can leverage lightweight uses of `setInterval`, [node-cron](https://github.com/kelektiv/node-cron), or Heroku Scheduler. Later we can integrate a more robust/complex Redis-backed solution like [Kue](https://github.com/Automattic/kue). With that in mind it would be good to write background job code as plain libraries that are decoupled from the job runner.

As complexity inevitably grows we may want to split out sub-apps into their own microservices. If we're careful about following the above design patterns, then it should be simple to pull out Next.js apps into their own deploys under subdomains that share the Auth0 session. Eventually we may also want to separately deploy API microservices that use schema stitching to combine multiple GraphQL APIs into one orchestration layer.

## Engineering Philosophy

Generally speaking we subscribe to the [New Jersey style](https://www.wikiwand.com/en/Worse_is_better).

We aim to pick pragmatic tools that have the highest cummulative score among being [simple, easy](https://www.youtube.com/watch?v=34_L7t7fD_U), popular, comprehensive, and enabling great UX rather than being exceptionally one of those things but not the others. For instance, we choose Express over Koa because while it is not as simple or technically astute as Koa, it is a lot more popular and _easier_ to find an ecosystem around. We choose Next.js over [create react app](https://github.com/facebook/create-react-app) because while less popular and not as simple, it's more comprehensive and enables better UX with it's easy universal rendering patterns. We choose a minimal Babel configuration over Typescript because JS is simpler, easier, and more popular than TS.

A tool must also be considered in relation to its impact on the entire system. So while a tool might score high on all those things in isolation (e.g. the [Meteor framework](https://www.meteor.com/)), if when integrated into our architecture it lowers the whole system's score by adding complexity and performance problems then we might consider an alternative that raises the overall score. For instance, we choose GraphQL over REST because while it's less simple, easy, and popular than REST it does score higher on the other two and makes the entire system simpler and easier to maintain on the front end. When adding a tool doesn't significantly impact the entire systems score we prefer not to use it at all, e.g. we stick with npm rather than use yarn.

We believe the quality of our software is determined by our ability to frequently deliver improvements while immediately discovering bugs and shipping fixes quickly with minimal regressions. To enable this we invest in keeping our tools fast to reduce time to test and deploy, our code surface area minimal by buying more than building and aiming for minimal verbosity in our code, preferring to be proactive in fixing error cases rather than being paralyzed by defensively coding every possible unhappy path, reducing bikeshedding with automating linting/formatting/etc., keeping code easy to maintain for the next person with minimal unclever abstractions and good documentation, preventing regressions and encouraging refactoring with high test coverage, creating a culture of trust where everyone deploys code and debugs issues or easily rolls back, receiving constant feedback from user reports and system monitoring, and preferring to first fix bugs and handle system reported exceptions before working on new features.
