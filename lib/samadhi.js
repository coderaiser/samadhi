'use strict';

const tryCatch = require('try-catch');
const parseError = require('./parse-error.js');

const addFlatLint = (a) => ({
    ...a,
    rule: `${a.rule} (flatlint)`,
});

module.exports.lint = async (source, overrides = {}) => {
    const {
        fix,
        isTS,
        startLine = 0,
    } = overrides;
    
    if (fix)
        return await runFix(source);
    
    return await runLint(source, {
        isTS,
        startLine,
    });
};

async function runLint(source, {isTS, startLine}) {
    const {tokenize} = await import('./tokenize.mjs');
    const [, places] = tokenize(source, {
        startLine,
        fix: false,
    });
    
    if (places.length)
        return [source, places.map(addFlatLint)];
    
    const {default: quickLint} = await import('@putout/quick-lint');
    
    const quickLintPlaces = await quickLint(source, {
        startLine,
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
        keywordAssignFrom,
        keywordExportNoConst,
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
            keywordAssignFrom,
            keywordExportNoConst,
        },
    });
    
    if (error) {
        if (!again) {
            const {tokenize} = await import('./tokenize.mjs');
            const [code] = tokenize(source);
            
            return await runFix(code, {
                again: true,
            });
        }
        
        const places = parseError(error);
        
        return [source, places];
    }
    
    const places = [];
    
    return [code, places];
}
