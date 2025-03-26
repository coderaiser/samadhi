import {lint, plugins} from 'flatlint/with-plugins';

export const tokenize = (source, {fix, startLine} = {}) => {
    const [code, places] = lint(source, {
        startLine,
        fix,
        plugins,
    });
    
    return [code, places];
};
