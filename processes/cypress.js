const { info, execa } = require('@vue/cli-shared-utils');
const Process = require('./Process');

/**
 * Represents the cypress test runner.
 * @constructor
 * @param {object} config - Config must contain the cypress port.
 */
class Cypress extends Process {
  /**
   *
   */
  start() {
    // Actual cypress binary from node modules
    const cypressBin = require.resolve('cypress/bin/cypress');
    const {
      CYPRESS_PORT,
      FRONTEND_PORT,
      DJANGO_DATABASE_NAME,
      CYPRESS_CONFIG,
      headless,
      djangopath,
      gever,
    } = this.config;
    info(`Running E2E tests on http://localhost:${CYPRESS_PORT} ...`);

    const cypressConfig = [
      `baseUrl=http://localhost:${FRONTEND_PORT}`,
      CYPRESS_CONFIG,
    ].filter(Boolean).join(',');

    this.process = execa(
      cypressBin,
      [
        headless ? 'run' : 'open',
        '--config',
        cypressConfig,
        `--port=${CYPRESS_PORT}`,
        '--env',
        `GEVER=${gever}`,
      ],
      { stdio: 'inherit', env: { DJANGO_DATABASE_NAME, DJANGO_PATH: djangopath } },
    );
    return this.process;
  }
}

module.exports = Cypress;
