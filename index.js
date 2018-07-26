const express = require('express');
const moment = require('moment');

const snippets = require('./snippets.json');

const server = express();

server.set('view engine', 'pug');

server.locals.moment = moment;

server.use(express.static('public'));
server.use('/lib', express.static('node_modules'));

server.get('/', (req, res) => {
    res.render('index', {
        title: 'Express Snippet',
        snippets,
    });
});

server.get('/create', (req, res) => {
    res.render('form', {
        snippet: {}
    });
});

server.listen(3000, () => console.log('Server run on http://localhost:3000'));