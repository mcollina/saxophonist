# saxophonist

Extract elements from large XML files with node.js streams

## Usage

```js
'use strict'

var fs = require('fs')
var p = require('path')
var saxophonist = require('./')
var count = 0

console.time('parsing time')

fs.createReadStream(p.join(__dirname, 'wikipedia', '1.xml'))
  .pipe(saxophonist('page'))
  .on('data', function () {
    count++
  })
  .on('end', function () {
    console.timeEnd('parsing time')
    console.log('read', count, 'pages')
  })
```

The data format is:

```js
{
  path: ['a', 'path', 'to', 'page'], // the path in the XML document
  children: null, // or an array with elements like this
  attributes: {}, // object with all element attribute
  text: null // or string, containing the element text
}
```

## Acknowledgements

saxophonist is sponsored by [nearForm](http://nearform.com).

## License

MIT
