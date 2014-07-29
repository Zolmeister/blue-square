function Spawner() {
  this.spawnInterval = 100000
  this.lastSpawn = -100000
}

var maxPos = 0.72
var minPos = 0.27

Spawner.prototype.spawn = function (time) {
  if (time - this.lastSpawn > this.spawnInterval) {
    console.log('spawning')
    this._spawn()
    this.lastSpawn = time
  }
}

Spawner.prototype._spawn = function () {
  var targetDrain = _.sample(drains)

  shapes.push(new Shape({
    color: targetDrain.color,
    x: (Math.random() * (maxPos - minPos)) + minPos,
    y: (Math.random() * (maxPos - minPos)) + minPos,
    size: 0.03,
    verticies: _.cloneDeep(targetDrain.verticies)
  }))
}
