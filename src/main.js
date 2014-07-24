/* globals _ */
'use strict'
var canv = document.getElementById('canv')
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight
canv.width = WIDTH
canv.height = HEIGHT
var ctx = canv.getContext('2d')

var drains = []
var shapes = []
var spawner = new Spawner()

var dragging = null
var draggingPos = {x: 0, y:0}

function mouseDown(e) {
  draggingPos = {x: e.x / WIDTH, y: e.y / HEIGHT}
  console.log('mouse pos', draggingPos);
  for (var i = 0, l = shapes.length; i < l; i++) {
    if (!shapes[i].isDying && shapes[i].collide(draggingPos)) {
      dragging = shapes[i]
      break
    }
  }
}

function mouseUp(e) {
  dragging = null
}

function mouseMove(e) {
  if (dragging && !dragging.isDying) {
    var pos = {x: e.x / WIDTH, y: e.y / HEIGHT}
    var delta = {x: pos.x - draggingPos.x, y: pos.y - draggingPos.y}
    draggingPos = pos
    dragging.x += delta.x
    dragging.y += delta.y
  }
}

function toucher(fn) {
  return function (e) {
    var x = e.touches && e.touches[0] && e.touches[0].pageX
    var y = e.touches && e.touches[0] && e.touches[0].pageY
    fn({x: x, y: y})
  }
}

function pointer(fn) {
  return function (e) {
    fn({x: e.pageX, y: e.pageY})
  }
}

window.onmousedown = pointer(mouseDown)
window.onmouseup = pointer(mouseUp)
window.onmousemove = pointer(mouseMove)
canv.addEventListener('touchstart', toucher(mouseDown))
canv.addEventListener('touchmove', toucher(mouseMove))
canv.addEventListener('touchend', toucher(mouseUp))


function Shape(opts) {
  _.assign(this, new BaseShape(opts))
}

Shape.prototype = Object.create(BaseShape.prototype)

Shape.prototype.kill = function () {
  if (this.isDying) return

  this.isDying = true
  this.dying = 120
}

Shape.prototype.physics = function (time) {
  BaseShape.prototype.physics.call(this, time)
  if (this.isDying) {
    this.dying -= 1
    if (this.dying <= 0) {
      this.isDead = true
    }
  }
}

function Drain(opts) {
  _.assign(this, new BaseShape(opts))
}

Drain.prototype = Object.create(BaseShape.prototype)

function loop(time) {
  requestAnimationFrame(loop)

  // clear canvas
  ctx.clearRect(0, 0, canv.width, canv.height)

  // physics
  spawner.spawn(time)
  var i = drains.length;
  while (i--) {
    drains[i].physics(ctx)
  }

  var i = shapes.length
  while (i--) {
    shapes[i].physics(ctx)
    if (shapes[i].isDead) {
      shapes.splice(i, 1)
    }
  }

  var i = drains.length
  while (i--) {
    var drain = drains[i]

    var j = shapes.length
    while (j--) {
      var shape = shapes[j]

      if (shape.collide(drain)) {
        console.log('collide!')
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
}

var level = -1
var levels = [{
  drain: new Drain({
    color: '#0051ff',
    x: 0.2,
    y: 0.2,
    size: 0.05,
    verticies: [
      {x: -1, y: -1},
      {x: 1, y: -1},
      {x: 1, y: 1},
      {x: -1, y: 1}
    ]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.8,
    y: 0.8,
    size: 0.05,
    verticies: [
      {x: 0, y: -1},
      {x: 1, y: 1},
      {x: -1, y: 1}
    ]
  })
}]

function levelUp() {
  level += 1
  drains.push(levels[level].drain)
}

levelUp()
levelUp()

requestAnimationFrame(loop)
