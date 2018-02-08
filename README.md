# json-composer

> small utility to help to compose json files with other json files.

[![Travis branch](https://img.shields.io/travis/nomocas/json-composer/master.svg)](https://travis-ci.org/nomocas/json-composer)
[![Coverage Status](https://coveralls.io/repos/github/nomocas/json-composer/badge.svg?branch=master)](https://coveralls.io/github/nomocas/json-composer?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/nomocas/json-composer/badges/score.svg)](https://www.bithound.io/github/nomocas/json-composer)
[![bitHound Dependencies](https://www.bithound.io/github/nomocas/json-composer/badges/dependencies.svg)](https://www.bithound.io/github/nomocas/json-composer/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nomocas/json-composer/badges/devDependencies.svg)](https://www.bithound.io/github/nomocas/json-composer/master/dependencies/npm)
[![licence](https://img.shields.io/npm/l/json-composer.svg)](https://spdx.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Usage

You need to provide a resolver (example with json from fs) :

```javascript
const Composer = require('json-composer');

// ********** Define a resolver *************

const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

async function readJSON(jsonPath) {
    try {
        const content = await readFile(jsonPath, 'utf8');
        return JSON.parse(content);
    } catch (e) {
        console.error('Error while parsing : ', e); // eslint-disable-line no-console
    }
}

async function resolver(cwd, filePath) {
    const finalPath = path.resolve(cwd, filePath);

    // don't forget to forward your resolver
    return Composer.extend(await readJSON(finalPath), finalPath, resolver);
}

// ********** end resolver *************

try {
    resolver('/', './composed.json')
        .then(r => console.log('extended', r))
        .catch(e => console.error('error', e));
} catch (e) {
    console.error('error', e);
}
```

Then imagine files as this : 

__/bru.json__
```json 
{
    "bru": true
}
```

__/bro.json__
```json 
{
    "bro": 1234
}
```

__/bar.json__
```json 
{
    "zoo": "bidoo",
    "bloupi": {
        ">>": ["./bru.json", "./bro.json"]
    }
}
```

__/composed.json__
```json 
{
    ">>foo": "./bar.json",
    "hello": "world"
}
```

Then using your resolver above : 

```javascript
try {
    resolver(__dirname, './composed.json')
        .then(r => console.log('extended :', r))
        .catch(e => console.error('error', e));
} catch (e) {
    console.error('error', e);
}
```

Will print :

```shell
> extended : { hello: 'world', foo: { zoo: 'bidoo', bloupi: { bru: true, bro: 1234 } } }
```

## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2018 (c) Gilles Coomans

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
