const { info, execa } = require('@vue/cli-shared-utils');
const Process = require('./Process');

/**
 * Represents the cypress test runner.
 * @constructor
 * @param {object} settings - Settings must contain the cypress port.
 */
class Cypress extends Process {
  /**
   *
   * @param {object} frontend - The frontend is needed to determine the url
   */
  start({ headless, djangopath, gever }) {
    // Actaul cypress binary from node modules
    const cypressBin = require.resolve('cypress/bin/cypress');
    const { CYPRESS_PORT, FRONTEND_PORT, DJANGO_DATABASE_NAME } = this.settings;
    info(`Running E2E tests on http://localhost:${CYPRESS_PORT} ...`);
    this.process = execa(
      cypressBin,
      [
        headless ? 'run' : 'open',
        '--config',
        `baseUrl=http://localhost:${FRONTEND_PORT}`,
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
