const canvas = document.getElementById('audioVisualizer');
const canvasContext = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const barWidthSlider = document.getElementById('barWidthSlider');
const barSpacingSlider = document.getElementById('barSpacingSlider');
const barScaleSlider = document.getElementById('barScaleSlider');
const barColorInput = document.getElementById('barColorInput');

let audioContext;
let analyser;
let masterOfTheFeast;
const fftSizeVal = 256;
let barWidth = parseFloat(barWidthSlider.value);
let barSpacing = parseFloat(barSpacingSlider.value);
let barHeightScale = parseFloat(barScaleSlider.value);
let barColor = barColorInput.value;

barWidthSlider.addEventListener('input', updateVisualization);
barSpacingSlider.addEventListener('input', updateVisualization);
barScaleSlider.addEventListener('input', updateVisualization);
barColorInput.addEventListener('input', updateVisualization);

startButton.addEventListener("click", () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser()

        masterOfTheFeast = new Audio("/master_of_the_feast.mp3");
        audioContext.createMediaElementSource(masterOfTheFeast).connect(analyser);
        analyser.connect(audioContext.destination)

        analyser.fftSize = fftSizeVal
        const bufferLen = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLen);

        const animateVisualization = () => {
            analyser.getByteFrequencyData(dataArray);

            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            let x = 0;
            for (let i = 0; i < bufferLen; i++) {
                const barHeight = dataArray[i] / 2 * barHeightScale
                canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight)

                x += barWidth + barSpacing;

                canvasContext.fillStyle = barColor;
            }

            requestAnimationFrame(animateVisualization);
        }
        animateVisualization();
    }
    masterOfTheFeast.play();
});

pauseButton.addEventListener("click", () => {
    if (masterOfTheFeast) {
        masterOfTheFeast.pause()
    }
})

restartButton.addEventListener("click", () => {
    if (masterOfTheFeast) {
        masterOfTheFeast.currentTime = 0
        masterOfTheFeast.play()
    }
})

function updateVisualization() {
    barHeightScale = parseFloat(barScaleSlider.value);
    barWidth = parseFloat(barWidthSlider.value);
    barSpacing = parseFloat(barSpacingSlider.value);
    barColor = barColorInput.value
}
