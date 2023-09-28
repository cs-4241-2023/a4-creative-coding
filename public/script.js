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

// Function to update the visualizer
function updateVisualizer() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get frequency data
    analyser.getByteFrequencyData(dataArray);

    // Customize your visualizer here
    // For example, draw bars based on frequency data
    const barWidth = (canvas.width / dataArray.length) * 1.5; // Adjust for spacing
    const barSpacing = 5;
    const barHeightMultiplier = 2; // Adjust for visual effect
    const barColor = "#ff5733"; // Bar color

    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = dataArray[i] * barHeightMultiplier;
        const x = i * (barWidth + barSpacing);
        const y = canvas.height - barHeight;

        // Draw a bar
        ctx.fillStyle = barColor;
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
