/* globals _ */
'use strict'
var canv = document.getElementById('canv')
canv.width = WIDTH
canv.height = HEIGHT
var ctx = canv.getContext('2d')

var drains = []
var shapes = []
var spawner = new Spawner()
var lives = new Lives()

var dragging = null
var draggingPos = {x: 0, y:0}

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
  this.rot += Math.PI / 500

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

  lives.draw(ctx)
}

var square = mirror([
      {x: -1, y: -1},
      {x: 1, y: -1},
      {x: 1, y: 1},
      {x: -1, y: 1}
    ])
var triangle = [
      {x: 0, y: -1},
      {x: 1, y: 1},
      {x: -1, y: 1}
    ]
var star = mirror([
      {x: 0, y: -1},
      {x: 0.3, y: -0.3},
      {x: 1, y: -0.3},
      {x: 0.5, y: 0.2},
      {x: 0.7, y: 0.9},
      {x: 0, y: 0.5}
    ])

var hexagon = mirror([
  {x: 0.5, y: -1},
  {x: 1, y: -0.34},
  {x: 1, y: 0.34},
  {x: 0.5, y: 1}
])

var plus = mirror([
  {x: 0.3, y: -1},
  {x: 0.3, y: -0.3},
  {x: 1, y: -0.3},
  {x: 1, y: 0.3},
  {x: 0.3, y: 0.3},
  {x: 0.3, y: 1}
  ])

var Z = [
  {x: -1, y: -1},
  {x: 1, y: -1},
  {x: 1, y: -0.5},
  {x: -0.3, y: 0.5},
  {x: 1, y: 0.5},
  {x: 1, y: 1},
  {x: -1, y: 1},
  {x: -1, y: 0.5},
  {x: 0.3, y: -0.5},
  {x: -1, y: -0.5}
]

var odd1 = mirror([
  {x: 0, y: 0.2},
  {x: 0.2, y: 0.6},
  {x: 0, y: -1},
  {x: 0.8, y: -0.6},
  {x: 0.9, y: 1},
  {x: 0.5, y: -0.5},
  {x: 0, y: 0.5},
  ])

var odd2 = mirror([
  {x: 0, y: -0.3},
  {x: 0.7, y: -1},
  {x: 0.7, y: 0},
  {x: 0.2, y: -0.5},
  {x: 1, y: -0.7},
  {x: 0.25, y: 0.2},
  {x: 1, y: 1},
  {x: 1, y: 0.2},
  {x: 0.25, y: 1}
  ])

var levelShapes = [
  square,
  triangle,
  hexagon,
  plus,
  star,
  odd1,
  odd2,
  Z
]

var level = -1
var levels = [{
  drain: new Drain({
    color: '#0051ff',
    x: 0.2,
    y: 0.2,
    size: 0.05,
    verticies: levelShapes[0]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.8,
    y: 0.8,
    size: 0.05,
    verticies: levelShapes[1]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.8,
    y: 0.5,
    size: 0.05,
    verticies: levelShapes[2]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.2,
    y: 0.5,
    size: 0.05,
    verticies: levelShapes[3]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.2,
    y: 0.8,
    size: 0.05,
    verticies: levelShapes[4]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.5,
    y: 0.8,
    size: 0.05,
    verticies: levelShapes[5]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.5,
    y: 0.2,
    size: 0.05,
    verticies: levelShapes[6]
  })
}, {
  drain: new Drain({
    color: '#00ff04',
    x: 0.8,
    y: 0.2,
    size: 0.05,
    verticies: levelShapes[7]
  })
}]

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
