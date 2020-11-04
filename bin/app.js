require('source-map-support').install();

const fastify = require('fastify')({
    logger: true
})

const app = require('../dist/typescript-decorators').instance;

app.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
        throw err;
    }

    console.log(`server listening on ${address}`);
    console.log('Available Hooks');
    console.log(app.printRoutes());
});
