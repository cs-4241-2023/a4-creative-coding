const visualizationDivision = document.getElementById('visualization')
const canvas = document.createElement('canvas') //Create a Canvas HTML element in our HTML document
const audioElement = document.createElement('audio') //Create an Audio element in our HTML document

const beginAudioVisualization = function() {
    
    if(document.getElementById('canvasPresent') !== null) {
        visualizationDivision.removeChild(canvas)
    }

    if(document.getElementById('audioPresent') !== null) {
        visualizationDivision.removeChild(audioElement)
    }
    
   //Set up Canvas in HTML document
    visualizationDivision.appendChild(canvas) //Append the canvas to the HTML body
    canvas.setAttribute('id', 'canvasPresent')
    canvas.width = canvas.height = 512 //Set the canvas width and height
    const canvasRenderingContext = canvas.getContext('2d') //getContext returns an object that provides methods and properties for drawing and manipulating images and graphics on a canvas element.
                                                         //This object is the Canvas rendering context, which is stored in the variable on the left.
    //Initialize the Audio Context and Audio HTML element
    const audioContext = new AudioContext() //Create an Audio Context; an audio processing graph built from audio modules linked together.
    visualizationDivision.appendChild(audioElement) //Append the audio element to the HTML document.
    audioElement.setAttribute('id', 'audioPresent')

    //Audio Graph Setup
    const analyser = audioContext.createAnalyser() //The createAnalyser() method of the BaseAudioContext interface creates an AnalyserNode, which can be used to expose audio time and frequency data and create data visualizations.
    //ANalyser allows us to actually create the music visualization.
    analyser.fftSize = 1024 //512 bins
    //The fftSize property of the AnalyserNode interface is an unsigned long value and represents the window size in samples that is used when performing a Fast Fourier Transform (FFT) to get frequency domain data.
    const player = audioContext.createMediaElementSource(audioElement)
    //The createMediaElementSource() method of the AudioContext Interface is used to create a new MediaElementAudioSourceNode object, given an existing HTML <audio> or <video> element, the audio from which can then be played and manipulated.
 
    //The connect() method of the AudioNode interface lets you connect one of the node's outputs to a target, which may be either another AudioNode (thereby directing the sound data to the specified node) or an AudioParam, so that the node's output data is automatically used to change the value of that parameter over time.
 
    player.connect(audioContext.destination) //audioContext.destination is the parameter target here, and the destination's audio is influenced by the audio coming through the player over time.
    //The destination property of the BaseAudioContext interface returns an AudioDestinationNode representing the final destination of all audio in the context. It often represents an actual audio-rendering device such as your device's speakers.
    player.connect(analyser) //analyser is the target here, which allows the player to send audio time and frequency data to the analyser over time.

    audioElement.src = '../../SepulturaLookaway.mp3' //Set the URL of the media/music source for the HTML audio element.
    audioElement.play() //Have the HTML audio element play the audio stored at the location of the URL specified above.

    //The frequencyBinCount read-only property of the AnalyserNode interface contains the total number of data points available to AudioContext and sampleRate. 
    //We obtain the frequencyBinCount through the analyser. Use the total number of data points available to the AudioContext as the array size of the results array.
    const results = new Uint8Array(analyser.frequencyBinCount)

    draw = function() {
      //Request an animation frame for drawing for each call of the draw function as necessary.
      window.requestAnimationFrame(draw)
      
      //Fill the canvas with a black box that takes up the entire canvas width and height by default.
      //By doing the above every frame we 'clear' the canvas
      canvasRenderingContext.fillStyle = 'green' 
      canvasRenderingContext.fillRect(0, 0, canvas.width, canvas.height)
      
      //Set the color to red for drawing our visualization
      canvasRenderingContext.fillStyle = 'red' 
      
      //The getByteFrequencyData() method of the AnalyserNode interface copies the current frequency data into a Uint8Array (unsigned byte array) passed into it as a parameter.
      //The results variable is a Uint8Array as declared above, and so it gets filled with all frequency data as shown below.
      //The frequency data is composed of integers on a scale from 0 to 255.
      analyser.getByteFrequencyData(results)
      
      for(let x = 0; x < analyser.frequencyBinCount; x++ ) {
        canvasRenderingContext.fillRect(x, 0, 1, results[x]) //fillRect(x, y, width, height)
        //The above line fills rectangles upside down since the y parameter is set to 0 and results[i] moves down the canvas.
      }
    }
    draw() //Recursive function here so that the canvas drawings can keep updated with new byte frequency data as the song keeps playing at the destination.
  }

window.addEventListener('load', function() {
    document.querySelector('button').onclick = beginAudioVisualization
})
