const settings = require('./settings');
const Backend = require('./processes/backend');
const Frontend = require('./processes/frontend');
const Database = require('./database');
const Cypress = require('./processes/cypress');

async function start(api, options = {}) {
  const { BACKEND_PORT, DJANGO_DATABASE_NAME } = await settings;

  options.devServer.proxy = {
    '/api': {
      target: `http://localhost:${BACKEND_PORT}`,
    },
    '/accounts/*': {
      target: `http://localhost:${BACKEND_PORT}`,
    },
  }

  // Setup backend, frontend and database
  const database = new Database(options.djangopath, DJANGO_DATABASE_NAME)
  await database.create();

  const backend = new Backend(await settings, options);
  await backend.start();

  const frontend = new Frontend(await settings, options);
  await frontend.start(api);

  // Setup cypress e2e test runner
  const cypress = new Cypress(await settings, options);
  const headless = options.headless || false;
  const runner = cypress.start(Object.assign({ headless }, options));

  async function teardown(code) {
    await backend.kill();
    await database.drop();
    process.exit(code);
  }

  // Make sure to clean up running process when tests are done or failing
  runner.on('exit', teardown);
  runner.on('error', teardown);

  // Handle SIGINT signal
  process.on('SIGINT', teardown);
}

module.exports = start;
