const start = require('./start');

module.exports = (api, options) => {
  api.registerCommand('test:django:e2e',
    {
      description: 'Execute e2e tests in interactive mode',
      usage: 'vue-cli-servce test:django:e2e --djangopath=/path/of/django/project',
      options: {
        '--djangopath': 'Specifiy root path to django project',
      },
    },
    async (args) => { await start(api, Object.assign(options, args)); }
  );

  api.registerCommand('test:django:e2e:headless',
    {
      description: 'Execute e2e tests in headless mode',
      usage: 'vue-cli-servce test:django:e2e:headless --djangopath=/path/of/django/project',
      options: {
        '--djangopath': 'Specifiy root path to django project',
      },
    },
    async (args) => { await start(api, Object.assign(options, { headless: true }, args)); }
  );
}

module.exports.defaultModes = {
  'test:django:e2e': 'test',
  'test:django:e2e:headless': 'test',
}
