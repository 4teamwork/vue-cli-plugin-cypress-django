const { info, execa } = require('@vue/cli-shared-utils');
const kill = require('tree-kill');
const Process = require('./Process');

/**
 * Represents the frontend server
 * @constructor
 * @param {object} config - Config must contain the frontend port.
 */
class Frontend extends Process {
  /**
   * Start the frontend server using the vue-cli-service
   */
  async start(api) {
    const { FRONTEND_PORT } = this.config;

    info(`Starting frontend server on http://localhost:${FRONTEND_PORT}...`);
    this.process = await api.service.run('serve', {
      port: FRONTEND_PORT,
    });
    return this.process;
  }
}

module.exports = Frontend;
