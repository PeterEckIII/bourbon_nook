# Bourbon Nook

## Development
### UI

#### Icon Generation
Entrypoint: `./scripts/icons.ts`

<u>Dependencies</u>:
  * `ts-node`


<u>Steps to add an icon to your library</u>
1. Open `./resources/` and create a new `.svg.` file -- use `snake_case_syntax` when naming your `.svg` files for the best DX

2. Remove the `height` and `width` properties from the SVG to support dynamic sizing

3. Remove the `class` attribute from the SVG

4. Make sure the nested element of the SVG doesn't include any custom `fill` or `stroke` properties to support dynamic colors
  **NOTE**: The `<svg>` component itself can have `stroke` and `fill` properties, but any nested elements need to be blank

5. Run `npm run icons` to generate sprites for your icons in the `./resources` directory

6. Your icon will be generated based `./app/library/icon/icons/icon.svg`

7. The type safety comes in `./app/library/icon/icons/types.ts`

**Usage**
```
  import Icon from '~/library/icon/icon'

  <Icon name="<ICON_NAME>" />
```

The `name` property hooks into our type file to provide autocomplete

#### Storybook
Storybook is configured in this project and can be used as a UI tool. Storybook is setup via the three files in the `./.storybook/` directory:
* `./.storybook/main.ts` -- Plugins, add-ons, and aliasing
* `./.storybook/preview.ts` -- Main layout for Storybook
* `./.storybook/sbvite.config.ts` -- Vite config for Storybook

### Testing
This repository implements unit, integration, and e2e tests to ensure proper functionality across the codebase. See below for more information about running each category of tests.

**Note**: All test suites run operations on the test database, a local Postgresql DB that can be accessed via `psql` by running:
`npm run db:connect:test`. 

#### Unit
Unit testing is setup via the `./vitest.config.unit.ts` file at the root of the directory as well as the `./tests/setup.unit.ts` file.

**Testing files location**: `./app/**/*.test.ts`

**Execution Command**: `npm run unit`

*Unit injection*
The `./tests/factory.ts` and `./tests/setup.unit.ts` files inject predictable database functions that simplify the testing process. 

* `factory.ts` -- contains the functions that will be available in the test context
* `setup.unit.ts` -- injects the unit context before each test

#### Integration
Integration testing is setup via the `./vitest.config.integration.ts` and the `./tests/setup.integration.ts` files

*Testing files location*: `./tests/**/*.test.{ts|tsx}`

*Execution Command*: npm run integration

*Integration injection*
The `./tests/factory.ts` and `./tests/setup.integration.ts` files inject predictable database functions that simplify the testing process. 

* `factory.ts` -- contains the functions that will be available in the test context
* `setup.integration.ts` -- injects the integration context before each test

##### UI Testing

*Execution Command*: `npm run integration:ui`

#### End-to-End
End-to-End testing is setup in the `./tests/setup.integration.ts` file and the `./playwright/` directory, along with the `./playwright.config.ts` file

**Testing files location**: `./e2e/*.test.{ts|tsx}`

**Execution Command**: `npm run e2e`

##### UI Testing

**Execution Command**: `npm run e2e:ui`

### Database
Postgresql powers the data storage for this app and can be configured easily
1. Adjust your schema in `./prisma/schema.prisma`
2. Migrate the changes with `npm run db:migrate`
3. Spin up the Docker container with `npm run db:up`
4. To connect to the local database you can run `npm run db:connect:test`
  **NOTE**. To connect to the staging database run `npm run db:connect:dev`
5. When you're done shut down the Docker container with `npm run db:down`


## Production
### Build
```
$ npm run build
```

### Deployment
```
...coming soon
```
