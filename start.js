const settings = require('./settings');
const Backend = require('./processes/backend');
const Frontend = require('./processes/frontend');
const Database = require('./database');
const Cypress = require('./processes/cypress');
const { info } = require('@vue/cli-shared-utils');

async function start(api, options = {}) {
  const config = Object.assign(options, await settings, process.env);

  const { BACKEND_PORT } = config;
  options.devServer.proxy = {
    '/api': {
      target: `http://localhost:${BACKEND_PORT}`,
    },
    '/accounts/*': {
      target: `http://localhost:${BACKEND_PORT}`,
    },
    '/media/*': {
      target: `http://localhost:${BACKEND_PORT}`,
    },
  };

  process.env.NODE_ENV = 'production';

  // Setup backend, frontend and database
  const database = new Database(config);
  await database.create();

  const runserver = config['runserver']
  let backend
  if (runserver === true) {
    backend = new Backend(config);
    await backend.start();
  } else {
    info('Not starting backend server (assuming it is already running)...')
  }

  const frontend = new Frontend(config);
  await frontend.start(api);

  // Setup cypress e2e test runner
  const cypress = new Cypress(config);
  const runner = cypress.start();

  async function teardown(code) {
    if (runserver === true) {
      await backend.kill();
    }
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
