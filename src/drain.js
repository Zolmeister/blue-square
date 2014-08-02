function Drain(opts) {
  _.assign(this, new BaseShape(opts))

  this.spinSpeed = 20
  this.currentSpin = 0
  this.spinsLeft = 0
}

Drain.prototype = Object.create(BaseShape.prototype)

Drain.prototype.spin = function () {
  this.spinsLeft = 1
}

Drain.prototype.kill = function () {
  if (this.isDying) return
  this.isDying = true
  this.dying = this.deathTime
}

Drain.prototype.physics = function (time) {
  BaseShape.prototype.physics.call(this, time)

  if (this.spinsLeft) {
    this.rot += Math.PI / this.spinSpeed
    this.currentSpin += 1
  }

  if (this.currentSpin >= this.spinSpeed/2) {
    this.currentSpin = 0
    this.spinsLeft -= 1
  }

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
