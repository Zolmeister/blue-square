function Spawner() {
  this.spawnInterval = 100000
  this.lastSpawn = -100000
}

Spawner.prototype.spawn = function (time) {
  if (time - this.lastSpawn > this.spawnInterval) {
    console.log('spawning')
    this._spawn()
    this.lastSpawn = time
  }
}

Spawner.prototype._spawn = function () {
  shapes.push(new Shape({
    color: '#c7ffc5',
    x: 0.5,
    y: 0.5,
    size: 0.03,
    verticies: [
      {x: -1, y: -1},
      {x: 1, y: -1},
      {x: 1, y: 1},
      {x: -1, y: 1}
    ]
  }))
}
