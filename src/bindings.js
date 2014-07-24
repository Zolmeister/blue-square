
function mouseDown(e) {
  draggingPos = {x: e.x / WIDTH, y: e.y / HEIGHT}
  console.log('mouse pos', draggingPos);
  for (var i = 0, l = shapes.length; i < l; i++) {
    if (!shapes[i].isDying && shapes[i].collide(draggingPos)) {
      dragging = shapes[i]
      break
    }
  }
}

function mouseUp(e) {
  dragging = null
}

function mouseMove(e) {
  if (dragging && !dragging.isDying) {
    var pos = {x: e.x / WIDTH, y: e.y / HEIGHT}
    var delta = {x: pos.x - draggingPos.x, y: pos.y - draggingPos.y}
    draggingPos = pos
    dragging.x += delta.x
    dragging.y += delta.y
  }
}

function toucher(fn) {
  return function (e) {
    var x = e.touches && e.touches[0] && e.touches[0].pageX
    var y = e.touches && e.touches[0] && e.touches[0].pageY
    fn({x: x, y: y})
  }
}

function pointer(fn) {
  return function (e) {
    fn({x: e.pageX, y: e.pageY})
  }
}

window.onmousedown = pointer(mouseDown)
window.onmouseup = pointer(mouseUp)
window.onmousemove = pointer(mouseMove)
canv.addEventListener('touchstart', toucher(mouseDown))
canv.addEventListener('touchmove', toucher(mouseMove))
canv.addEventListener('touchend', toucher(mouseUp))
