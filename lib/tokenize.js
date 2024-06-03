'use strict';

const {traverse} = require('./traverse');
const isStringLiteral = (type) => type === 'StringLiteral';
const isComma = ({type, value}) => type === 'Punctuator' && value === ',';
const isAssign = ({type, value}) => type === 'Punctuator' && value === '=';

const isRightCurlyBrace = ({type, value}) => type === 'Punctuator' && value === '}';

const isRightRoundBrace = ({type, value}) => type === 'Punctuator' && value === ')';
const isConst = ({type, value}) => isIdentifier({
    type,
}) && value === 'const';

const isIdentifier = ({type}) => type === 'IdentifierName';

const notAS = (token) => {
    if (!isIdentifier(token))
        return false;
    
    return token.value !== 'as';
};

module.exports = (source) => {
    const newTokens = [];
    
    for (const {value, closed, type, prev, next, searchNext, searchPrev, isLast} of traverse(source)) {
        if (isStringLiteral(type) && !closed) {
            const newValue = value.replace(/\)?[,;]?$/, `')`);
            
            newTokens.push(newValue);
            continue;
        }
        
        if (isComma({type, value})) {
            if (prev([notAS, isIdentifier])) {
                newTokens.push(';');
                continue;
            }
            
            if (prev(isRightRoundBrace) && next(isRightCurlyBrace)) {
                newTokens.push(';');
                continue;
            }
            
            if (isLast(isComma))
                continue;
            
            if (searchPrev(isAssign) && searchNext(isConst)) {
                newTokens.push(';');
                continue;
            }
            
            newTokens.push(value);
            continue;
        }
        
        newTokens.push(value);
    }
    
    return newTokens.join('');
};
