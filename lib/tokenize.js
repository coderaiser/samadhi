'use strict';

const {traverse} = require('./traverse');
const isStringLiteral = (type) => type === 'StringLiteral';
const isComma = ({type, value}) => type === 'Punctuator' && value === ',';
const isAssign = ({type, value}) => type === 'Punctuator' && value === '=';
const isNewline = ({type, value}) => type === 'LineTerminatorSequence' && value === '\n';
const isSpace = ({type}) => type === 'WhiteSpace';

const isRightCurlyBrace = ({type, value}) => type === 'Punctuator' && value === '}';
const isLeftCurlyBrace = ({type, value}) => type === 'Punctuator' && value === '{';
const isLeftRoundBrace = ({type, value}) => type === 'Punctuator' && value === '(';
const isRightRoundBrace = ({type, value}) => type === 'Punctuator' && value === ')';
const isConst = ({type, value}) => isIdentifier({type}) && value === 'const';
const isIdentifier = ({type}) => type ==='IdentifierName'

const {isArray} = Array;
const maybeArray = (a) => isArray(a) ? a : [a];

module.exports = (source) => {
    const newTokens = [];
    
    for (const {value, closed, type, prev, next, searchNext, searchPrev, isLast} of traverse(source)) {
        if (isStringLiteral(type) && !closed) {
            const newValue = value.replace(/\)?[,;]?$/, `')`);
            
            newTokens.push(newValue);
            continue;
        }
        
        if (isComma({type, value})) {
            const rightCurly = searchNext(isRightCurlyBrace);
            
            if (prev([isIdentifier, isIdentifier])) {
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

