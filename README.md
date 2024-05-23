# Samadhi [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/samadhi.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/samadhi/actions/workflows/nodejs.yml "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/samadhi/actions/workflows/nodejs.yml/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/samadhi "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/samadhi?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/samadhi/badge.svg?branch=master&service=github

> **Samadhi** (Sanskrit, समाधि) *is a state of meditative consciousness.*

<img width="214" alt="image" src="https://github.com/coderaiser/samadhi/assets/1573141/c95fb001-e535-4a07-b28f-a22c520fc042">

🧘🏽**Samadhi** linter finds and fixes syntax errors.

## Install

`npm i samadhi --save`

## Avaliable fixes

<details><summary>function declaration half converted from arrow expression</summary>

```diff
-function parse(source) => {
+function parse(source) {
    return source;
}
```

</details>

<details><summary>broken string</summary>

```diff
-const a = 'hello;
+const a = 'hello';
const b = 'world';
```

</details>

<details><summary>forgotten round braces in if statement</summary>

```diff
-if a > 5 {
+if (a > 5) {
    alert();
}
```

</details>

<details><summary>missing initializer</summary>

```diff
-const {code, places} await samadhi(source);
+const {code, places} = await samadhi(source);
```

</details>


## API

### samadhi(source: string, options: Options)

Possible options:

```ts
interface Options {
    isJSX: boolean;
    isTS: boolean;
}
```

Here is example:

```js
import {lint} from 'samadhi';

const source = `
    function x() => {
        return 'hello';
    }
`;

const {code, places} = await lint(source);

// places:
[{
    rule: 'parser (quick-lint-js)',
    message: `functions/methods should not have '=>'`,
    position: {
        line: 2,
        column: 8,
    },
}];
```

You can also `fix` results:

```js
const {code, places} = await lint(source, {
    fix: true,
});

// returns
[
    `function x() {
    return 'hello';
}`,
    [],
];
```

## License

MIT
