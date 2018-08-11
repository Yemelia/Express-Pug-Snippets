const express = require('express');
const moment = require('moment');
const crypto = require('crypto');
const { highlight } = require('highlight.js');

let snippets = require('./snippets.json');

const server = express();

server.set('view engine', 'pug');

server.locals.moment = moment; // Set global variable

server.use(express.static('public'));
server.use('/lib', express.static('node_modules'));
server.use(express.urlencoded({ extended: false }));

server.get('/', (req, res) => {
    res.render('index', {
        title: 'Express Snippet',
        snippets,
    });
});

server.get('/snippets/create', (req, res) => {
    res.render('form', {
        snippet: {}
    });
});

server.get('/snippets/search', (req, res) => {
    if (!req.query.query) return res.redirect('/');

    const query = req.query.query.toLowerCase();

    const foundSnippets = snippets.filter(s =>
        s.filename.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.language.toLowerCase().includes(query)
    );

    res.render('search', {
        title: 'Результаты поиска',
        query: req.query.query,
        snippets: foundSnippets
    });
});

server.get('/snippets/:snippetId', (req, res) => {
    const snippet = snippets.find(s => s.id == req.params.snippetId);
    if (!snippet) return res.redirect('/');

    res.render('view', {
        snippet,
        highlight,
    });
});

server.get('/snippets/:snippetId/edit', (req, res) => {
    const snippet = snippets.find(s => s.id == req.params.snippetId);
    if (!snippet) return res.redirect('/');

    res.render('form', {
        snippet,
    });
});

server.post('/snippets/create', (req, res) => {
    const snippet = {
        id: crypto.randomBytes(8).toString('hex'),
        createdAt: Date.now(),
        ...req.body
    };
    
    snippets.push(snippet);

    res.redirect('/');
});

server.post('/snippets/:snippetId/edit', (req, res) => {
    const snippet = snippets.find(s => s.id == req.params.snippetId);

    if (!snippet) return res.redirect('/');

    snippets = snippets.map(s => {
        if (s.id != snippet.id) return s;
        else return {
            ...s,
            ...req.body,
            updatedAt: Date.now(),
        };
    });

    res.redirect(`/snippets/${snippet.id}`);
});

server.post('/snippets/:snippetId/delete', (req, res) => {
    const snippet = snippets.find(s => s.id == req.params.snippetId);
    if (!snippet) return res.redirect('/');

    snippets = snippets.filter(s => s.id != req.params.snippetId);

    return res.redirect('/');
});

server.listen(3000, () => console.log('Server run on http://localhost:3000'));