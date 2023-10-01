// frequencies thanks to https://mixbutton.com/mixing-articles/music-note-to-frequency-chart/
const thirdFourthOct = [
    {
      notes: [
        { label: "C3", frequency: "130.81", sharp: false, key: "z" },
        { label: "C#3", frequency: "138.59", sharp: true, key: "s" },
        { label: "D3", frequency: "146.83", sharp: false, key: "x" },
        { label: "D#3", frequency: "155.56", sharp: true, key: "d" },
        { label: "E3", frequency: "164.81", sharp: false, key: "c" },
        { label: "F3", frequency: "174.61", sharp: false, key: "v" },
        { label: "F#3", frequency: "185.00  ", sharp: true, key: "g" },
        { label: "G3", frequency: "196.00", sharp: false, key: "b" },
        { label: "G#3", frequency: "207.65", sharp: true, key: "h" },
        { label: "A3", frequency: " 220.00", sharp: false, key: "n" },
        { label: "A#3", frequency: "233.08", sharp: true, key: "j" },
        { label: "B3", frequency: "246.94", sharp: false, key: "m" },
      ],
    },
    {
      notes: [
        { label: "C4", frequency: "261.63  ", sharp: false, key: "," },
        { label: "C#4", frequency: "277.18 ", sharp: true, key: "l" },
        { label: "D4", frequency: "293.66 ", sharp: false, key: "." },
        { label: "D#4", frequency: "311.13  ", sharp: true, key: ";" },
        { label: "E4", frequency: "329.63 ", sharp: false, key: "/" },
        { label: "F4", frequency: "349.23", sharp: false, key: "q" },
        { label: "F#4", frequency: "369.99", sharp: true, key: "2" },
        { label: "G4", frequency: "392.00", sharp: false, key: "w" },
        { label: "G#4", frequency: "415.30", sharp: true, key: "3" },
        { label: "A4", frequency: "440.00", sharp: false, key: "e" },
        { label: "A#4", frequency: "466.16", sharp: true, key: "4" },
        { label: "B4", frequency: "493.88", sharp: false, key: "r" },
      ],
    },
  ];
  
  $(function () {
    thirdFourthOct.forEach(callNotes);
  });
  function callNotes(octave, idx, arr) {
    octave.notes.forEach(printKeys);
  }
  function printKeys(note, idx, arr) {
    var isSharp = note.sharp ? " sharp" : "";
    document.getElementById("board").innerHTML += "<li onClick='keyClick(this)' class='noteButton" + isSharp + "' value='" + note.frequency + "' id='" + note.key + "'><span class='noteText'>(" + note.key + ")</span></li>";
  }
  $(window).keypress(function (e) {
  audio.resume();
    function simulateClick(element, idx, arr) {
      if (String.fromCharCode(e.keyCode) === element.getAttribute("id")) {
        $(element).click();
      }
    }
    allButtons = document.getElementsByClassName("noteButton");
    var buttons = Array.from(allButtons);
    buttons.forEach(simulateClick);
  });
  
  var audio = new AudioContext();
  var oscillator = audio.createOscillator();
  var oscillator2 = audio.createOscillator();
  var gain = audio.createGain();
  oscillator.connect(audio.destination);
  oscillator2.connect(audio.destination);
  gain.connect(audio.destination);
  gain.gain.value = 0.1;
  oscillator.connect(gain);
  oscillator.frequency.value = 0;
  oscillator.start(0);
  
  function keyClick(element) {
    if (document.getElementsByClassName("currPressed")) {
      $(document.getElementsByClassName("currPressed")).removeClass(
        "currPressed"
      );
    }
    $(element).addClass("currPressed");
    oscillator.frequency.value = parseInt(element.getAttribute("value"));
  }
  