let soundOn = false;
let context;
canvas = document.createElement( 'canvas' )
let ctx;
let osc;
let gainNode;
let bqFilter;
let waveShaper;
let analyser;
let results;
const waves = ["sine", "square", "triangle", "sawtooth"];
let wavePos = 0
let keyMapping = ['z', 'x', 'c', 'v', 'm', ',', '.', '/'];
let contextMade = false;
let savedSounds = []
document.getElementById("startButton").addEventListener("click", () =>{
    
    if(!soundOn){
        context = new AudioContext();
        osc = context.createOscillator()
        osc.type = 'sine';

        gainNode = context.createGain();
        gainNode.gain.value = .1;
        osc.connect(gainNode);

        bqFilter = context.createBiquadFilter();
        bqFilter.frequency.value = 110;
        gainNode.connect(bqFilter);

        waveShaper = context.createWaveShaper();
        waveShaper.curve = makeDistortionCurve(100);
        waveShaper.oversample = '4x'
        bqFilter.connect(waveShaper);
        waveShaper.connect(context.destination);
        //osc.connect( context.destination )
        osc.start( 0 )  

        analyser = context.createAnalyser()

        //analyser.fftSize = 64;

        osc.connect( analyser )

        results = new Uint8Array( analyser.frequencyBinCount )

        //you must call to start the loop
        draw(results);
    }
    else{
        osc.stop(0);
    }
    soundOn = !soundOn;
})


document.getElementById("wavetype").addEventListener("click", (e) =>{
    wavePos++
    if(osc){
        osc.type = waves[wavePos%4];
        document.getElementById("wavetype").innerText = waves[wavePos%4] + " wave";
    }
})

