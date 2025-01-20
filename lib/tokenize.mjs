import {lint, plugins} from 'flatlint/with-plugins';

export const tokenize = (source, {fix} = {}) => {
    const [code, places] = lint(source, {
        fix,
        plugins,
    });
    
    return [code, places];
};
