'use strict';

const montag = require('montag');
const test = require('supertape');
const tokenize = require('./tokenize');

test('samadhi: tokenize', (t) => {
    const result = tokenize(`a('hello);`);
    const expected = `a('hello')`;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: no semi', (t) => {
    const result = tokenize(`a('hello)`);
    const expected = `a('hello')`;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: no brace', (t) => {
    const result = tokenize(`a('hello`);
    const expected = `a('hello')`;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: comma', (t) => {
    const result = tokenize(montag`
        const x = {
            m: a('hello),
        };
    `);
    
    const expected = montag`
        const x = {
            m: a('hello')
        };
    `;
    
    t.equal(result, expected);
    t.end();
});
