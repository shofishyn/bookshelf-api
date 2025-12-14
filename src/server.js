const Hapi = require('@hapi/hapi');
const routes = require('./routes.js');

const startServer = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});