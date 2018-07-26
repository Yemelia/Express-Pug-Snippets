const express = require('express');

const snippets = require('./snippets.json');

const server = express();

server.set('view engine', 'pug');

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