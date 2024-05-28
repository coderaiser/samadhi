'use strict';

const jsTokens = require('js-tokens');
const isStringLiteral = (type) => type === 'StringLiteral';

module.exports = (source) => {
    const newTokens = [];
    
    for (const {value, closed, type} of jsTokens(source)) {
        if (isStringLiteral(type) && !closed) {
            const newValue = value.replace(/\)?[,;]?$/, `')`);
            
            newTokens.push(newValue);
            continue;
        }
        
        newTokens.push(value);
    }
    
    return newTokens.join('');
};
