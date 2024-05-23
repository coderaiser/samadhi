'use strict';

module.exports = (e) => {
    const {line, column} = e.loc;
    const rule = 'parser (goldstein)';
    const message = cutBrackets(e.message);
    
    return [{
        rule,
        message,
        position: {
            line,
            column,
        },
    }];
};

function cutBrackets(a) {
    const index = a.lastIndexOf('(');
    return a.slice(0, index);
}
