const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//2 octaves?
const scales = [
    [220.00, 246.94, 277.18, 293.66, 329.63, 369.99, 415.30, 440.00, 493.88, 554.37, 587.33, 659.25, 739.99, 830.61, 880.00], //A major
    [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00], //A minor
    [246.94, 277.18, 311.13, 329.63, 369.99, 415.30, 466.16, 493.88, 554.37, 622.25, 659.25, 739.99, 830.61, 932.33, 987.77], //B major
    [246.94, 277.18, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77], //B minor
    [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50], // C major
    [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25, 587.33, 622.25, 698.46, 783.99, 830.61, 932.33, 1046.50], // C minor
    [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77, 1108.73, 1174.66], //D major
    [293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 932.33, 1046.50, 1174.66], //D minor
    [164.81, 185.00, 207.65, 220.00, 246.94, 277.18, 311.13, 329.63, 369.99, 415.30, 440.00, 493.88, 554.37, 622.25, 659.25], //E major
    [164.81, 185.00, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25], //E minor
    [174.61, 196.00, 220.00, 233.08, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.25, 698.46], //F major
    [174.61, 196.00, 207.65, 233.08, 261.63, 277.18, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25, 554.37, 622.25, 698.46], //F minor
    [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99], //G major
    [196.00, 220.00, 233.08, 261.63, 293.66, 311.13, 349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 622.25, 698.46, 783.99]  //G minor
    ];

const scalesLetters = [
    ["A", "B", "C#", "D", "E", "F#", "G#", "A", "B", "C#", "D", "E", "F#", "G#", "A"], //A major
    ["A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A"], //A minor
    ["B", "C#", "D#", "E", "F#", "G#", "A#", "B", "C#", "D#", "E", "F#", "G#", "A#", "B"], //B major
    ["B", "C#", "D", "E", "F#", "G", "A", "B", "C#", "D", "E", "F#", "G", "A", "B"], //B minor
    ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C"], // C major
    ["C", "D", "Eb", "F", "G", "Ab", "Bb", "C", "D", "Eb", "F", "G", "Ab", "Bb", "C"], // C minor
    ["D", "E", "F#", "G", "A", "B", "C#", "D", "E", "F#", "G", "A", "B", "C#", "D"], //D major
    ["D", "E", "F", "G", "A", "Bb", "C", "D", "E", "F", "G", "A", "Bb", "C", "D"], //D minor
    ["E", "F#", "G#", "A", "B", "C#", "D#", "E", "F#", "G#", "A", "B", "C#", "D#", "E"], //E major
    ["E", "F#", "G", "A", "B", "C", "D", "E", "F#", "G", "A", "B", "C", "D", "E"], //E minor
    ["F", "G", "A", "Bb", "C", "D", "E", "F", "G", "A", "Bb", "C", "D", "E", "F"], //F major
    ["F", "G", "Ab", "Bb", "C", "Db", "Eb", "F", "G", "Ab", "Bb", "C", "Db", "Eb", "F"], //F minor
    ["G", "A", "B", "C", "D", "E", "F#", "G", "A", "B", "C", "D", "E", "F#", "G"], //G major
    ["G", "A", "Bb", "C", "D", "Eb", "F", "G", "A", "Bb", "C", "D", "Eb", "F", "G"]  //G minor
    ];

const ball = {
    x: 100,
    y: 100,
    vx: 5,
    vy: 1,
    radius: 20,
    color: "#348feb",
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  };

function clear() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    if (scale === -1) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else {
        for (let i = 0; i < 15; i = i+2) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.fillRect(0, i*(canvas.height/15), canvas.width, canvas.height/15);
            ctx.fillStyle = "rgba(238, 238, 238, 0.2)";
            ctx.fillRect(0, i*(canvas.height/15)+(canvas.height/15), canvas.width, canvas.height/15);
        }
    }
}

function realclear() {
    for (let i = 0; i < 20; i++) {
        setTimeout(clear, 10+i*20);
        if (i === 19) {
            setTimeout(background, 10+i*20);
        }
    }
}

