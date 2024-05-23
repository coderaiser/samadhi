'use strict';

const {lint} = require('./samadhi');
const montag = require('montag');
const {test} = require('supertape');

test('samadhi: syntax: fn', async (t) => {
    const source = montag`
        function fn() {};
        fn();\n
    `;
    
    const {places} = await lint(source, {
        fix: true,
    });
    
    const expected = [];
    
    t.deepEqual(places, expected);
    t.end();
});

test('samadhi: syntax: broken string', async (t) => {
    const source = montag`
        const a = 'hello;
        const b = 'world';\n
    `;
    
    const {places} = await lint(source, {
        fix: true,
    });
    
    const expected = [];
    
    t.deepEqual(places, expected);
    t.end();
});

test('samadhi: one arg', async (t) => {
    const source = montag`
        const a = 'hello;
        const b = 'world';\n
    `;
    
    const {places} = await lint(source);
    const expected = [{
        message: 'unclosed string literal',
        position: {
            column: 10,
            line: 1,
        },
        rule: 'parser (quick-lint-js)',
    }];
    
    t.deepEqual(places, expected);
    t.end();
});

test('samadhi: fix error', async (t) => {
    const source = montag`
        const a = 'hello' =
    `;
    
    const {places} = await lint(source, {
        fix: true,
    });
    const expected = [{
        message: 'Assigning to rvalue ',
        position: {
            column: 10,
            line: 1,
        },
        rule: 'parser (goldstein)',
    }];
    
    t.deepEqual(places, expected);
    t.end();
});
