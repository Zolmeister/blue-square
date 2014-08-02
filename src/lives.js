function Lives() {
  this.hasDied = false
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
Lives.prototype.physics = function (time) {
  var i = this.hearts.length
  while (i--) {
    this.hearts[i].physics(time)
    if (this.hearts[i].isDead) {
      this.hearts.splice(i, 1)
    }
  }

  if (!this.hasDied && !this.hearts.length) {
    this.hasDied = true
  }
}

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
  var i = this.hearts.length
  while (i--) {
    if (!this.hearts[i].isDying) {
      console.log('killing heart,', i);
      this.hearts[i].kill()
      break
    }
  }
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
Heart.prototype.kill = function () {
  if (this.isDying) return

  this.isDying = true
  this.dying = 100
}
Heart.prototype.physics = function (time) {
  BaseShape.prototype.physics.call(this, time)

  if (this.isDying) {
    this.dying -= 1
    if (this.dying <= 0) {
      this.isDead = true
    }
  }
}
