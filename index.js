const start = require('./start');

const defaults = {
  'runserver': true,
}

module.exports = (api, options) => {
  api.registerCommand('test:django:e2e',
    {
      description: 'Execute e2e tests',
      usage: 'vue-cli-service test:django:e2e --djangopath=/path/of/django/project',
      options: {
        '--djangopath': 'Specify root path to django project',
        '--headless': 'Run in headless mode',
        '--mode': 'Loads a corresponding .env.[mode] file',
        '--gever': 'Use a real GEVER backend',
        '--spec': 'Specify which test file(s) to run instead of running all tests',
        '--runserver': `Also start the backend (with Django's runserver) (default: ${defaults["runserver"]})`
      },
    },
    async (args) => {
      args = Object.assign(defaults, args)
      await start(api, Object.assign(options, args));
    }
  );
};

module.exports.defaultModes = {
  'test:django:e2e': 'production',
};
