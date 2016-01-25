'use strict'

var test = require('tap').test
var fs = require('fs')
var p = require('path')
var writer = require('flush-write-stream')
var saxophonist = require('../')

test('parse simple xml file', function (t) {
  t.plan(4)

  var input = fs.createReadStream(p.join(__dirname, 'simple.xml'))
  var expected = ['1', '2', '3', null]
  input.pipe(saxophonist('b')).pipe(writer.obj(write))

  function write (elem, enc, cb) {
    t.deepEqual(elem, {
      path: ['a', 'b'],
      attributes: {},
      text: expected.shift()
    })

    cb()
  }
})

test('parse xml file with cdata', function (t) {
  t.plan(2)

  var input = fs.createReadStream(p.join(__dirname, 'cdata.xml'))
  var expected = ['<sender>John Smith</sender>', 'DDD<aaa>CCC</bbb>']
  input.pipe(saxophonist('sender')).pipe(writer.obj(write))

  function write (elem, enc, cb) {
    t.deepEqual(elem, {
      path: ['abc', 'sender'],
      attributes: {},
      text: expected.shift()
    })

    cb()
  }
})

test('parse simple xml file', function (t) {
  t.plan(1)

  var input = fs.createReadStream(p.join(__dirname, 'attributes.xml'))
  input.pipe(saxophonist('hello')).pipe(writer.obj(write))

  function write (elem, enc, cb) {
    t.deepEqual(elem, {
      path: ['hello'],
      attributes: {
        a: '1',
        b: '2'
      },
      text: null
    })

    cb()
  }
})
