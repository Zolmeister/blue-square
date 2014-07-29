/* globals _ */
'use strict'
var canv = document.getElementById('canv')
canv.width = WIDTH
canv.height = HEIGHT

window.onresize = function () {
  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight
  canv.width = WIDTH
  canv.height = HEIGHT
}
var ctx = canv.getContext('2d')

var drains = []
var shapes = []
var spawner = new Spawner()
var lives = new Lives(gameOver)

function gameOver() {
  alert('Game over')
}

var dragging = null
var draggingPos = {x: 0, y:0}

function Shape(opts) {
  _.assign(this, new BaseShape(opts))
}

Shape.prototype = Object.create(BaseShape.prototype)

Shape.prototype.kill = function () {
  if (this.isDying) return

  this.isDying = true
  this.dying = 30
}

Shape.prototype.physics = function (time) {
  BaseShape.prototype.physics.call(this, time)
  this.rot += Math.PI / 500

  if (this.isDying) {
    this.dying -= 1
    if (this.dying <= 0) {
      this.isDead = true
    }
  }
}

function loop(time) {
  //requestAnimationFrame(loop)
  setTimeout(function () {
    loop(Date.now())
  }, 200)

  // clear canvas
  ctx.clearRect(0, 0, canv.width, canv.height)

  if (lives.hasDied) {
    ctx.fillStyle = '#fff'
    ctx.font = '40px sans'
    ctx.fillText('Game Over', WIDTH / 2 - 3 * 40, HEIGHT / 2 - 20)
    return
  }

  // physics
  spawner.spawn(time)
  var i = drains.length;
  while (i--) {
    drains[i].physics(time)
  }

  var i = shapes.length
  while (i--) {
    shapes[i].physics(time)
    if (shapes[i].isDead) {
      shapes.splice(i, 1)
    }
  }

  lives.physics(time)

  var i = drains.length
  while (i--) {
    var drain = drains[i]

    var j = shapes.length
    while (j--) {
      var shape = shapes[j]

      if (shape.collide(drain)) {
        if (!shape.dying && JSON.stringify(shape.verticies) !==
             JSON.stringify(drain.verticies)) {
          lives.kill()
        }
        shape.kill()
        break
      }
    }
  }


  // draw
  for (var i = 0, l = drains.length; i < l; i++) {
    drains[i].draw(ctx)
  }
  for (var i = 0, l = shapes.length; i < l; i++) {
    shapes[i].draw(ctx)
  }

  lives.draw(ctx)
}

var level = -1

function levelUp() {
  level += 1
  drains.push(levels[level].drain)
}

levelUp()
levelUp()
levelUp()
levelUp()
levelUp()
levelUp()
levelUp()
levelUp()

requestAnimationFrame(loop)
