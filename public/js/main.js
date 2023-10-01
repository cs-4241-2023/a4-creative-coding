// unit are in pixels
const _cellPadding = 1
const _gridSize = 10
const _cellSize = _gridSize - 2*_cellPadding

const _canvasBackground = '#000'
const _canvasCellOff = '#646464'
const _canvasCellOn = '#fff'

// Holds boolean values for cell states:
// true = On
// false = Off
const _cellsX = 80
const _cellsY = 45
let cellGrid = Array(_cellsX).fill(Array(_cellsY).fill(false))
let timeStep = 300

let canvas = undefined
let ctx = undefined
let stepInterval = undefined
window.onload = function() {
	canvas = document.getElementById('myCanvas')
	ctx = canvas.getContext('2d')
	ctx.fillStyle = _canvasBackground
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	randomFill()
	//stepInterval = setInterval(nextState, timeStep)

	document.getElementById('play').onclick = startTime
}

const paintCells = function() {
	for(let x = 0; x < cellGrid.length; x++) {
		for(let y = 0; y < cellGrid[0].length; y++) {
			ctx.fillStyle = cellGrid[x][y] ? _canvasCellOn : _canvasCellOff
			ctx.fillRect(
				(x * _gridSize) + _cellPadding,
				(y * _gridSize) + _cellPadding,
				_cellSize,
				_cellSize
			)
			ctx.fill()
		}
	}
}

const randomFill = function() {
	cellGrid = cellGrid.map(i => i.map(() => Math.round(Math.random())))
	paintCells()
}

const nextState = function() {
	let newGrid = JSON.parse(JSON.stringify(cellGrid)) // makes deep clone of current grid

	for(let x = 0; x < cellGrid.length; x++) {
		for(let y = 0; y < cellGrid[0].length; y++) {
			let neighbors = calculateNeighbors(x, y)

			if((neighbors < 2) || (neighbors >= 4)) { // current cell certantly dead
				newGrid[x][y] = false
			} else if(neighbors === 3) { // current cell certaintly alive
				newGrid[x][y] = true
			}

			// current cell remains as is
		}
	}

	cellGrid = newGrid
	paintCells()
}

const calculateNeighbors = function(x, y) {
	let neighbors = 0

	neighbors += cellGrid[x-1]?.[y-1] ? 1 : 0
	neighbors += cellGrid[x-1]?.[y] ? 1 : 0
	neighbors += cellGrid[x-1]?.[y+1] ? 1 : 0
	
	neighbors += cellGrid[x]?.[y-1] ? 1 : 0
	neighbors += cellGrid[x]?.[y+1] ? 1 : 0

	neighbors += cellGrid[x+1]?.[y-1] ? 1 : 0
	neighbors += cellGrid[x+1]?.[y] ? 1 : 0
	neighbors += cellGrid[x+1]?.[y+1] ? 1 : 0

	return neighbors
}


const startTime = function(button) {
	stepInterval = setInterval(nextState, timeStep)
	this.onclick = stopTime
	this.textContent = 'Pause'
}

const stopTime = function(button) {
	clearInterval(stepInterval)
	this.onclick = startTime
	this.textContent = 'Play'
}