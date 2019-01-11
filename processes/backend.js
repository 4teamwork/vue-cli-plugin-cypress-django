const { info } = require('@vue/cli-shared-utils');
const kill = require('tree-kill');
const managePy = require('../managepy');
const Process = require('./Process');
const http = require('http');

/**
 * Represents the python backend.
 * @constructor
 * @param {object} settings - Settings must contain the django database name and the backend port.
 */
class Backend extends Process {
  /**
   * Starts a django backend server using `manage.py` on the preconfigured port
   */
  start() {
    const { BACKEND_PORT } = this.settings;
    info(`Starting backend server on http://localhost:${BACKEND_PORT}...`);
    this.process = managePy(
      this.options.djangopath,
      ['runserver', BACKEND_PORT],
      { env: this.settings, stdout: 'inherit' },
    );
    return this.heartbeat();
  }

  /**
   * Checks if the backend server is ready to handle requests
   */
  heartbeat() {
    const { BACKEND_PORT } = this.settings;
    const options = {
      method: 'HEAD',
      host: 'localhost',
      port: BACKEND_PORT,
      path: '/',
      timeout: 2 * 60 * 1000,
    };

    return new Promise((res, rej) => {

      /**
       * Requests the server for {retries} times.
       * Fails if it runs out of retries.
       * @param {number} retries maximum amount of retries
       */
      function ping(retries = 100) {
        const req = http.request(options);
        req.end();
        req.on('timeout', () => {
          req.abort();
          rej();
        });
        req.on('response', ({ statusCode }) => {
          if (statusCode === 302) {
            res();
          } else {
            rej();
          }
        });
        req.on('error', () => {
          if (retries > 0) {
            setTimeout(() => {
              ping(retries - 1);
            }, 200);
          } else {
            rej();
          }
        });
      }
      ping();
    });
  }

  kill() {
    return new Promise((res, rej) => {
      kill(this.process.pid, 'SIGTERM', (err) => {
        if (err) {
          rej(err);
        }
        res();
      });
    });
  }
}

module.exports = Backend;
