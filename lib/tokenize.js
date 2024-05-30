'use strict';

const jsTokens = require('js-tokens');
const isStringLiteral = (type) => type === 'StringLiteral';
const isComma = ({type, value}) => type === 'Punctuator' && value === ',';
const isAssign = ({type, value}) => type === 'Punctuator' && value === '=';

const isRightCurlyBrace = ({type, value}) => type === 'Punctuator' && value === '}';
const isLeftRoundBrace = ({type, value}) => type === 'Punctuator' && value === ')';
const isConst = ({type, value}) => type === 'IdentifierName' && value === 'const';

module.exports = (source) => {
    const newTokens = [];
    
    for (const {value, closed, type, searchNext, searchPrev, isLast} of tokenize(source)) {
        if (isStringLiteral(type) && !closed) {
            const newValue = value.replace(/\)?[,;]?$/, `')`);
            
            newTokens.push(newValue);
            continue;
        }
        
        if (isComma({type, value})) {
            const rightCurly = searchNext(isRightCurlyBrace);
            
            if (searchPrev(isLeftRoundBrace) && rightCurly) {
                newTokens.push(';');
                continue;
            }
            
            if (isLast())
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

function* tokenize(source) {
    const tokens = Array.from(jsTokens(source));
    let i = 0;
    let j = 0;
    let k = 0;
    let [current] = tokens;
    const start = 0;
    const end = tokens.length;
    
    const init = () => {
        current = tokens[i];
        
        return {
            ...current,
            searchNext,
            searchPrev,
            isLast,
        };
    };
    
    const isLast = () => j === end - 1;
    
    const searchNext = (is) => {
        k = j;
        ++k;
        
        while (k < end) {
            if (is(tokens[k]))
                return init();
            
            ++k;
        }
        
        return false;
    };
    
    const searchPrev = (is) => {
        k = j;
        
        if (!k)
            return false;
        
        while (k >= start) {
            if (is(tokens[k]))
                return init();
            
            --k;
        }
        
        return false;
    };
    
    for (j = start; j < end; j++) {
        i = j;
        k = j;
        yield init();
    }
}
