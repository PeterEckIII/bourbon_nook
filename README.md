# Bourbon Nook
![Bourbon Nook](https://res.cloudinary.com/jpeckiii/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713391963/bourbon_lhjvg2.jpg)

## Tech Stack
- [Remix ❤️ Vite](https://remix.run/docs/en/main/future/vite)
- ORM and Postgresql setup with [Prisma](https://www.prisma.io/)
- Dev & Prod databases via [Supabase](https://supabase.com/)
- Styling with [Tailwindcss](https://tailwindcss.com/)
- UI development iteration with [Storybook](https://storybook.js.org/)
- Custom SVG sprite icon generation with type checking
- Plug-and-play components courtesy of [shadcn-ui](https://ui.shadcn.com/)
- Test database powered by [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Unit testing with [Testing Library](https://testing-library.com/) and [Vitest](https://vitest.dev/)
- E2E testing thanks to [Playwright](https://playwright.dev/)
- Local third-party mocking requests with [MSW](https://mswjs.io/)
- Industry-standard code formatting with [Prettier](https://prettier.io/)
- Linting via [ESLint](https://eslint.org/)
- Static type checking via [Typescript](https://www.typescriptlang.org/)


## UI

### Icon Generation
Entrypoint: `./scripts/icons.ts`

<u>Dependencies</u>:
  * `ts-node`


<u>Steps to add an icon to your library</u>
1. Open `./resources/` and create a new `.svg.` file -- use `snake_case_syntax` when naming your `.svg` files for the best DX

2. Remove the `height` and `width` properties from the SVG to support dynamic sizing

3. Remove the `class` attribute from the SVG

4. Make sure the nested element of the SVG doesn't include any custom `fill` or `stroke` properties to support dynamic colors
  <U>**NOTE**</U>: The `<svg>` component itself can have `stroke` and `fill` properties, but any nested elements need to be blank

5. Run `npm run icons` to generate sprites for your icons in the `./resources` directory

6. Your icon will be generated based `./app/library/icon/icons/icon.svg`

7. The type safety comes in `./app/library/icon/icons/types.ts`

**Usage**
```
  import Icon from '~/library/icon/icon'

  <Icon name="<ICON_NAME>" />
```

The `name` property hooks into our type file to provide autocomplete

### Storybook
Storybook is configured in this project and can be used as a UI tool. Storybook is setup via the three files in the `./.storybook/` directory:
* `./.storybook/main.ts` -- Plugins, add-ons, and aliasing
* `./.storybook/preview.ts` -- Main layout for Storybook
* `./.storybook/sbvite.config.ts` -- Vite config for Storybook

**Testing files locations**: 
- `"../stories/**/*.mdx"`,
- `"../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"`,
-`"../app/library/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"`

**Plugins**
- "@storybook/addon-onboarding"
- "@storybook/addon-links"
- "@storybook/addon-essentials"
- "@chromatic-com/storybook"
- "@storybook/addon-interactions"
- "@storybook/addon-actions"


### `shadcn`
The project is also configured for `shadcn-ui` use. Simply use the appropriate `npx shadcn-ui@latest add <component_name>`

**Example**
```
$ npx shadcn-ui@latest add button
```

This installs the shadcn-ui component to the `./app/library/components/ui/` directory and can be imported and used as follows

```
import {Button} from '~/library/components/ui/button'

{...}

return (
  <Button>Click Me</Button>
)
```

## Testing
This repository implements unit, integration, and e2e tests to ensure proper functionality across the codebase. See below for more information about running each category of tests.

<U>**Note**</U>: All test suites run operations on the test database, a local Postgresql DB that can be accessed via `psql` by running:
`npm run db:connect:test`. 

### Unit
Unit testing is setup via the `./vitest.config.unit.ts` file at the root of the directory as well as the `./tests/setup.unit.ts` file.

**Testing files location**: `./app/**/*.test.ts`

**Execution Command**: `npm run unit`

**Unit injection**

The `./tests/factory.ts` and `./tests/setup.unit.ts` files inject predictable database functions that simplify the testing process. 

* `factory.ts` -- contains the functions that will be available in the test context
* `setup.unit.ts` -- injects the unit context before each test

### Integration
Integration testing is setup via the `./vitest.config.integration.ts` and the `./tests/setup.integration.ts` files

**Testing files location**: `./tests/**/*.test.{ts|tsx}`

**Execution Command**: npm run integration

**Integration injection**

The `./tests/factory.ts` and `./tests/setup.integration.ts` files inject predictable database functions that simplify the testing process. 

* `factory.ts` -- contains the functions that will be available in the test context
* `setup.integration.ts` -- injects the integration context before each test

#### Integration Testing with UI

**Execution Command**: `npm run integration:ui`

### End-to-End
End-to-End testing is setup in the `./tests/setup.integration.ts` file and the `./playwright/` directory, along with the `./playwright.config.ts` file

**Testing files location**: `./e2e/*.test.{ts|tsx}`

**Execution Command**: `npm run e2e`

#### E2E Testing with UI

**Execution Command**: `npm run e2e:ui`

## Database

### Setup
The database used in the test suites (unit, integration, and e2e) is launched by the `./docker-compose.yml` file.

### Configuration
1. Adjust your schema in `./prisma/schema.prisma`
2. Migrate the changes with `npm run db:migrate`
3. Spin up the Docker container with `npm run db:up`
4. To connect to the local database you can run `npm run db:connect:test`
  <u>**NOTE**</u>. To connect to the dev/staging database run `npm run db:connect:dev`
5. When you're done shut down the Docker container with `npm run db:down`


### The `.env.test` file
The `DATABASE_URL` environment variable should match the values passed in the `./docker-compose.yml` file to successfully connect to the local test database. Ensure your `DATABASE_URL` is set before running any testing suites.

<u>**NOTE**</u>: If your database isn't running properly, you might need to run `npm run db:up` first, to ensure the database exists

### Commands
A list of commands and their explanation is below:
- `npm run db:connect:test` -- boots up the local test database with `psql`
- `npm db:connect:dev` -- connects to the remote Supabase database used for development/staging
- `npm db:gen` -- generate types based on the schema
- `npm db:migrate` -- apply changes in dev
- `npm db:seed` -- seeds the database with some values
- `npm db:studio` -- launches a Prisma studio instance with the passed database
- `npm run db:up` -- launch the Docker container that `./docker-compose.yml` sets up
- `npm run db:down` -- shuts down and deletes the database that `db:up` created



## Build
First build a production version of the app
```
$ npm run build
```


## Deployment
```
...coming soon
```
