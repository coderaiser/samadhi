'use strict';

const {test} = require('supertape');
const parseError = require('./parse-error');

test('samadhi: parseError', (t) => {
    const e = Error('hello (1:1)');
    const result = parseError(e);
    const expected = [{
        message: 'hello ',
        position: {
            column: 1,
            line: 1,
        },
        rule: 'parser (goldstein)',
    }];
    
    t.deepEqual(result, expected);
    t.end();
});
