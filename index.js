const express = require('express');
const server = express();
const dbInit = require('./helpers/dbInit');
const { handleError, ErrorHandler } = require('./helpers/error');

const routes = require('./routes/index.route');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(routes);

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

server.get('/', (req, res, next) => {
    res.send('Backend root');
});

server.use((err, req, res, next) => {
    handleError(err, res);
});

server.listen(4242, () => {
    console.log('Server running...')
});

// initialize tables, if not yet initialized
dbInit.createAndPopulateTables();
