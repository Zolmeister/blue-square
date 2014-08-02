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
ctx.textAlign = 'center'

var drains, shapes, spawner, lives, score, dragging, draggingPos, level
var buttons = []
var LEVEL_TIME = 30000
var levelInterval = null
var levelLoadingBar
function newGame() {
  window.clearInterval(levelInterval)
  levelInterval = setInterval(levelUp, LEVEL_TIME)
  level = -1
  dragging = null
  draggingPos = {x: 0, y:0}
  buttons = []

  drains = []
  shapes = []
  spawner = new Spawner(function () {
    lives.kill()
  })
  lives = new Lives()
  score = new Score()
  levelLoadingBar = new LevelLoadingBar(LEVEL_TIME)

  levelUp()
}

function LevelLoadingBar(interval) {
  this.totalTime = interval
  this.progress = 0
  this.time = 0
}

LevelLoadingBar.prototype.physics = function (time, delta) {
  this.time += delta
  this.progress = (this.time % this.totalTime) / this.totalTime
}

LevelLoadingBar.prototype.draw = function (ctx) {
  ctx.fillStyle = drains[drains.length - 1].color
  ctx.fillRect(0, 0, WIDTH * this.progress, 4)
}


function Score() {
  this.best = parseInt(typeof localStorage !== 'undefined' &&
                       localStorage.best || '0', 10)
  this.value = 0
  this.x = 0.90
  this.y = 0.04
  this.color = '#fff'
}

Score.prototype.draw = function (ctx) {
  var scale = Math.min(WIDTH, HEIGHT)

  ctx.save()
  ctx.translate(this.x * WIDTH, this.y * HEIGHT)
  ctx.fillStyle = this.color
  ctx.font = scale / 40 + 'px sans'
  ctx.fillText('best: ' + this.best, this.x, this.y)
  ctx.fillText('score: ' + this.value, this.x, this.y + scale / 35)
  ctx.restore()
}

Score.prototype.add = function (val) {
  this.value += val
}

Score.prototype.save = function () {
  if (this.isBest() && typeof localStorage !== 'undefined') {
    localStorage.best = this.value
    this.best = this.value
  }
}

Score.prototype.isBest = function () {
  return this.value > this.best
}



function Shape(opts) {
  _.assign(this, new BaseShape(opts))
  this.life = 500
  this.deathTime = 100
  this.killCallback = opts && opts.onKill || _.noop
}

Shape.prototype = Object.create(BaseShape.prototype)

Shape.prototype.kill = function (shouldNotCallback) {
  if (this.isDying) return
  if (!shouldNotCallback) {
    this.killCallback()
  }
  this.isDying = true
  this.dying = this.deathTime
}

Shape.prototype.physics = function (time) {
  BaseShape.prototype.physics.call(this, time)
  if (!this.isDying)
  this.rot += Math.PI / this.life * 3

  if (this.isDying) {
    this.dying -= 1
    if (this.dying <= 0) {
      this.isDead = true
    }
  } else {
    this.life -= 1
    if (this.life <= 0) {
      this.kill()
    }
  }
}

function Button(opts) {
  _.assign(this, opts)
}

Button.prototype.draw = function (ctx) {
  var scale = Math.min(WIDTH, HEIGHT)
  var sX = this.x * WIDTH
  var sY = this.y * HEIGHT
  var sW = this.width * scale
  var sH = this.height * scale

  ctx.save()
  ctx.fillStyle = this.color
  ctx.translate(sX, sY)
  ctx.fillRect(-sW/2, -sH/2, sW, sH)
  ctx.fillStyle = '#fff'
  ctx.font = scale / 30 + 'px sans'
  ctx.fillText(this.text, 0, scale / 30 / 4)
  ctx.restore()
}

var last = 0
var delta = 0
function loop(time) {
  requestAnimationFrame(loop)

  delta = time - last
  last = time

  // clear canvas
  ctx.clearRect(0, 0, canv.width, canv.height)

  if (lives.hasDied) {
    if (!buttons.length) {
      buttons.push(new Button({
        x: 0.5,
        y: 0.68,
        width: 0.3,
        height: 0.07,
        text: 'Play Again?',
        onclick: newGame,
        color: '#03a9f4'
      }))
    }
    var i = buttons.length
    while(i--) buttons[i].draw(ctx)
    var scale = Math.min(WIDTH, HEIGHT)
    ctx.fillStyle = '#fff'
    ctx.font = scale / 20 + 'px sans'
    ctx.fillText('Game Over', WIDTH / 2, HEIGHT / 2)
    score.x = 0.5
    score.y = 0.57
    score.draw(ctx)
    return
  }

  levelLoadingBar.physics(time, delta)

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
        if (!shape.isDying && JSON.stringify(shape.verticies) !==
             JSON.stringify(drain.verticies)) {
          lives.kill()
          shape.kill()
        } else if (!shape.isDying) {
          score.add(5)
          shape.kill(true)
          drain.spin()
        }
        break
      }
    }
  }

  levelLoadingBar.draw(ctx)

  // draw
  for (var i = 0, l = drains.length; i < l; i++) {
    drains[i].draw(ctx)
  }
  for (var i = 0, l = shapes.length; i < l; i++) {
    shapes[i].draw(ctx)
  }

  lives.draw(ctx)
  score.draw(ctx)
}

function levelUp() {
  level += 1
  if (levels[level])
  drains.push(levels[level].drain)
  spawner.levelUp(level)
}

newGame()

requestAnimationFrame(loop)
