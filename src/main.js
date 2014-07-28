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
  {x: -0.9, y: -1},
  {x: 0.9, y: -1},
  {x: 0.9, y: -0.5},
  {x: -0.2, y: 0.5},
  {x: 0.9, y: 0.5},
  {x: 0.9, y: 1},
  {x: -0.9, y: 1},
  {x: -0.9, y: 0.5},
  {x: 0.2, y: -0.5},
  {x: -0.9, y: -0.5}
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

var shapeColors = [
  '#5677fc', //blue
  '#e51c23', //red
  '#259b24', //green
  '#9c27b0', //purple
  '#cddc39', //lime
  '#00bcd4', //cyan
  '#ff9800', //orange
  '#9e9e9e' //grey
  //'#e91e63', //pink
  //'#673ab7', //deep purple
  //'#3f51b5', //indigo
  //'#03a9f4', //light blue
  //'#009688', //teal
  //'#8bc34a', //light green
  //'#ffeb3b', //yellow
  //'#ffc107', //amber
  //'#ff5722', //deep orange
  //'#795548', //brown
  //'#607d8b' //blue grey
]

var drainPos = [
  [0.17, 0.27], [0.5, 0.17], [0.83, 0.27],
  [0.07, 0.5],           [0.93, 0.5],
  [0.17, 0.73], [0.5, 0.83], [0.83, 0.73]
]

var posOrder = [
  1, 6, 3, 4, 5, 2, 0, 7
]

var level = -1
var levels = []
for(var i=0;i<levelShapes.length;i++){
  levels.push({
  drain: new Drain({
    color: shapeColors[i],
    x: drainPos[posOrder[i]][0],
    y: drainPos[posOrder[i]][1],
    size: 0.04,
    verticies: levelShapes[i]
  })
})
}

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
