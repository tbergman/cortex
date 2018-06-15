# cortex
The beginning of something great!!

## Setup

Make sure to have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli), [NVM](https://github.com/creationix/nvm), Node 10.

```
brew install heroku/brew/heroku
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
nvm install 10 && nvm alias default 10
```

Copy over a .env file

```
heroku config --app=positron-staging | grep -E `cat .env.example | grep REPLACE | cut -f1 -d= | xargs | tr ' ' \\|` | sed -e 's/:\\ /=/g' | sed -e 's/ //g' > .env
```

Then install dependencies and start the server

```
npm install
npm start
```


## Architecture

The project will be composed of sub-express apps mostly leveraging Apollo Server (model-like code) and Next.js (view/controller-like code) with a very rare addition of Apollo Client or Redux (complex controller-like code). Any non-trivial Next or Apollo app will include a ./lib directory that can opportunistically pull common concepts out into their own top-evel directory e.g. a ./middleware or ./mutations or ./hocs directories. Code should default to being app/component-local first and only moved out/upward when there's significant DRY-voilating going on.

Jest for unit and integration testing, Nightmare for end-to-end tests. Prettier-standard for linting, suggested to use VSCode with format-on-save, but tests will fail on issues too. Use your judgement for refactoring code. A common pattern can be pulling out blocks of complex code from UI components or GraphQL resolvers into libs written around a logical domain (e.g. an "appointment" or "user" lib) with the IO and business logic pieces separated into functions of their pure/impure parts (kinda like a functional [Active Record](https://www.martinfowler.com/eaaCatalog/activeRecord.html) pattern). Complex flows of logic can combine a bunch of these libs into logical ["services"](https://www.martinfowler.com/eaaCatalog/serviceLayer.html) e.g. a ./services/checkout.js lib.

Generally speaking, a sorta "classic MVC"-like mindset should be applied to this full-stack GraphQL/React architecture. That is our models (GraphQL layer) should be fat with business/auth/persistence logic, our views (React components) should be dumb and strive to mostly just render the data returned from models, and our controllers (Next.js router + React event handlers) should be skinny and just delegate to models and views.

When designing GraphQL schemas, we'll default to CRUD/OO-like language. So `createUser`, `updateUser` mutation language and `user`, `users` query language. Of course there will be the need for language beyond a [kingdom of nouns](https://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html), so when necessary use your judgement to use language like `${action}${Domain}` e.g. `followUser` or as a last resort, invent a new ad-hoc/aggregated term like `homeFeed` or `sendMailingList`. Because we can quickly get clients stuck using fields we expose, we'll strive for minimalistic CRUD-like coverage vs. exposing every GraphQL field out of the box. When evolving the API aim to treat schemas as append-only, mark old fields deprecated, and only when necessary carefuly delete fields by migrating clients off and monitoring their usage. Authorization will use JWTs passed in the Authorization header to do role base auth logic which will simply throw auth errors in resolvers. Authentication will be handled by a service like Auth0.

As complexity inevitably grows we may want to split out sub-apps into their own microservices. If we're careful about following the above design patterns, then it should be simple to pull out Next.js apps into their own deploys under subdomains that automatically share the Auth0 session. Eventually we may also want to separately deploy API microservices that use schema stitching to combine multiple GraphQL APIs into one orchestration layer.
