import { Pane } from 'https://unpkg.com/tweakpane'


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gridWidth = canvas.width;
const gridHeight = canvas.height;
const gridCellSize = 20;
const cellCountWidth = gridWidth/20; // 50
const cellCountHeight = gridHeight/20; // 30
let BOARD = [];
let thing = 0;
const pane = new Pane();


// Draws the grid/map
function drawGrid() {
  ctx.strokeStyle = "rgb(220, 220, 220)";
  ctx.lineWidth = 1;

  // Draws the rows
  for(let i=0; i < cellCountWidth; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridCellSize, 0);
      ctx.lineTo(i * gridCellSize, gridHeight);
      ctx.stroke();
  }

  // Draws the column
  for(let i=0; i < cellCountHeight; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * gridCellSize);
      ctx.lineTo(gridWidth, i * gridCellSize);
      ctx.stroke();
  }
}


// Used to prepare the board with empty/dead cells
function init() {
  const board = [];
  for(let i=0; i < cellCountWidth; i++) {
    const row = [];
    for(let i=0;i < cellCountHeight; i++) {
      row.push(false);
    }
    board.push(row);
  }
  return board;
}

BOARD = init()



// Checks if cell is alive
// Array matrix for row and column
// True for alive : False for dead
function cellAlive(row, column) {
  if (row < 0 || row >= cellCountWidth ||
      column < 0 || column >= cellCountHeight) {
    return 0;
  }
  return BOARD[row][column] ? 1 : 0;
}
console.log(BOARD)



// Checks the number of neighbouring cells alive
function liveNeighboursCount (row, column) {
  let livingCount = 0;
  if(BOARD[row - 1]?.[column - 1]){
    livingCount++;
  }
  if(BOARD[row - 1]?.[column]){
    livingCount++;
  }
  if(BOARD[row - 1]?.[column + 1]){
    livingCount++;
  }
  if(BOARD[row][column - 1]){
    livingCount++;
  }
  if(BOARD[row][column + 1]){
    livingCount++;
  }
  if(BOARD[row + 1 ]?.[column - 1]){
    livingCount++;
  }
  if(BOARD[row + 1]?.[column]){
    livingCount++;
  }
  if(BOARD[row + 1]?.[column + 1]){
    livingCount++;
  }
  
  return livingCount;
}


// Conway's Game of Life basic rules
function rules(row, column) {
  let value = BOARD[row][column];
  if(BOARD[row][column]){
    if(liveNeighboursCount(row, column) <= 1){
      value = false;
    }
    if(liveNeighboursCount(row, column) >= 4){
      value = false;
    }
  }
  if(!BOARD[row][column]){
    if(liveNeighboursCount(row, column) === 3){
      value = true;
    }
  }
  return value;
}


// Randomizes the board
function randomBoard() {
  clearBoard();
  let board = init();
  for(let i=0; i < cellCountWidth; i++) {
    for(let j=0; j < cellCountHeight; j++) {
        if(Math.random() * 6 < 2) {
          board[i][j] = true;
        }
    }
  }
  BOARD = board;
}


// Draws the board every gameplay loop
function drawBoard() {
  for(let i=0; i < cellCountWidth; i++) {
      for(let j=0; j < cellCountHeight; j++) {
          if (cellAlive(i, j)) {
            ctx.fillStyle = "green";
          } else {
            ctx.fillStyle = "black";
          }
          ctx.fillRect(i * gridCellSize, j * gridCellSize, gridCellSize-1, gridCellSize-1);
      }
  }
}


canvas.onpointerdown = beingGod;

// Mouse to make cells alive or dead
function beingGod( event ) {
  const row = Math.floor(event.offsetX / gridCellSize);
  const column = Math.floor(event.offsetY / gridCellSize);
  BOARD[row][column] = !BOARD[row][column];
  drawBoard();
  console.log(row, column)
}

// Clears the board and makes all cells dead
function clearBoard() {
  for(let i=0; i < cellCountWidth; i++){
    for(let j=0; j < cellCountHeight; j++) {
      BOARD[i][j] = false;
    }
  }
  drawBoard();
}


// Initialize the board to have the glider
function gliderInit() {
  clearBoard();
  BOARD[2][1] = true;
  BOARD[3][2] = true;
  BOARD[3][3] = true;
  BOARD[2][3] = true;
  BOARD[1][3] = true;
  drawBoard();
}

function start() {
  clearInterval(thing);
  drawBoard()
  thing = setInterval(() => {
      let newBOARD = init();
      for(let row=0; row < cellCountWidth; row++) {
        for(let column=0; column < cellCountHeight; column++){
          newBOARD[row][column] = rules(row, column);
        }
      }
      BOARD = newBOARD
      drawBoard();
  }, speed.value)
}



drawGrid();

const startBtn = pane.addButton({title: 'Start'});
startBtn.on('click', () => {
  start();
})

const randomBtn = pane.addButton({title: 'Random Board'});
randomBtn.on('click', () => {
  randomBoard();
  start();
})

const pauseBtn = pane.addButton({title: 'Pause'});
pauseBtn.on('click', () => {
    clearInterval(thing);
});


const speed = pane.addBlade({
  view: 'slider',
  label: 'Speed',
  min: 1,
  max: 1000,
  value: 100
});
speed.on('change', start);


const gliderBtn = pane.addButton({title: 'Glider'});
gliderBtn.on('click', () =>{
  gliderInit();
})


const clearBtn = pane.addButton({title : 'Clear Board'});
clearBtn.on('click', () => {
  clearBoard();
})


