canvasBoard = document.getElementById('canvas')

grid = []
controls = {}
play = true
mousePressed = false
random_color = false

SQUARE_SIZE = 7
MARGIN = 2
CONTROL_HEIGHT = 100
BOARD_SIZE = 20
LIGHT_BACKGROUND_COLOR = `rgb(220, 220, 220)`
DARK_BACKGROUND_COLOR = 'grey'
LIVE_COLOR = '#008000'
EVOLVE_TIME = 1000


function init() {
  canvasBoard.innerHTML = ''
  canvas = document.createElement( 'canvas' )
  canvas.syle = "text-align: center;"
  canvasBoard.appendChild(canvas)
  ctx = canvas.getContext( '2d' )
  canvas.width = SQUARE_SIZE * BOARD_SIZE + (MARGIN * (parseInt(BOARD_SIZE) + 1))
  canvas.height =  SQUARE_SIZE * BOARD_SIZE + (MARGIN * (parseInt(BOARD_SIZE) + 1))
  grid = createGrid()
  drawBackground()
  grid.map(row => row.map(val => val.draw()))
}

const genRandHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function Square(x, y, alive) {
  this.x = x
  this.y = y
  this.draw_x = x * SQUARE_SIZE + (x+1) * MARGIN
  this.draw_y = y * SQUARE_SIZE + (y+1) * MARGIN
  this.alive = alive

  this.draw = () => {
    ctx.fillStyle = this.alive ? (random_color ? '#' + genRandHex(6) : LIVE_COLOR) : LIGHT_BACKGROUND_COLOR
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
  for(x = 0; x < BOARD_SIZE; x++) {
    arr[x] = []
    for(y = 0; y < BOARD_SIZE; y++) {
      alive = false
      if(grid.length > x && grid[0].length > y) {
        alive = grid[x][y].alive
      }
      z = new Square(x, y, alive)
      z.draw()
      arr[x][y] = z
    }
  }

  return arr;
}

function drawBackground() {
  ctx.fillStyle = DARK_BACKGROUND_COLOR 
  ctx.fillRect( 0,0,canvas.width,canvas.height )
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return [x, y]
}

mouseListener = (e) => {
  [x, y] = getCursorPosition(e)
  grid.map(row => row.map(val => val.clicked(x, y)))
}

canvas.addEventListener('mousedown', (e) => {
  mousePressed = true
  mouseListener(e)
})

canvas.addEventListener('mousemove',  (e) => {
  if(mousePressed) {
    mouseListener(e)
  }
})

canvas.addEventListener('mouseup',  (e) => {
  mousePressed = false
})

// initialize buttons

// pause button
pause = document.getElementById('pause')
pause.onclick = () => {
  play = !play
  if(play) {
    pause.innerHTML = 'Pause'
  } else {
    pause.innerHTML = 'Play'
  }
}
if(play) {
  pause.innerHTML = 'Pause'
} else {
  pause.innerHTML = 'Play'
}

// color picker
color_picker = document.getElementById('color-picker')
color_picker.value = LIVE_COLOR
color_picker.addEventListener('change', () => {
  LIVE_COLOR = color_picker.value
  grid.map(row => row.map(square => square.draw()))
}, false)

color_rand = document.getElementById('random-color')
color_rand.value = random_color
color_rand.addEventListener('change', () => {
  if(color_rand.checked) {
    random_color = true
  } else {
    random_color = false
    grid.map(row => row.map(square => square.draw()))
  }
})

// size of board slider
size_display = document.getElementById('size-display')
size_display.innerHTML = BOARD_SIZE
size_slider = document.getElementById('board-size')
size_slider.value = BOARD_SIZE
size_slider.addEventListener('change', () => {
  if(parseInt(size_slider.value) < parseInt(BOARD_SIZE)) {
    console.log(size_slider.value + " " + BOARD_SIZE)
    if(confirm(`Are you sure you want to resize the board to ${size_slider.value}?\n\n Data may be lost`)) {
      BOARD_SIZE = size_slider.value
      size_display.innerHTML = BOARD_SIZE
      init()
    } else {
      size_slider.value = BOARD_SIZE
    }
  } else {
    BOARD_SIZE = size_slider.value
    size_display.innerHTML = BOARD_SIZE
    init()
  } 
}, false)

// time between evolutions
time_display = document.getElementById('time-display')
time_display.innerHTML = EVOLVE_TIME
time_slider = document.getElementById('time-slider')
time_slider.value = EVOLVE_TIME
time_slider.addEventListener('change', () => {
  EVOLVE_TIME = time_slider.value
  time_display.innerHTML = EVOLVE_TIME
}, false)

init()

update = async function() {

  // delay
  await delay(EVOLVE_TIME).then()

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