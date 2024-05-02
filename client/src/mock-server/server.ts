import jsonServer from 'json-server';
import routes from './data/routes.js';

const server = jsonServer.create();
const router = jsonServer.router(routes);
const middlewares = jsonServer.defaults({ logger: false });

server.use(middlewares);
server.use(jsonServer.rewriter({ '/*': '/api/$1' }));
server.use(router);

const port = process.env.MOCK_SERVER_PORT || 4200;

server.listen(port, () => {
    console.log(`Mock Server is running on port ${port}`);
});
