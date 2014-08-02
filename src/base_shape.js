function BaseShape(opts) {
  opts = _.defaults(opts, {
    color: 'red',
    verticies: [],
    size: 5,
    x: 0,
    y: 0,
    lineWidth: 0.008,
    rot: 0
  })

  _.assign(this, opts)
}

BaseShape.prototype.draw = function (ctx) {
  var scale = Math.min(WIDTH, HEIGHT)
  ctx.save()
  ctx.translate(this.x * WIDTH, this.y * HEIGHT)
  ctx.rotate(this.rot)

  ctx.lineWidth = this.lineWidth * WIDTH
  ctx.strokeStyle = this.color
  ctx.moveTo(this.x, this.y)
  ctx.beginPath()

  var vert = this.verticies[0]
  var x = vert.x * this.size * scale
  var y = vert.y * this.size * scale
  ctx.moveTo(x, y)

  for (var i = 1, l = this.verticies.length; i < l + 2; i++) {
    vert = this.verticies[i % l]
    x = vert.x * this.size * scale
    y = vert.y * this.size * scale

    if (this.isDying) {
      var lastVert = this.verticies[(i - 1) % l]
      var x2 = lastVert.x * this.size * scale
      var y2 = lastVert.y * this.size * scale
      var percent = this.dying / this.deathTime
      var dist = Math.sqrt(Math.pow(x2 - x,2) + Math.pow(y2 - y, 2))
      dist *= percent
      var angle = Math.atan2(y-y2,x-x2)

      var x3 = x2 + Math.cos(angle) * dist
      var y3 = y2 + Math.sin(angle) * dist
      ctx.lineTo(x3, y3)

      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  ctx.restore()
}

BaseShape.prototype.physics = function (/* time */) {
  // noop
}

BaseShape.prototype.collide = function (obj) {
  var x = obj.x
  var y = obj.y
  var s = obj.size || 0

  var xRadius = this.size + this.lineWidth + s
  var yRadius = this.size + this.lineWidth + s

  if (Math.abs(x - this.x) < xRadius &&
      Math.abs(y - this.y) < yRadius) {
        return true
  }
  return false
}
