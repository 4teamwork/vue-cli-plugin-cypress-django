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

The plugin is able to interact with the django server and database. Therefore it is imporant to provide the djangopath when executing the tests. The djangopath should be the root directory of your project. The plugin assumes to have a `manage.py` to interact with the django server.

### database scripts

The following database script need to be provided so the plugin can properly interact with the database:

- `bin/e2e_setup_db` (create and fill database before tests are executed)
- `bin/e2e_reload_db` (reset database for isolation)
- `bin/e2e_teardown_db` (cleanup database)

What the script are doing is up to you but the goal they should achieve is described on the list above.

The databasename is provided during the execution as the first parameter `$1`.

### Interactive mode

The interactive mode enables you to run the e2e tests in the cypress electron app. This is best for development because you have hot reload when the production or test code is updated. You are also able to interact with the application after the tests are done.

```bash
vue-cli-service test:django:e2e --djangopath=/path/to/django/root
```

### Headless mode

The headless mode runs the tests in the background. This is best for running the tests in a pipeline on an integration server.

```bash
vue-cli-service test:django:e2e:headless --djangopath=/path/to/django/root
```

### Environment variables

Following (optional) environment variables can be made use of:

- **```DJANGO_E2E_DATABASE_NAME```**: The name of the database used by django. Defaults to ```E2E_TESTING_34000```
- **```DJANGO_PYTHON_PATH```**: The path to the python binary used by django. Defaults to ```'bin/python', '.tox/py36/bin/python', 'python'```
- **```PORT1```**: The port used by django. Defaults to ```34000```
- **```PORT2```**: The port used by vue. Defaults to ```35000```
- **```PORT3```**: The port used by cypress. Defaults to ```36000```
