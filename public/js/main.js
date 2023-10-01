import {Pane} from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.1/dist/tweakpane.min.js'

class GridManager {
	static _cellsX = 80
	static _cellsY = 45

	#cellGrid
	constructor() {
		this.#cellGrid = JSON.parse(JSON.stringify(Array(GridManager._cellsX).fill(Array(GridManager._cellsY).fill(false))))
	}

	getGridState() {
		// return deep clone of grid
		return JSON.parse(JSON.stringify(this.#cellGrid))
	}

	/**
	* @param {Array} newGrid
	*/
	set cellGrid(newGrid) {
		if(Array.isArray(newGrid)) {
			this.#cellGrid = newGrid
		}

		paintCells()
	}

	setCell(x, y, state) {
		this.#cellGrid[x][y] = state
		paintCells()
	}

	getCell(x, y) {
		return this.#cellGrid[x]?.[y]
	}

	clearGrid() {
		this.#cellGrid.forEach(arr => arr.fill(false))
		paintCells()
	}
}


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
let gridManager = new GridManager()

// Monitored parameters in Tweakpane
const GENERAL_PARAMS = {
	'Time Step': 100
}

const SURVIVE_PARAMS = {
	0: false,
	1: false,
	2: true,
	3: true,
	4: false,
	5: false,
	6: false,
	7: false,
	8: false
}

const BORN_PARAMS = {
	0: false,
	1: false,
	2: false,
	3: true,
	4: false,
	5: false,
	6: false,
	7: false,
	8: false
}

let canvas = undefined
let ctx = undefined
let stepInterval = undefined
window.onload = function() {
	canvas = document.getElementById('myCanvas')
	ctx = canvas.getContext('2d')
	ctx.fillStyle = _canvasBackground
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	canvas.onpointerdown = dragStart
	canvas.onpointermove = drag
	canvas.onpointerup = dragEnd

	paintCells()

	const pane = new Pane({container: document.getElementById('optionsDiv')})
	pane.registerPlugin(TweakpaneInfodumpPlugin)

	let infoFolder = pane.addFolder({
		title: 'Information',
		expanded: true
	})

	infoFolder.addBlade({
		view: "infodump",
		content: `This is an implementation of Conway's Game of Life. There are various ways to interact with and impact the game.
		By clicking and dragging on the canvas, you are able to enable or disable cells within the grid. You can use this to create\
		any shape you want and see how it develops as time moves along.
			
		Under the 'General' tab, you have access to the time controls for the game, allowing you start and stop the simulation\
		as well as change the simulation speed.
		
		Under the 'Rules: Survival' tab are able to select what number of enabled neighbors a cell is able to have and\
		still remain enabled itself. By default both 2 and 3 neighbors are allowed.
		
		Under the 'Rules: Generation' tab you are able to select what number of enabled neighbors a cell is able to have that\
		will enable it from a disabled state. By default only 3 neighbors is selected.`,
		border: false,
		markdown: true,
	})

	let generalFolder = pane.addFolder({
		title: 'General',
		expanded: false
	})

	generalFolder.addButton({title: 'Fill Random'}).on('click', randomFill)
	generalFolder.addButton({title: 'Clear Grid'}).on('click', clearGrid)
	
	generalFolder.addBlade({view: 'separator'})
	
	generalFolder.addButton({title: 'Play/Pause'}).on('click', toggleTime)
	generalFolder.addButton({title: 'Step'}).on('click', nextState)
	const timeBinding = generalFolder.addBinding(GENERAL_PARAMS, 'Time Step', {label: 'Simulation Speed (ms)', min: 1, max: 1000, step: 1})
	timeBinding.on('change', function(ev) {
		if(ev.last) {
			toggleTime()
			toggleTime()
		}
	})



	let surviveFolder = pane.addFolder({
		title: 'Rule: Survival',
		expanded: false
	})

	surviveFolder.addBinding(SURVIVE_PARAMS, '1', {label: '1 Neighbor'})
	surviveFolder.addBinding(SURVIVE_PARAMS, '2', {label: '2 Neighbors'})
	surviveFolder.addBinding(SURVIVE_PARAMS, '3', {label: '3 Neighbors'})
	surviveFolder.addBinding(SURVIVE_PARAMS, '4', {label: '4 Neighbors'})
	surviveFolder.addBinding(SURVIVE_PARAMS, '5', {label: '5 Neighbors'})
	surviveFolder.addBinding(SURVIVE_PARAMS, '6', {label: '6 Neighbors'})
	surviveFolder.addBinding(SURVIVE_PARAMS, '7', {label: '7 Neighbors'})
	surviveFolder.addBinding(SURVIVE_PARAMS, '8', {label: '8 Neighbors'})
	

	let bornFolder = pane.addFolder({
		title: 'Rule: Generation',
		expanded: false
	})

	bornFolder.addBinding(BORN_PARAMS, '1', {label: '1 Neighbor'})
	bornFolder.addBinding(BORN_PARAMS, '2', {label: '2 Neighbors'})
	bornFolder.addBinding(BORN_PARAMS, '3', {label: '3 Neighbors'})
	bornFolder.addBinding(BORN_PARAMS, '4', {label: '4 Neighbors'})
	bornFolder.addBinding(BORN_PARAMS, '5', {label: '5 Neighbors'})
	bornFolder.addBinding(BORN_PARAMS, '6', {label: '6 Neighbors'})
	bornFolder.addBinding(BORN_PARAMS, '7', {label: '7 Neighbors'})
	bornFolder.addBinding(BORN_PARAMS, '8', {label: '8 Neighbors'})
}

const paintCells = function() {
	let cells = gridManager.getGridState()

	for(let x = 0; x < cells.length; x++) {
		for(let y = 0; y < cells[0].length; y++) {
			ctx.fillStyle = cells[x][y] ? _canvasCellOn : _canvasCellOff
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
	gridManager.cellGrid = gridManager.getGridState().map(i => i.map(() => Math.random() > 0.5))
}

const clearGrid = function() {
	gridManager.clearGrid()
}

const nextState = function() {
	let cells = gridManager.getGridState()
	let newGrid = gridManager.getGridState()

	for(let x = 0; x < cells.length; x++) {
		for(let y = 0; y < cells[0].length; y++) {
			let neighbors = calculateNeighbors(x, y, cells)

			if(cells[x][y]) { // current cell is alive
				newGrid[x][y] = SURVIVE_PARAMS[neighbors]
			} else { // current cell is dead
				newGrid[x][y] = BORN_PARAMS[neighbors]
			}

			// current cell remains as is
		}
	}

	gridManager.cellGrid = newGrid
}

const calculateNeighbors = function(x, y, gridReference) {
	let neighbors = 0

	neighbors += gridReference[x-1]?.[y-1] ? 1 : 0
	neighbors += gridReference[x-1]?.[y] ? 1 : 0
	neighbors += gridReference[x-1]?.[y+1] ? 1 : 0
	
	neighbors += gridReference[x]?.[y-1] ? 1 : 0
	neighbors += gridReference[x]?.[y+1] ? 1 : 0

	neighbors += gridReference[x+1]?.[y-1] ? 1 : 0
	neighbors += gridReference[x+1]?.[y] ? 1 : 0
	neighbors += gridReference[x+1]?.[y+1] ? 1 : 0

	return neighbors
}

const toggleTime = function() {
	if(stepInterval) {
		clearInterval(stepInterval)
		stepInterval = undefined
	} else {
		stepInterval = setInterval(nextState, GENERAL_PARAMS['Time Step'])
	}
}


const coordToGrid = function(coordX, coordY) {
	return [Math.floor(coordX/_gridSize), Math.floor(coordY/_gridSize)]
}

let fillType = undefined
const dragStart = function(event) {
	let [x, y] = coordToGrid(event.offsetX, event.offsetY)

	const cellValue = gridManager.getCell(x, y)
	if(cellValue !== undefined) {
		fillType = !cellValue
		gridManager.setCell(x, y, fillType)
	}
}

const drag = function(event) {
	let [x, y] = coordToGrid(event.offsetX, event.offsetY)

	if((x >= 0) && (y >= 0) && (fillType !== undefined)) {
		gridManager.setCell(x, y, fillType)
	}
}

const dragEnd = function(event) {
	fillType = undefined
}
