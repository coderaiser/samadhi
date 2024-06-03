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

test('samadhi: tokenize: comma in body', (t) => {
    const result = tokenize(montag`
        function x() {
            fn(),
        }
        
        function x1() {
            fn(), m(),
        }
    `);
    
    const expected = montag`
        function x() {
            fn();
        }
        
        function x1() {
            fn(), m();
        }
    `;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: comma in object', (t) => {
    const source = montag`
        const a = {
            b,
        };
    `;
    
    const result = tokenize(source);
    
    t.equal(result, source);
    t.end();
});

test('samadhi: tokenize: no left round brace', (t) => {
    const source = montag`
        fn(), fn2();
    `;
    
    const result = tokenize(source);
    
    t.equal(result, source);
    t.end();
});

test('samadhi: tokenize: comma in return', (t) => {
    const result = tokenize(montag`
        function x() {
            return m,
        }
    `);
    
    const expected = montag`
        function x() {
            return m;
        }
    `;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: comma: last token', (t) => {
    const result = tokenize(montag`
        function x() {
            return m;
        },
    `);
    
    const expected = montag`
        function x() {
            return m;
        }
    `;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: comma: after const', (t) => {
    const result = tokenize(montag`
        const a = 5,
        const b = 3,
    `);
    
    const expected = montag`
        const a = 5;
        const b = 3
    `;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: comma: last token and newlines', (t) => {
    const result = tokenize(montag`
        export const traverse = ({push}) => ({
            ObjectProperty(path) {
            },
        }),\n\n
    `);
    
    const expected = montag`
        export const traverse = ({push}) => ({
            ObjectProperty(path) {
            },
        });\n\n
    `;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: comma: import', (t) => {
    const result = tokenize(montag`
        import {
            BIND_LEXICAL,
            tokTypes as tt,
        } from '../operator/index.js';
        
        var t,
        
        export default () => {};
    `);
    
    const expected = montag`
        import {
            BIND_LEXICAL,
            tokTypes as tt,
        } from '../operator/index.js';
        
        var t;
        
        export default () => {};
    `;
    
    t.equal(result, expected);
    t.end();
});

test('samadhi: tokenize: comma: function', (t) => {
    const result = tokenize(montag`
        const {isAwaitExpression} = types;
        
        function m(a, b) {}
        let t,
        
        export default function keywordTry(Parser) {
            const {keywordTypes} = Parser.acorn;
        }
    `);
    
    const expected = montag`
        const {isAwaitExpression} = types;
        
        function m(a, b) {}
        let t;
        
        export default function keywordTry(Parser) {
            const {keywordTypes} = Parser.acorn;
        }
    `;
    
    t.equal(result, expected);
    t.end();
});