function background() {
    if (scale === -1) {
        ctx.fillStyle = "rgba(255, 255, 255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else {
        for (let i = 0; i < 15; i = i+2) {
            ctx.fillStyle = "rgba(255, 255, 255)";
            ctx.fillRect(0, i*(canvas.height/15), canvas.width, canvas.height/15);
            ctx.fillStyle = "rgba(238, 238, 238)";
            ctx.fillRect(0, i*(canvas.height/15)+(canvas.height/15), canvas.width, canvas.height/15);
        }
    }
}

let context = new window.AudioContext();

const gainNode = context.createGain();
gainNode.gain.value = 0.1;
gainNode.connect(context.destination);

const currentOsc = [];
let vol = 0.1;
let wave = 'sine';
let scale = -1;
let lock = false;

function playSound() {
    let oscillator = context.createOscillator();
    oscillator.type = wave;
    oscillator.connect(gainNode);
    oscillator.frequency.value = 500;
    return oscillator;
}

document.onpointerdown = startDrag;

function getSound(osc, e) {
    if (scale === -1) {
        osc.frequency.value = 1000 - e.clientY;
    }
    else {
        //let freq = 0;
        let scaleArea = Math.floor((e.clientY/canvas.height) * 15);
        osc.frequency.value = scales[scale][14-scaleArea];
    }
    if (lock === false) {
        vol = e.clientX/canvas.width;
        gainNode.gain.value = vol;
        volume.value = vol;
    }
    clear();
        ball.x = e.clientX;
        ball.y = e.clientY;
        ball.draw();

}

function startDrag(e) {
    gainNode.gain.value = 0;
    const osc = playSound();
    getSound(osc, e);
    osc.start();
    gainNode.gain.setTargetAtTime(vol, context.currentTime, 0.01);

    //stop drag on pointer up
    document.onpointerup = function() {
        gainNode.gain.setTargetAtTime(0, context.currentTime, 0.01);
        osc.stop(context.currentTime + 0.1);
        document.onpointerup = null;
        document.onpointermove = null;
        realclear();
    }
    document.onpointermove = function(e) {
        getSound(osc, e);
    }
}

Nexus.colors.accent = "#348feb";

//volume
let volume = Nexus.Add.Dial('#volume',{
    'size': [100,100],
    'value': vol
  });

volume.on('change',function(v) {
    vol = v;
});

//instrument/waveform
//radio button
var radiobutton = new Nexus.RadioButton('#waveform',{
    'size': [120,25],
    'numberOfButtons': 4,
    'active': 0
});

radiobutton.on('change',function(v) {
    if (v === 0) {
        wave = 'sine';
    }
    else if (v === 1) {
        wave = 'square'
    }
    else if (v === 2) {
        wave = 'sawtooth'
    }
    else if (v === 3) {
        wave = 'triangle'
    }
});

//scale
//dropdown
let select = new Nexus.Select('#scale',{
    'size': [100,30],
    'options': ['No Scale','A major', 'A minor','B major', 'B minor','C major', 'C minor','D major', 'D minor','E major', 'E minor','F major', 'F minor','G major', 'G minor']
});

select.on('change',function(v) {
    scale = select.selectedIndex - 1;
    let notes = document.getElementById("notes");
    if (scale === -1) {
        notes.style.display = "none";
    }
    else {
        notes.style.display = "block";
        for (let i = 0; i < scalesLetters.length + 1; i++) {
            let text = document.getElementById("stripe" + i);
            text.innerHTML = scalesLetters[scale][scalesLetters.length - i];
        }
    }
    background();
  })

//lock
//toggle
let toggle = new Nexus.Toggle('#lock',{
    'size': [40,20],
    'state': false
});

toggle.on('change',function(v) {
    lock = v;
})


let oscilloscope = new Nexus.Oscilloscope('#oscilloscope',{
    'size': [150,75]
  });
  oscilloscope.connect(gainNode)

