'use strict'

var fs = require('fs')
var p = require('path')
var saxophonist = require('./')
var count = 0

console.time('parsing time')

fs.createReadStream(p.join(__dirname, 'wikipedia', '1.xml'))
  .pipe(saxophonist('page', { highWaterMark: 1024 }))
  .on('data', function () {
    count++
  })
  .on('end', function () {
    console.timeEnd('parsing time')
    console.log('read', count, 'pages')
  })
