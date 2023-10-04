const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let penColor = 'black'; // Default pen color
let penSize = 1; // Default pen size
const drawingActions = [];
let currentActionIndex = -1;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.lineWidth = penSize; 
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    context.strokeStyle = penColor; 
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    context.closePath();
  
    // Save the drawing action for undoAction()
    saveDrawingAction();
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    context.closePath();
});

function changePenColor(color) {
    penColor = color;
}

function changePenSize(size) {
    penSize = size;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function undoAction() {
    if (currentActionIndex >= 0) {
        drawingActions.pop(); 
        currentActionIndex--;
        clearCanvas();
        redrawDrawing();
    }
}

// Saves each drawing action to help undoAction function
function saveDrawingAction() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const action = { color: penColor, size: penSize, imageData };
    drawingActions.push(action);
    currentActionIndex = drawingActions.length - 1;
}

// Redoes list of drawing actions to help undoAction function
function redrawDrawing() {
    clearCanvas();
    for (let i = 0; i <= currentActionIndex; i++) {
        const action = drawingActions[i];
        context.strokeStyle = action.color;
        context.lineWidth = action.size;
        context.putImageData(action.imageData, 0, 0);
    }
}

function rotateCanvas() {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.height;
    newCanvas.height = canvas.width;
    const newContext = newCanvas.getContext('2d');

    newContext.translate(newCanvas.width / 2, newCanvas.height / 2);
    newContext.rotate(Math.PI / 2);
    newContext.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    canvas.width = newCanvas.width;
    canvas.height = newCanvas.height;
    context.drawImage(newCanvas, 0, 0);
}

