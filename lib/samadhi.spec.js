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

test('samadhi: fix: missing initializer', async (t) => {
    const source = montag`
        const {code, places} await samadhi(source);
    `;
    
    const {code} = await lint(source, {
        fix: true,
    });
    
    const expected = montag`
        const {code, places} = await samadhi(source);\n
    `;
    
    t.equal(code, expected);
    t.end();
});

test('samadhi: fix: import identifier', async (t) => {
    const source = montag`
        import hello from hello;
    `;
    
    const {code} = await lint(source, {
        fix: true,
    });
    
    const expected = montag`
        import hello from 'hello';\n
    `;
    
    t.equal(code, expected);
    t.end();
});
