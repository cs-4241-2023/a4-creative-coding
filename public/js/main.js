//get Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;
const BLACK = "#000";
const fftSize = 2048;
let WHITE = "#fff";
let lineWidth = 3; // inital width
let audioContext;
let analyser;
let audioElement;
let ampFactor = 1; // inital amplitude
let barAngle;
let visualColor = WHITE;
let circleRadius = Math.min(centerX, centerY) - 200;

// draw initial screen background
ctx.fillStyle = BLACK;
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//create a white circle in the center with the radius
ctx.fillStyle = WHITE;
ctx.lineWidth = lineWidth;
ctx.beginPath();
ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
ctx.fill();

//make a blakc circle slightly smaller in the center
ctx.fillStyle = BLACK;
ctx.lineWidth = lineWidth;
ctx.beginPath();
ctx.arc(centerX, centerY, circleRadius - 20, 0, 2 * Math.PI);
ctx.fill();





const error = document.getElementById("error");
const playButton = document.getElementById("playButton");
const circleSize= document.getElementById("circleRadiusSlider");
const lineThickness = document.getElementById("lineWidthSlider");
const amplitude = document.getElementById("amplitudeSlider");
const brightness = document.getElementById("colorSlider");



brightness.addEventListener("input", () => {
  const newColor = parseInt(brightness.value);
  updateBrightness(newColor);
});
amplitude.addEventListener("input", () => {
  const amplitudeFactor = parseFloat(amplitude.value);
  updateAmplitude(amplitudeFactor);
});
circleSize.addEventListener("input", () => {
  const newRadius = parseInt(circleSize.value);
  updateCircleRadius(newRadius);
});

lineThickness.addEventListener("input", () => {
  const newLineWidth = parseInt(lineThickness.value);
  updateLineWidth(newLineWidth);
});

function updateBrightness(newColor) {
  // Update the WHITE variable
  const colorValue = newColor;
  WHITE = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

}

function updateAmplitude(factor) {
  // Update the amplitude factor
  ampFactor = factor;

}

function updateCircleRadius(newRadius) {
  // Update the circle radius
  circleRadius = newRadius;

}

function updateLineWidth(newLineWidth) {
  // Update the line width 
  lineWidth = newLineWidth;

}


playButton.addEventListener('click', () => {
  if (audioContext) {
    if(audioContext.state === 'running'){
      //playing audio => pause it & set play button to say play
    audioContext.suspend().then(() => {
      playButton.textContent = "Play";
    });
  } else if (audioContext.state === 'suspended') {
    // paused audio => play it & set text to pause
    audioContext.resume().then(() => {
    playButton.textContent = "Pause";
    });
  }
}else{ // if no audio context exists create one and an anaylser 
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;

     // Path to mp3
    audioElement = new Audio('/audio/secrets.mp3');

    // connect analyser
    const audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(analyser);
    audioSource.connect(audioContext.destination);

    // try playing and set play text to pause
    audioElement.play().catch((error) => {
      console.error("Error playing audio: " + error);
    });
    playButton.textContent = "Pause";

    //render
    visualize();
  }
 }); 


function visualize() {

// Clear the canvas
ctx.fillStyle = BLACK;
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//draw white circle the size of the radius
ctx.fillStyle = WHITE;
ctx.lineWidth = lineWidth;
ctx.beginPath();
ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
ctx.fill();

//draw black circle slighty smaller
ctx.fillStyle = BLACK;
ctx.lineWidth = lineWidth;
ctx.beginPath();
ctx.arc(centerX, centerY, circleRadius - 20, 0, 2 * Math.PI);
ctx.fill();
  
// Get the frequency data from the analyser
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);

// Draw the audio visualization along the circular path
const angleIncrement = (2 * Math.PI) / bufferLength;
let angle = -Math.PI/2;
for (let i = 0; i < bufferLength; i++) {
  const amplitude = dataArray[i]/255 ;

  // Calculate the height and angle of a bar
  const barHeight = amplitude * circleRadius * ampFactor;
  const barAngle = angle + i * angleIncrement;

  // var coords starting at bottom of circle and traveling clockwise
  const barX = centerX  - circleRadius * Math.cos(barAngle);
  const barY = centerY  - circleRadius * Math.sin(barAngle);

  //bars are either white of a value from brightness slider
  ctx.fillStyle = WHITE;
  // Save the canvas state
  ctx.save();
  // Move canvas to bar position
  ctx.translate(barX, barY); 
  // Rotate canvas to bar's angle   
  ctx.rotate(barAngle); 
  // draw
  ctx.fillRect(0, 0, lineWidth, barHeight);
//returns to previous state
  ctx.restore();

  //update angle for bar
  angle += angleIncrement;
  }

  // Render
  requestAnimationFrame(visualize);
}
