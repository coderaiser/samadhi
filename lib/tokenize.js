'use strict';

const jsTokens = require('js-tokens');
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
    
    for (const {value, closed, type, prev, next, searchNext, searchPrev, isLast} of tokenize(source)) {
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
            prev,
            next,
            isLast,
        };
    };
    
    const isLast = () => {
        if (j === end - 1)
            return true;
        
        let is = true;
        
        searchNext((token, stop) => {
            if (isNewline(token))
                return false;
            
            if (!isNewline(token)) {
                is = false;
                return stop();
            }
        });
        
        return is;
    };
    
    const searchNext = (is) => {
        k = j;
        ++k;
        
        let isStop = false;
        
        const stop = () => {
            isStop = true;
        };
        
        while (k < end) {
            if (is(tokens[k], stop))
                return init();
            
            if (isStop)
                break;
            
            ++k;
        }
        
        return false;
    };
    
    const prev = (sequence) => {
        sequence = maybeArray(sequence);
        
        let result = true;
        
        const is = (a) => {
            const fn = sequence.pop();
            
            if (!fn)
                return 'stop'
            
            if (fn(a))
                return 'ok';
             
             return 'fail';
        }
        
        searchPrev((token, stop) => {
            if (isSpace(token))
                return false;
            
            const check = is(token);
            
            if (check === 'stop')
                return stop();
            
            if (check === 'ok')
                return false;
            
            if (check === 'fail') {
                result = false;
                return stop();
            }
            
            if (!isSpace(token)) {
                result = false;
                return stop();
            }
        });
        
        return result;
    };

    const next = (sequence) => {
        sequence = maybeArray(sequence);
        
        let result = true;
        
        const is = (a) => {
            const fn = sequence.pop();
            
            if (!fn)
                return 'stop'
            
            if (fn(a))
                return 'ok';
             
             return 'fail';
        }
        
        searchNext((token, stop) => {
            if (isSpace(token))
                return false;
            
            if (isNewline(token))
                return false;
            
            const check = is(token);
            
            if (check === 'stop')
                return stop();
            
            if (check === 'ok')
                return false;
            
            if (check === 'fail') {
                result = false;
                return stop();
            }
            
            if (!isSpace(token)) {
                result = false;
                return stop();
            }
        });
        
        return result;
    };
    
    const searchPrev = (is) => {
        k = j;
        let isStop = false;
        
        const stop = () => {
            isStop = true;
        };
        
        if (!k)
            return false;
        
        --k;
        
        while (k >= start) {
            if (is(tokens[k], stop))
                return init();
            
            if (isStop)
                break;
            
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
