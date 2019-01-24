const portfinder = require('portfinder');

function findPort(defaultPort) {
  portfinder.basePort = defaultPort;
  return portfinder.getPortPromise();
}

module.exports = (async () => {
  const BACKEND_PORT_DEFAULT = await findPort(34000);
  const FRONTEND_PORT_DEFAULT = await findPort(35000);
  const CYPRESS_PORT_DEFAULT = await findPort(36000);

  const BACKEND_PORT = process.env.PORT1 || BACKEND_PORT_DEFAULT;
  const FRONTEND_PORT = process.env.PORT2 || FRONTEND_PORT_DEFAULT;
  const CYPRESS_PORT = process.env.PORT3 || CYPRESS_PORT_DEFAULT;

  const DJANGO_DATABASE_NAME = process.env.DJANGO_E2E_DATABASE_NAME || `E2E_TESTING_${BACKEND_PORT}`;

  return {
    BACKEND_PORT,
    FRONTEND_PORT,
    CYPRESS_PORT,
    DJANGO_DATABASE_NAME,
  };
})();
