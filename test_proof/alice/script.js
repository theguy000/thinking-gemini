const keyboard = document.getElementById('keyboard');
const instrumentSelect = document.getElementById('instrument-select');
const playAliceButton = document.getElementById('play-alice');
const scoreDisplay = document.getElementById('score-display');

let synth = new Tone.Synth().toDestination();
let currentInstrument = "piano"

const notes = {
    "a": "C4", "w": "C#4", "s": "D4", "e": "D#4", "d": "E4", "f": "F4", "t": "F#4", "g": "G4", "y": "G#4", "h": "A4", "u": "A#4", "j": "B4",
    "k": "C5", "o": "C#5", "l": "D5", "p": "D#5", ";": "E5"
};

const aliceScore = [
    { note: "E4", start: 0, duration: 0.25 },
    { note: "D#4", start: 0.25, duration: 0.25 },
    { note: "E4", start: 0.5, duration: 0.25 },
    { note: "D#4", start: 0.75, duration: 0.25 },
    { note: "E4", start: 1, duration: 0.25 },
    { note: "B3", start: 1.25, duration: 0.25 },
    { note: "D4", start: 1.5, duration: 0.25 },
    { note: "C4", start: 1.75, duration: 0.5 },
];

function createKeyboard() {
    const keys = Object.keys(notes);
    keys.forEach(key => {
        const isBlackKey = key === 'w' || key === 'e' || key === 't' || key === 'y' || key === 'u' || key === 'o' || key === 'p';
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        if (isBlackKey) keyElement.classList.add('black');
        keyElement.innerText = notes[key];
        keyElement.dataset.note = notes[key];
        keyboard.appendChild(keyElement);
    });
}

function playNote(note) {
    if (currentInstrument === 'piano') {
        synth = new Tone.Synth().toDestination()
    } else if(currentInstrument === 'synth') {
         synth = new Tone.FMSynth().toDestination();
    }else if(currentInstrument === 'guitar'){
       synth = new Tone.Sampler({
            urls: {
                A0: "A0.mp3",
                C1: "C1.mp3",
                "F#1": "Fs1.mp3",
                A1: "A1.mp3",
                C2: "C2.mp3",
                "F#2": "Fs2.mp3",
                A2: "A2.mp3",
                C3: "C3.mp3",
                "F#3": "Fs3.mp3",
                A3: "A3.mp3",
                C4: "C4.mp3",
                "F#4": "Fs4.mp3",
                A4: "A4.mp3",
                C5: "C5.mp3",
                "F#5": "Fs5.mp3",
                A5: "A5.mp3",
                C6: "C6.mp3",
                "F#6": "Fs6.mp3",
                A6: "A6.mp3",
                C7: "C7.mp3",
                "F#7": "Fs7.mp3",
                A7: "A7.mp3",
                C8: "C8.mp3"
            },
            baseUrl: "https://tonejs.github.io/audio/salamander/",
        }).toDestination();
    }
    synth.triggerAttackRelease(note, "8n");
}

function updateScoreDisplay(score) {
    scoreDisplay.innerHTML = score.map(note => `<span data-note="${note.note}">${note.note} </span>`).join('');
}

function highlightScore(note) {
    const scoreNotes = document.querySelectorAll('#score-display span');
    scoreNotes.forEach(span => {
        span.classList.remove('active');
        if (span.dataset.note === note) {
            span.classList.add('active');
        }
    });
}

function playAlice() {
    updateScoreDisplay(aliceScore);
    let currentNoteIndex = 0;
    function playNextNote() {
        if (currentNoteIndex < aliceScore.length) {
            const note = aliceScore[currentNoteIndex];
            playNote(note.note);
            highlightScore(note.note);
            currentNoteIndex++;
             setTimeout(playNextNote, note.duration * 500);
        }
    }
   playNextNote();
}


createKeyboard();

document.addEventListener('keydown', (event) => {
    const note = notes[event.key];
    if (note) {
        playNote(note);
    }
});

instrumentSelect.addEventListener('change', (event) => {
    currentInstrument = event.target.value
});


keyboard.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('key')) {
       playNote(event.target.dataset.note)
       event.target.classList.add('active')
       setTimeout(()=>{
            event.target.classList.remove('active')
       }, 200)
    }
})


playAliceButton.addEventListener('click', playAlice);