/* globals suite test */

var assert = require('assert')
var flatten = require('../index')

var primitives = {
  String: 'good morning',
  Number: 1234.99,
  Boolean: true,
  Date: new Date(),
  null: null,
  undefined: undefined
}

suite('Flatten Primitives', function () {
  Object.keys(primitives).forEach(function (key) {
    var value = primitives[key]

    test(key, function () {
      assert.deepEqual(flatten({
        hello: {
          world: value
        }
      }), {
        'hello.world': value
      })
    })
  })
})


suite('Flatten', function () {
  test('Nested once', function () {
    assert.deepEqual(flatten({
      hello: {
        world: 'good morning'
      }
    }), {
      'hello.world': 'good morning'
    })
  })

  test('Nested twice', function () {
    assert.deepEqual(flatten({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }), {
      'hello.world.again': 'good morning'
    })
  })

  test('Multiple Keys', function () {
    assert.deepEqual(flatten({
      hello: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      },
      world: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      }
    }), {
      'hello.lorem.ipsum': 'again',
      'hello.lorem.dolor': 'sit',
      'world.lorem.ipsum': 'again',
      'world.lorem.dolor': 'sit'
    })
  })

  test('Custom Delimiter', function () {
    assert.deepEqual(flatten({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }, {
      delimiter: ':'
    }), {
      'hello:world:again': 'good morning'
    })
  })

  test('Empty Objects', function () {
    assert.deepEqual(flatten({
      hello: {
        empty: {
          nested: { }
        }
      }
    }), {
      'hello.empty.nested': { }
    })
  })

  if (typeof Buffer !== 'undefined') {
    test('Buffer', function () {
      assert.deepEqual(flatten({
        hello: {
          empty: {
            nested: Buffer.from('test')
          }
        }
      }), {
        'hello.empty.nested': Buffer.from('test')
      })
    })
  }

  if (typeof Uint8Array !== 'undefined') {
    test('typed arrays', function () {
      assert.deepEqual(flatten({
        hello: {
          empty: {
            nested: new Uint8Array([1, 2, 3, 4])
          }
        }
      }), {
        'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
      })
    })
  }

  test('Custom Depth', function () {
    assert.deepEqual(flatten({
      hello: {
        world: {
          again: 'good morning'
        }
      },
      lorem: {
        ipsum: {
          dolor: 'good evening'
        }
      }
    }, {
      maxDepth: 2
    }), {
      'hello.world': {
        again: 'good morning'
      },
      'lorem.ipsum': {
        dolor: 'good evening'
      }
    })
  })

  test('Should keep number in the left when object', function () {
    assert.deepEqual(flatten({
      hello: {
        '0200': 'world',
        '0500': 'darkness my old friend'
      }
    }), {
      'hello.0200': 'world',
      'hello.0500': 'darkness my old friend'
    })
  })
})

suite('Arrays', function () {
  test('Should be able to flatten arrays properly', function () {
    assert.deepEqual({
      'a.0': 'foo',
      'a.1': 'bar'
    }, flatten({
      a: ['foo', 'bar']
    }))
  })
})
