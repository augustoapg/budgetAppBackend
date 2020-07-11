const express = require('express');
const server = express();

server.get('/', (req, res) => {
    res.send('Backend root');
});

server.post('/newTransaction', (req, res) => {
    console.log(req);
    res.json({message: 'New Transaction Saved!'});
});

server.listen(4242, () => {
    console.log('Server running...')
});