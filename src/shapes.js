function mirror(arr) {
  var res = arr
  var i = res.length
  while (i--) {
    res = res.concat([{x: -res[i].x, y: res[i].y}])
  }

  return res
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
