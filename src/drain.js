function Drain(opts) {
  _.assign(this, new BaseShape(opts))
}

Drain.prototype = Object.create(BaseShape.prototype)
