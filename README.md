# vue-cli-plugin-cypress-django

Integration testing with cypress and django.

## Setup

```bash
yarn add --dev @4tw/vue-cli-plugin-cypress-django
```

## Prerequisite

The plugin requires the cypress binary. https://www.npmjs.com/package/cypress

## Usage

### manage.py

The plugin is able to interact with the django server and database. Therefore it is important to provide the djangopath when executing the tests. The djangopath should be the root directory of your project. The plugin assumes to have a `manage.py` to interact with the django server.

### database

The following database scripts need to be provided in the project root
so the plugin can properly interact with the database:

- `bin/e2e_setup_db` (create and fill database before tests are executed)
- `bin/e2e_reload_db` (reset database for isolation)
- `bin/e2e_teardown_db` (cleanup database)

What the script are doing is up to you but the goal they should achieve is
described on the list above.

The databasename is provided during the execution as the first parameter `$1`.

The database can be imported and created to interact with it.

```javascript
const Database = require('@4tw/vue-cli-plugin-cypress-django/database');

const database = new Database({ djangopath, DJANGO_DATABASE_NAME });
```

**database.reset()**

Resets the database.

**database.drop()**

Drops the database.

**database.load(dataset)**

Loads data during the tests. `dataset` is the name of the django-fixture.

Those interactions are usually done in cypress tasks: https://docs.cypress.io/api/commands/task.html#Syntax
so they can be called in setup and teardown hooks. Please note that this example does more than just db setup, but also calls hooks on the backend to reset the state (e.g. for media files):

```javascript

module.exports = (on, config) => {
  on('task', {
    djangoTestSetup(test) {
      return Promise.all([
        database.reset(),
        apiPostRequest('/api/e2e/testsetup', { test }),
      ]);
    },

    djangoTestTeardown(test) {
      return apiPostRequest('/api/e2e/testteardown', { test });
    },

    loadData(dataSet) {
      return database.load(dataSet);
    },
  });
  return config;
};

```

These tasks can be called automatically, wrapping each task in your `support/index.js` file:

```
function buildTestName(context) {
  const { currentTest } = context;
  const { parent } = currentTest;
  return `${parent.title}/${currentTest.title}`;
}

before(() => { window.chai.config.truncateThreshold = 0; });

beforeEach(function beforeEach() {
  return cy.task('djangoTestSetup', { test: buildTestName(this) });
});

afterEach(function afterEach() {
  return cy.task('djangoTestTeardown', buildTestName(this));
});
```


### django management commands

The management command `load_e2e_data` is required if specific data should be loaded on a 'per test' basis. The command should accept an optional parameter: `--datasets`.

### Interactive mode

The interactive mode enables you to run the e2e tests in the cypress electron app. This is best for development because you have hot reload when the production or test code is updated. You are also able to interact with the application after the tests are done.

```bash
vue-cli-service test:django:e2e --djangopath=/path/to/django/root
```

### Headless mode

The headless mode runs the tests in the background. This is best for running the tests in a pipeline on an integration server.

```bash
vue-cli-service test:django:e2e --djangopath=/path/to/django/root --headless
```

### Using a `.env` file

You may specify a mode, which loads a corresponding `.env.[mode]` file that allows you to specify environment variables.

```bash
vue-cli-service test:django:e2e --djangopath=/path/to/django/root --mode testing_e2e
```

Above example will look for a file called `.env.testing_e2e` and pick up the environment variables specified in this file.

### Environment variables

Following (optional) environment variables can be made use of:

- **```DJANGO_E2E_DATABASE_NAME```**: The name of the database used by django. Defaults to ```E2E_TESTING_34000```
- **```DJANGO_PYTHON_PATH```**: The path to the python binary used by django. Defaults to ```'bin/python', '.tox/py36/bin/python', 'python'```
- **```DJANGO_CONFIGURATION```**: The name of the django settings class. Defaults to ```'TestingE2E'```
- **```BACKEND_PORT```**: The port used by django. Defaults to ```34000```
- **```FRONTEND_PORT```**: The port used by vue. Defaults to ```35000```
- **```CYPRESS_PORT```**: The port used by cypress. Defaults to ```36000```
- **```HEARTBEAT_PATH```**: The frontend server will only start once the backend server is ready. A relative URL is requested repeatedly to check if the backend server is ready yet, using a HTTP HEAD method and waiting for a 200 or 302 status code. Defaults to ```/```
- **```CYPRESS_CONFIG```**: Override Cypress options, passed as a string as `--config` when running Cypress (https://docs.cypress.io/guides/references/configuration.html#Overriding-Options). Defaults to ```''``` (```baseUrl=http://localhost:[PORT2]``` is always passed)


### Django configuration

## Settings

Following settings are required for proper integration of the database and logging.

```
    ALLOWED_HOSTS = ["*"]

    @property
    def DATABASES(self):
        config = super().DATABASES
        config["default"]["NAME"] = os.environ["DJANGO_DATABASE_NAME"]
        return config

    @property
    def LOGGING(self):
        return {
            'version': 1,
            'disable_existing_loggers': False,
            'handlers': {
                'console': {
                    'level': 'INFO',
                    'class': 'logging.StreamHandler',
                    'stream': sys.stdout,
                },
                'file': {
                    'level': 'INFO',
                    'class': 'logging.FileHandler',
                    'filename': os.path.join(self.BASE_DIR, 'log/e2e.log'),
        },
            },
            'loggers': {
                '': {
                    'level': 'INFO',
                    'handlers': ['console', 'file'],
                },
            },
        }
```

# URLs

Only URLs starting with `api`, `accounts` and `media` are proxied to the django backend.
An easy fix for this is to wrap your urlpatterns around a prefix (e.g. `urlpatterns = [url("api/", include(urlpatterns))]`)

# Login

For simple integration of a login, refer to the RIS project (`TestingLoginView`).
