'use strict';

const tryCatch = require('try-catch');
const parseError = require('./parse-error.js');

module.exports.lint = async (source, {fix, isTS} = {}) => {
    if (fix)
        return await runFix(source);
    
    return await runLint(source, {
        isTS,
    });
};

async function runLint(source, {isTS}) {
    const {default: quickLint} = await import('@putout/quick-lint');
    const quickLintPlaces = await quickLint(source, {
        isTS,
        isJSX: true,
    });
    
    return {
        places: quickLintPlaces,
        code: source,
    };
}

async function runFix(source) {
    const {compile, keywords} = await import('goldstein');
    const {
        keywordArrow,
        keywordIf,
        keywordBrokenString,
        keywordMissingInitializer,
    } = keywords;
    
    const [error, code] = tryCatch(compile, source, {
        keywords: {
            keywordArrow,
            keywordIf,
            keywordBrokenString,
            keywordMissingInitializer,
        },
    });
    
    if (error) {
        const places = parseError(error);
        
        return {
            code: source,
            places,
        };
    }
    
    return {
        code,
        places: [],
    };
}
