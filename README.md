# Samadhi [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/samadhi.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/samadhi/actions/workflows/nodejs.yml "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/samadhi/actions/workflows/nodejs.yml/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/samadhi "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/samadhi?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/samadhi/badge.svg?branch=master&service=github

> **Samadhi** (Sanskrit, समाधि) *is a state of meditative consciousness.*

<img width="214" alt="image" src="https://github.com/coderaiser/samadhi/assets/1573141/c95fb001-e535-4a07-b28f-a22c520fc042">

🧘🏽**Samadhi** linter finds and fixes syntax errors.

## Install

`npm i samadhi --save`

## Available fixes

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

-const b = ‘hello world’;
+const b = 'hello world';


-x('hello);
+x('hello');
const m = {
-    z: x('hello
+    z: x('hello'),
}
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

<details><summary>import identifier</summary>

```diff
-import hello from hello;
+import hello from 'hello';
```

</details>

<details><summary>comma after statement</summary>

```diff
function x() {
-    return 'hello',
+    return 'hello';
}

-const a = 5,
+const a = 5;
```

</details>

<details><summary>useless comma</summary>

```diff
const a = {
-    b: 'hello',,
+    b: 'hello',
}
```

</details>

<details><summary>useless semicolon</summary>

```diff
const a = {
-    b: 'hello';
+    b: 'hello',
}
```

</details>

<details><summary>useless coma</summary>

```diff
const a = class {
-    b() {},
+    b() {}
}
```

</details>

<details><summary>assign from</summary>

```diff
-const a = from 'a';
+const a = require('a');
```

</details>

<details><summary>export without const</summary>

```diff
-export x = () => {};
+export const x = () => {};
```

</details>

<details><summary>wrong brace</summary>

```diff
-import a from 'a');
+import a from 'a';
```

</details>

## API

### lint(source: string, options: Options)

Possible options:

```ts
interface Options {
    isJSX: boolean;
    isTS: boolean;
    startLine: number;
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

const [code, places] = await lint(source);

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
const [code] = await lint(source, {
    fix: true,
});

// returns
function x() {
    return 'hello';
}
```

## License

MIT
