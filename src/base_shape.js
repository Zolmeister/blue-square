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
  for (var i = 0, l = this.verticies.length; i < l + 2; i++) {
    var vert = this.verticies[i % l]
    ctx.lineTo(vert.x * this.size * scale, vert.y * this.size * scale)
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
