import jsonServer from 'json-server';
import { customMiddlewares } from './data/middlewares.ts';
import routes from './data/routes.ts';

const server = jsonServer.create();
const router = jsonServer.router(routes);
const middlewares = jsonServer.defaults({ logger: false });

server.use(middlewares);
server.use(jsonServer.bodyParser); // Enable JSON body parsing
server.use(jsonServer.rewriter({ '/api/*': '/$1' }));
customMiddlewares.forEach((mw) => server.use(mw)); // Apply routes middlewares
server.use(router);

const port = process.env.MOCK_SERVER_PORT || 4200;
const resources = router.db.getState();
console.log('Available routes:', Object.keys(resources));

server.listen(port, () => {
    console.log(`Mock Server is running on port ${port}`);
});
