
function mouseDown(e) {
  var x = e.x / WIDTH
  var y = e.y / HEIGHT

  draggingPos = {x: x, y: y}
  console.log('mouse pos', draggingPos);
  var i = shapes.length
  while (i--) {
    if (!shapes[i].isDying && shapes[i].collide(draggingPos)) {
      dragging = shapes[i]
      break
    }
  }

  i = buttons.length

  while (i--) {
    var button = buttons[i]
    if (!(x>button.x + button.width/2 || x<button.x - button.width/2 || y>button.y+button.height/2 || y<button.y-button.height/2)) {
      button.onclick()
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