function makeDistortionCurve(amount) {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 2048;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
  
    for (let i = 0; i < n_samples; i++) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

document.getElementById("volumeSlider").addEventListener("input", () => {
    gainNode.gain.value = document.getElementById("volumeSlider").value/100;
})

document.getElementById("volumeSlider").addEventListener("mouseup", () => {
    console.log("Volume: " + document.getElementById("volumeSlider").value/100);
})


document.getElementById("distortionSlider").addEventListener("input", () => {
    waveShaper.curve = makeDistortionCurve(document.getElementById("distortionSlider").value/10);
})

let aMajor = [440.00, 493.88, 554.37, 587.33, 659.26, 739.99, 830.61, 880.00 ]
let aMinor = [440.00, 493.88, 523.25, 587.33, 659.26, 698.46, 783.99, 880.00 ]
let bMajor = [493.88, 523.25, 587.33, 622.25, 659.26, 739.99, 830.61, 880.00]
let bMinor = [493.88, 523.25, 554.37, 587.33, 659.26, 698.46, 739.99, 783.99]
let cMajor = [261.63, 293.66, 329.23, 349.29, 392.00, 440.00, 493.88, 523.26 ]
let cMinor = [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.26 ]
let dMajor = [293.66, 329.23, 369.29, 392.00, 440.00, 493.88, 554.37, 587.33 ]
let dMinor = [293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25, 587.33]
let eMajor = [329.63, 369.99, 415.30, 440.00, 493.88, 554.37, 622.25, 659.26]
let eMinor = [329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.26]
let fMajor = [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.26, 698.46]
let fMinor = [349.23, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33, 659.26]
let gMajor = [392.00, 440.00, 493.88, 532.25, 587.33, 659.26, 739.99, 783.99 ]
let gMinor = [392.00, 415.30, 466.16, 493.88, 523.25, 587.33, 622.25, 698.46]
let bFlat = [466.16, 523.25, 554.37, 622.25, 698.46, 739.99, 830.61, 932.33]
let eLydian = [659.26, 739.99, 830.61, 880.00, 987.77, 1108.73, 1244.51, 1318.51]
let aBlues = [440.00, 493.88, 523.25, 587.33, 659.26, 739.99, 830.61, 880.00]

let currentScale = cMajor;
let currentNoteIndex = 0;
let shift = 1;

document.addEventListener("keydown", (event) => { // Play sound on keydown binding
    if(keyMapping.includes(event.key)){
        osc.frequency.linearRampToValueAtTime(currentScale[keyMapping.indexOf(event.key)]*shift, context.currentTime+0.01) ;
        currentNoteIndex = keyMapping.indexOf(event.key);
    }
    else if(event.key == "ArrowRight"){
        keyshift(2);
    }
    else if(event.code == "ArrowLeft"){
        keyshift(.5);
    }

})

document.getElementById("submitButton").addEventListener("click", () => { // Change musical scale
    let flag = false;
    document.getElementById("errorText").value = '';
    switch(document.getElementById("scaleInput").value){
        case "A":
            currentScale = aMajor;
            break;
        case "a":
            currentScale = aMinor;
            break;
        case "B":
            currentScale = bMajor;
            break;
        case "b":
            currentScale = bMinor;
            break;
        case "C":
            currentScale = cMajor;
            break;
        case "c":
            currentScale = cMinor;
            break;
        case "D":
            currentScale = dMajor;
            break;
        case "d":
            currentScale = dMinor;
            break;
        case "E":
            currentScale = eMajor;
            break;
        case "e":
            currentScale = eMinor;
            break;
        case "F":
            currentScale = fMajor;
            break;
        case "f":
            currentScale = fMinor;
            break;
        case "G":
            currentScale = gMajor;
            break;
        case "g":
            currentScale = gMinor;
            break;
        case "bb":
            currentScale = bFlat;
            break;
        case "eL":
            currentScale = eLydian;
            break;
        case "aB":
            currentScale = aBlues;
            break;
        default:
            document.getElementById('errorText').innerText = "Sorry, we do not have that scale available";
            flag = true;
            break;
    }
    if(!flag){
       document.getElementById('currentscale').innerText = "Current Scale: " +  document.getElementById("scaleInput").value;
    }
    document.getElementById('scaleInput').value = '';
    osc.frequency.linearRampToValueAtTime(currentScale[currentNoteIndex]*shift, context.currentTime+0.01)
})

let displayType = "DM"
document.getElementById("displayType").addEventListener("click", () => { // Change canvas display type
    if(displayType === "DM"){
        displayType = "FL"
        document.getElementById("displayType").innerText = "Flatlines"
    }
    else if(displayType === "FL"){
        displayType = "DM"
        document.getElementById("displayType").innerText = "Droopy Mountain"
    }
})

document.getElementById("moreSounds").addEventListener("click", ()=> {
    document.getElementById("errorText").innerText = "";
    if(soundOn){
        let track = newContext();
        savedSounds.push(track)
        soundOn = false; 
    }
    else{
        document.getElementById("errorText").innerText = "No sounds to save"
    }
})

document.getElementById("bindingsButton").addEventListener("click", () => { // Binding button actions
    let bindings = document.getElementById("bindingsInput").value;
    let arr = bindings.split(' ');
    let error = false;
    for(let i of arr){
        if(i === ''){ // chop off trailing whitespace entries
            arr.splice(arr.indexOf(i), 1);
        }
        else if(i.length != 1){
            error = true;
        }
    }
    if(arr.length != 8){
        error = true;
    }
    if(error){
        document.getElementById("errorText").innerText = "Incorrectly formatted key bindings"
    }
    else{
        keyMapping = arr;
        let string = keyMapping.toString();
        document.getElementById("bindings").innerText = "[ " + string.replace(/,/g, ' ') + " ]"
    }
    document.getElementById("bindingsInput").value = ''
})

document.getElementById("rotationSlider").addEventListener("input", ()=>{ // Rotation Slider
    rotator = document.getElementById("rotationSlider").value/100;
})

document.getElementById('vertSlider').addEventListener("input",() => {
    vertMover = document.getElementById("vertSlider").value/10;
})

function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

let rotator = 0.5;
let vertMover =0;
draw = function() {
    // temporal recursion, call tthe function in the future
    window.requestAnimationFrame( draw )
    
    ctx.fillStyle = 'black' 
    ctx.fillRect( 0,0,canvas.width,canvas.height )
    
    const fillStyles = ['green', 'red', 'yellow', 'blue', 'orange'];
    analyser.getByteFrequencyData( results )
    compileResults()
    
    for( let i = 0; i < analyser.frequencyBinCount; i++ ) {
        if(i%(canvas.width/5) == 0){
            ctx.fillStyle = fillStyles[i/(canvas.width/5)];
        }

        if(displayType === "DM"){
            ctx.fillRect( i, canvas.height-(results[i]*vertMover)%10, 1, -results[i])
        }
        else if(displayType === "FL"){
            ctx.beginPath();
            ctx.ellipse(i, (osc.frequency.value+(results[i]*vertMover))%canvas.height, results[i]%2, results[i], Math.PI * rotator* i, 0, Math.PI, true);
            ctx.fill(); 
        }
        
    }
  }

function keyshift(number){
    shift = shift*number;
    osc.frequency.linearRampToValueAtTime(currentScale[currentNoteIndex]*shift, context.currentTime+0.01)
}

const compileResults = function(){
    for(const track of savedSounds){
        track.analyser.getByteFrequencyData(track.results)
        let tresults = track.results
        for(let i = 0; i < results.length; i++){
            results[i]+= tresults[i];
        }
    }
}

const newContext = function(){ // saves the current sound in a JSON object
    let ao = {soundOn: true}  
    ao.context = context;
    ao.osc = osc;

    ao.gainNode = gainNode
    ao.gainNode.gain.value = gainNode.gain.value;
    ao.osc.connect(ao.gainNode);

    ao.bqFilter = bqFilter;
    ao.bqFilter.frequency.value = bqFilter.frequency.value;
    ao.gainNode.connect(ao.bqFilter);

    ao.waveShaper = waveShaper;
    ao.waveShaper.curve = waveShaper.curve;
    ao.bqFilter.connect(ao.waveShaper);
    ao.waveShaper.connect(ao.context.destination);
    ao.analyser = ao.context.createAnalyser()

    //analyser.fftSize = 64;

    ao.osc.connect( ao.analyser )

    ao.results = new Uint8Array( ao.analyser.frequencyBinCount )

    return ao;
}

document.getElementById("deleteSound").addEventListener("click", ()=> {
    document.getElementById("errorText").innerText = ""
    let flag = false;
    for(let i = savedSounds.length-1; i >=0; i--){
        if(savedSounds[i].soundOn === true){
            deleteTrack(savedSounds[i])
            flag = true;
            break;
        }
    }
    if(flag === false){
        document.getElementById("errorText").innerText = "No sounds to delete"
    }
})

const deleteTrack = function(track){ // stops the specified track from playing
    track.osc.stop(0);
    track.soundOn = false;
}

window.onload = () => {
    document.body.appendChild( canvas )
    ctx = canvas.getContext('2d');
    ctx.fillRect( 0,0,canvas.width,canvas.height )
}