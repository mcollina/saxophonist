'use strict'

var test = require('tap').test
var fs = require('fs')
var p = require('path')
var writer = require('flush-write-stream')
var saxophonist = require('../')

function setup (file, element, write) {
  var input = fs.createReadStream(p.join(__dirname, file))
  input.pipe(saxophonist(element)).pipe(writer.obj(write))
}

test('parse simple xml file', function (t) {
  t.plan(4)

  setup('simple.xml', 'b', write)

  var expected = ['1', '2', '3', null]

  function write (elem, enc, cb) {
    t.deepEqual(elem, {
      path: ['a', 'b'],
      attributes: {},
      text: expected.shift(),
      children: null
    })

    cb()
  }
})

test('parse xml file with cdata', function (t) {
  t.plan(2)

  setup('cdata.xml', 'sender', write)

  var expected = ['<sender>John Smith</sender>', 'DDD<aaa>CCC</bbb>']

  function write (elem, enc, cb) {
    t.deepEqual(elem, {
      path: ['abc', 'sender'],
      attributes: {},
      text: expected.shift(),
      children: null
    })

    cb()
  }
})

test('parse xml attributes', function (t) {
  t.plan(1)

  setup('attributes.xml', 'hello', write)

  function write (elem, enc, cb) {
    t.deepEqual(elem, {
      path: ['hello'],
      attributes: {
        a: '1',
        b: '2'
      },
      text: null,
      children: null
    })

    cb()
  }
})

test('parse deep elements', function (t) {
  t.plan(2)

  setup('deep.xml', 'b', write)

  var expected = [{
    path: ['a', 'b'],
    attributes: {},
    children: [{
      path: ['a', 'b', 'c'],
      attributes: {},
      text: '1',
      children: null
    }],
    text: null
  }, {
    path: ['a', 'b'],
    attributes: {},
    children: [{
      path: ['a', 'b', 'b'],
      attributes: {},
      text: '2',
      children: null
    }],
    text: null
  }]

  function write (elem, enc, cb) {
    t.deepEqual(elem, expected.shift())
    cb()
  }
})
