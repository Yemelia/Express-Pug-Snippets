const express = require('express');
const moment = require('moment');
const { highlight } = require('highlight.js');

let snippets = require('./snippets.json');

const server = express();

server.set('view engine', 'pug');

server.locals.moment = moment; // Set global variable

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

server.get('/snippet/:snippetId', (req, res) => {
    const snippet = snippets.find(s => s.id == req.params.snippetId);
    if (!snippet) return res.redirect('/');

    res.render('view', {
        snippet,
        highlight,
    });
});

server.get('/snippet/:snippetId/edit', (req, res) => {
    const snippet = snippets.find(s => s.id == req.params.snippetId);
    if (!snippet) return res.redirect('/');

    res.render('form', {
        snippet,
    });
});

server.post('/snippet/:snippetId/delete', (req, res) => {
    const snippet = snippets.find(s => s.id == req.params.snippetId);
    if (!snippet) return res.redirect('/');

    snippets = snippets.filter(s => s.id != req.params.snippetId);

    return res.redirect('/');
});

server.listen(3000, () => console.log('Server run on http://localhost:3000'));