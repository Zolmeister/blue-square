function Lives() {
  this.deadCallback = _.noop
  this.hearts = []

  var size = 0.02
  for(var i = 0; i < START_LIVES; i++) {
    this.hearts.push(new Heart({
      x: 0.05 + size * i * 2 + 0.02 * i,
      y: 0.05,
      size: size
    }))
  }
}

// physics
// once last heart is removed, call deadCallback

Lives.prototype.draw = function (ctx) {
  var x = 0.01
  var y = 0.01

  var i = this.hearts.length
  while (i--) {
    this.hearts[i].draw(ctx)
  }

}

Lives.prototype.kill = function () {
  // kill the next living heart, if it exists
}

Lives.prototype.onDead = function (fn) {
  this.deadCallback = fn
}

function mirror(arr) {
  var res = arr
  var i = res.length
  while (i--) {
    res = res.concat([{x: -res[i].x, y: res[i].y}])
  }

  return res
}

function Heart(opts) {
  _.defaults(opts, {
      color: '#ff3fa8',
      size: 0.1,
      lineWidth: 0.003,
      verticies: mirror([

        // start in the middle, go clockwise
        {x: 0, y: -0.5},
        {x: 0.1, y: -0.8},
        {x: 0.3, y: -1},
        {x: 0.7, y: -1},
        {x: 1, y: -0.8},
        {x: 1, y: -0.3},
        {x: 0.7, y: 0.3},
        {x: 0, y: 1}
      ])
    })

  _.assign(this, new BaseShape(opts))
}

Heart.prototype = Object.create(BaseShape.prototype)
