const portfinder = require('portfinder');

function findPort(defaultPort) {
  portfinder.basePort = defaultPort;
  return portfinder.getPortPromise();
}

module.exports = (async () => {
  const BACKEND_PORT_DEFAULT = await findPort(34000);
  const FRONTEND_PORT_DEFAULT = await findPort(35000);
  const CYPRESS_PORT_DEFAULT = await findPort(36000);

  const BACKEND_PORT = process.env.BACKEND_PORT || BACKEND_PORT_DEFAULT;
  const FRONTEND_PORT = process.env.FRONTEND_PORT || FRONTEND_PORT_DEFAULT;
  const CYPRESS_PORT = process.env.CYPRESS_PORT || CYPRESS_PORT_DEFAULT;
  const GEVER_PORT = process.env.ZSERVER_PORT || '55001';

  const DJANGO_DATABASE_NAME = process.env.DJANGO_E2E_DATABASE_NAME || `e2e_testing_${BACKEND_PORT}`;
  const DJANGO_CONFIGURATION = process.env.DJANGO_CONFIGURATION || 'TestingE2E';
  const DJANGO_MEDIA_ROOT = process.env.DJANGO_MEDIA_ROOT || null;

  return {
    ...DJANGO_MEDIA_ROOT && { DJANGO_MEDIA_ROOT },
    BACKEND_PORT,
    FRONTEND_PORT,
    CYPRESS_PORT,
    GEVER_PORT,
    DJANGO_DATABASE_NAME,
    DJANGO_CONFIGURATION,
  };
})();
