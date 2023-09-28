// public/script.js

// Get references to HTML elements
const audioElement = document.getElementById("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Create an audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create an analyser node to process audio data
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256; // Adjust as needed for visual effects

// Connect the audio element to the analyser and the audio context
const source = audioContext.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(audioContext.destination);

// Create an array to store frequency data
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// Set up the canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get references to user options
const barHeightMultiplierInput = document.getElementById("barHeightMultiplier");
const barSpacingInput = document.getElementById("barSpacing");
const colorPicker = document.getElementById("colorPicker");

// Function to update the bar color based on user choice
function updateColor() {
    const color = colorPicker.value;
    ctx.fillStyle = color;
}

// Add event listeners to user options
barHeightMultiplierInput.addEventListener("input", updateVisualizer);
barSpacingInput.addEventListener("input", updateVisualizer);
colorPicker.addEventListener("input", updateColor);

// Function to update the visualizer
function updateVisualizer() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get user-selected options
    const barHeightMultiplier = parseFloat(barHeightMultiplierInput.value);
    const barSpacing = parseFloat(barSpacingInput.value);

    // Get frequency data
    analyser.getByteFrequencyData(dataArray);

    // Customize your visualizer here
    const barCount = dataArray.length;
    const barWidth = (canvas.width - (barCount - 1) * barSpacing) / barCount;

    for (let i = 0; i < barCount; i++) {
        const barHeight = dataArray[i] * barHeightMultiplier;
        const x = i * (barWidth + barSpacing);
        const y = canvas.height - barHeight;

        // Draw a styled bar with gradient
        ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Repeat the visualization
    requestAnimationFrame(updateVisualizer);
}

// Start audio playback and visualization
audioElement.addEventListener("play", () => {
    audioContext.resume().then(() => {
        audioElement.play();
        updateVisualizer();
    });
});

// Initial update of bar color
updateColor();
