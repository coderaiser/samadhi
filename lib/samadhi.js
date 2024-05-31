'use strict';

const tryCatch = require('try-catch');
const parseError = require('./parse-error.js');
const tokenize = require('./tokenize');

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
    
    return [source, quickLintPlaces];
}

async function runFix(source, {again} = {}) {
    const {compile, keywords} = await import('goldstein');
    const {
        keywordArrow,
        keywordIf,
        keywordImport,
        keywordBrokenString,
        keywordMissingInitializer,
        keywordUselessComma,
        keywordUselessSemicolon,
    } = keywords;
    
    const [error, code] = tryCatch(compile, source, {
        keywords: {
            keywordArrow,
            keywordIf,
            keywordImport,
            keywordBrokenString,
            keywordMissingInitializer,
            keywordUselessComma,
            keywordUselessSemicolon,
        },
    });
    
    if (error) {
        if (!again)
            return await runFix(tokenize(source), {
                again: true,
            });
        
        const places = parseError(error);
        
        return [source, places];
    }
    
    const places = [];
    
    return [code, places];
}
