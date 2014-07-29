function Spawner(onKill) {
  this.baseSpeed = 2000
  this.spawnInterval = this.baseSpeed
  this.lastSpawn = 0
  this.onKillCallback = onKill || _.noop
}

var maxPos = 0.72
var minPos = 0.27

Spawner.prototype.levelUp = function (level) {
  this.spawnInterval = this.baseSpeed / (Math.sqrt(Math.sqrt(level)) + 1)
}

Spawner.prototype.spawn = function (time) {
  if (time - this.lastSpawn > this.spawnInterval) {
    console.log('spawning')
    this._spawn()
    this.lastSpawn = time
  }
}

Spawner.prototype._spawn = function () {
  var self = this
  var targetDrain = _.sample(drains)

  shapes.push(new Shape({
    color: targetDrain.color,
    x: (Math.random() * (maxPos - minPos)) + minPos,
    y: (Math.random() * (maxPos - minPos)) + minPos,
    size: 0.03,
    verticies: _.cloneDeep(targetDrain.verticies),
    onKill: function () {
      self.onKillCallback()
    }
  }))
}
