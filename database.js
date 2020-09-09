const { info, execa } = require('@vue/cli-shared-utils');
const path = require('path');
const managePy = require('./managepy');

/**
 * Represents database used during the e2e tests
 */
let instance = null;

class Database {
  constructor({ djangopath, DJANGO_DATABASE_NAME, BACKEND_PORT, DJANGO_CONFIGURATION }) {
    if(!instance){
      instance = this;
    }

    this.djangopath = djangopath;
    this.databasename = DJANGO_DATABASE_NAME;
    this.backend_port = BACKEND_PORT;
    this.django_configuration = DJANGO_CONFIGURATION

    process.env.DJANGO_DATABASE_NAME = this.databasename;
    process.env.djangopath = this.djangopath;
    process.env.BACKEND_PORT = this.backend_port;
    process.env.DJANGO_CONFIGURATION = this.django_configuration;

    return instance;
  }

  async create() {
    try {
      info(`Creating database: '${this.databasename}'...`);
      await execa('./bin/e2e_setup_db', [this.databasename], { cwd: this.djangopath });
    } catch (e) {
      if (!e.message.includes('already exists')) {
        throw e;
      }
    }
  }

  async reset() {
    info(`Resetting database: '${this.databasename}'...`);
    return execa('./bin/e2e_reload_db', [this.databasename], { cwd: this.djangopath });
  }

  async drop() {
    info(`Dropping database: '${this.databasename}'...`);
    return execa('./bin/e2e_teardown_db', [this.databasename], { cwd: this.djangopath });
  }

  async load(dataset) {
    info(`Loading fixtures for ${dataset}`);
    return managePy(
      this.djangopath,
      ['load_e2e_data', '--datasets', dataset],
      {
        stdout: 'inherit',
        env: {
          BACKEND_PORT: this.backend_port,
          DJANGO_CONFIGURATION: this.django_configuration,
        },
      },
    );
  }
}

module.exports = Database;
