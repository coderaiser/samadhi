'use strict';

const jsTokens = require('js-tokens');
const isStringLiteral = (type) => type === 'StringLiteral';
const isComma = ({type, value}) => type === 'Punctuator' && value === ',';
const isNewline = ({type}) => type === 'LineTerminatorSequence';
const isRightCurlyBrace = ({type, value}) => type === 'Punctuator' && value === '}';
const isLeftRoundBrace = ({type, value}) => type === 'Punctuator' && value === ')';
const isAssign = ({type, value}) => type === 'Punctuator' && value === '=';

module.exports = (source) => {
    const newTokens = [];
    
    for (const {value, closed, type, searchNext, searchPrev} of tokenize(source)) {
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
    let current = tokens[0];
    let start = 0;
    let end = tokens.length;
    
    const init = () => {
        current = tokens[i];
        
        return {
            ...current,
            searchNext,
            searchPrev,
        };
    }
    
    const searchNext = (is) => {
       ++k;
       while (k < end) {
           if (is(tokens[k]))
               return init();
           
           ++k;
       }
        
       return false;
    }
    
    const searchPrev= (is) => {
       --k;
       while (k >= start) {
           const current = tokens[k];
           
           if (is(tokens[k]))
               return init();
           
           --k;
       }
        
       return false;
    }
    
    for (j = start; j < end; j++) {
        i = j;
        k = j;
        yield init();
    }
}
