import {lint, plugins} from 'flatlint/with-plugins';

export const tokenize = (source) => {
    const [code] = lint(source, {
        fix: true,
        plugins,
    });
    
    return code;
};
