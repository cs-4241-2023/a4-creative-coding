canvasBoard = document.getElementById('canvas')
canvasBoard.innerHTML = ''
canvas = document.createElement( 'canvas' )
canvasBoard.appendChild(canvas)

// const panzoom = Panzoom(canvas, {
//   maxScale: 5
// })
// panzoom.pan(10, 10)
// panzoom.zoom(2, { animate: true })
// canvas.parentElement.addEventListener('wheel', () => zooming ? panzoom.zoomWithWheel() : 0)

grid = []
controls = {}
play = true
panning = false
zooming = false
click_x = null
click_y = null

SQUARE_SIZE = 20
MARGIN = 2
CONTROL_HEIGHT = 100
BOARD_SIZE = 5
LIGHT_BACKGROUND_COLOR = `rgb(220, 220, 220)`
DARK_BACKGROUND_COLOR = 'grey'
CLICK_COLOR = 'purple'
LIVE_COLOR = 'green'
BUTTON_BASE_COLOR = 'blue'
BUTTON_FONT_COLOR = 'yellow'

canvas.width = SQUARE_SIZE * BOARD_SIZE + MARGIN * (BOARD_SIZE + 1)
canvas.height =  SQUARE_SIZE * BOARD_SIZE + MARGIN * (BOARD_SIZE+1)
ctx = canvas.getContext( '2d' )

function Square(x, y, alive) {
  this.x = x
  this.y = y
  this.draw_x = x * SQUARE_SIZE + (x+1) * MARGIN
  this.draw_y = y * SQUARE_SIZE + (y+1) * MARGIN
  this.alive = alive

  this.draw = () => {
    ctx.fillStyle = this.alive ? LIVE_COLOR : LIGHT_BACKGROUND_COLOR
    ctx.fillRect(this.draw_x, this.draw_y, SQUARE_SIZE, SQUARE_SIZE)
  }

  this.clicked = (mouse_x, mouse_y) => {
    // check if clicked on
    if(mouse_x <= this.draw_x + SQUARE_SIZE && mouse_x >= this.draw_x &&
      mouse_y <= this.draw_y + SQUARE_SIZE && mouse_y >= this.draw_y) {
        // update live status
        this.alive = !this.alive
        this.draw()
    }
  }

  this.die = () => {
    this.alive = false
    this.draw()
  }

  this.living = () => {}
  this.dead = () => {}

  this.born = () => {
    this.alive = true
    this.draw()
  }

  this.countNeighbors = () => {
    count = 0
    x_max = grid.length
    y_max = grid[0].length
    if((this.x + 1) < x_max) { // check right column
      count += grid[this.x + 1][this.y].alive ? 1 : 0 // right
      if((this.y + 1) < y_max) { // check row below
        count += grid[this.x + 1][this.y + 1].alive ? 1 : 0 // right
      }
      if((this.y - 1) >= 0) { // check row above
        count += grid[this.x + 1][this.y - 1].alive ? 1 : 0 // right
      }
    }
    if((this.x - 1) >= 0) { // check left column
      count += grid[this.x - 1][this.y].alive ? 1 : 0 // right
      if((this.y + 1) < y_max) { // check row below
        count += grid[this.x - 1][this.y + 1].alive ? 1 : 0 // right
      }
      if((this.y - 1) >= 0) { // check row above
        count += grid[this.x - 1][this.y - 1].alive ? 1 : 0 // right
      }
    }
    if((this.y + 1) < y_max) { // check center bottom
      count += grid[this.x][this.y + 1].alive ? 1 : 0
    }
    if((this.y - 1) >= 0) { // check center top
      count += grid[this.x][this.y - 1].alive ? 1 : 0
    }

    return count
  }

  this.getNextAction = () => {
    // check number of neighbors
    neighbors = this.countNeighbors();
    if(this.alive) {
      if(neighbors <= 1) {
        return this.die
      } else if(neighbors  >= 4) {
        return this.die
      } else {
        return this.living
      }
    } else {
      if(neighbors === 3) {
        return this.born
      } else {
        return this.dead
      }
    }
    
  }
}

function createGrid() {
  arr = []
  for(x = 0; x < BOARD_SIZE*2; x++) {
    arr[x] = []
    for(y = 0; y < BOARD_SIZE; y++) {
      z = new Square(x, y, false)
      z.draw()
      arr[x][y] = z
    }
  }

  return arr;
}

function drawBackground() {
  ctx.fillStyle = DARK_BACKGROUND_COLOR 
  ctx.fillRect( 0,0,canvas.width,canvas.height/*-CONTROL_HEIGHT*/ )
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

mousePressed = false

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return [x, y]
}

mouseListener = (e) => {
  [x, y] = getCursorPosition(e)
  if(panning) {
    grid = grid.map(row => row.map( square => {
      trans_x = x - click_x;
      trans_y = x - click_y;

      temp = new Square(square.x, square.y, square.alive) 
      temp.draw_x = square.draw_x + trans_x
      temp.draw_y = square.draw_y + trans_y
    }))
    
  } else {
    grid.map(row => row.map(val => val.clicked(x, y)))
  }
}

canvas.addEventListener('mousedown', (e) => {
  mousePressed = true
  if(panning) {
    click_x = x
    click_y = y
  }
  mouseListener(e)
})

canvas.addEventListener('mousemove',  (e) => {
  if(mousePressed) {
    mouseListener(e)
  }
})

canvas.addEventListener('mouseup',  (e) => {
  mousePressed = false
  if(panning) {
    click_x = 0
    click_y = 0
  }
})

// initialize buttons
document.getElementById('pause').onclick = () => {
  play = !play
  if(play) {
    document.getElementById('pause').innerHTML = 'Play'
  } else {
    document.getElementById('pause').innerHTML = 'Pause'
  }
}
document.getElementById('panning').onclick = () => {
  panning = !panning
  if(panning) {
    document.getElementById('panning').innerHTML = 'Panning On'
  } else {
    document.getElementById('panning').innerHTML = 'Panning Off'
  }
}
document.getElementById('zoom').onclick = () => {
  zooming = !zooming
  if(zooming) {
    document.getElementById('zoom').innerHTML = 'Zoom On'
  } else {
    document.getElementById('zoom').innerHTML = 'Zoom Off'
  }
}

// create the grid squares
grid = createGrid()
// createControls();

// draw everything
drawBackground()
grid.map(row => row.map(val => val.draw()))

update = async function() {

  // delay
  await delay(1000).then()

  // temporal recursion, call the function in the future
  window.requestAnimationFrame( update )

  if(play) { // if game is not paused
    updates = []
    for(x = 0; x < grid.length; x++) {
      updates[x]  = []
      for(y = 0; y < grid[x].length; y++) {
        updates[x][y] = grid[x][y].getNextAction()
      }
    }
  
    updates.map(row => row.map(action => action()))
  } else {
    grid.map(row => row.map(square => square.draw()))
  }
}

update()