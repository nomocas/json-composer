# json-composer

> small utility to help to compose json files with other json files.

[![Travis branch](https://img.shields.io/travis/nomocas/json-composer/master.svg)](https://travis-ci.org/nomocas/json-composer)
[![Coverage Status](https://coveralls.io/repos/github/nomocas/json-composer/badge.svg?branch=master)](https://coveralls.io/github/nomocas/json-composer?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/nomocas/json-composer/badges/score.svg)](https://www.bithound.io/github/nomocas/json-composer)
[![bitHound Dependencies](https://www.bithound.io/github/nomocas/json-composer/badges/dependencies.svg)](https://www.bithound.io/github/nomocas/json-composer/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nomocas/json-composer/badges/devDependencies.svg)](https://www.bithound.io/github/nomocas/json-composer/master/dependencies/npm)
[![licence](https://img.shields.io/npm/l/json-composer.svg)](https://spdx.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


## Usage

Imagine json files as this : 

__./bru.json__

```javascript 
{
    "bru": true
}
```

__./bro.json__

```javascript 
{
    "bro": 1234,
    "bra": "lollipop"
}
```

__./bar.json__

```javascript 
{
    "zoo": "bidoo",
    "boo": {
        ">>": ["./bru.json", "./bro.json"], // will be resolved and inherited
        "bro": 5678
    }
}
```

__./composed.json__

```javascript
{
    ">>foo": "./bar.json", // will be resolved and assigned
    "hello": "world"
}
```

Then using your resolver (see below) : 

```javascript
resolver(__dirname, './composed.json')
    .then(r => console.log('extended :', r))
    .catch(e => console.error('error', e));
```

Will print :

```javascript
{
    hello: 'world', // from composed.json
    foo: {  // has been assigned (from bar.json)
        zoo: 'bidoo',   // has been inherited (from bar.json)
        boo: { // has been inherited (from bar.json)
            bru: true, // has been inherited (from bru.json)
            bra: "lollipop", // has been inherited (from bro.json)
            bro: 5678   // has been overrided  (inherited from bro)
        }
    }
}
```

### Resolver

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
        return JSON.parse(await readFile(jsonPath, 'utf8'));
    } catch (e) {
        console.error('Error while loading (%s) : ', jsonPath, e);
        throw new Error('JSON composition failed.');
    }
}

/**
 * @example
 * const composed = await resolver(__dirname, './relative/path/to.json');
 * 
 * @example
 * const composed = await resolver('/absolute/or/rel/path/from/current/cwd.json');
 */
async function resolver(cwd, filePath) {
    const finalPath = arguments.length === 2 ? path.resolve(cwd, filePath) : cwd;

    // don't forget to forward your resolver
    return Composer.extend(await readJSON(finalPath), finalPath, resolver);
}

// ********** end resolver *************

// usage

resolver(__dirname, './composed.json')
    .then(r => console.log('extended', r))
    .catch(e => console.error('error', e));
```

## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2018 (c) Gilles Coomans

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
