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
