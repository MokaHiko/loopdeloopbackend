const express = require("express");
var cors = require('cors')

const MidiWriter = require('midi-writer-js');

const app = express();
const PORT = 3001;

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const OCTAVES = [0,1,2,3,4,5,6,7,8,9,10]
const NOTES_IN_OCTAVE = NOTES.length;

let current_instrument = 1;
let in_memory_tracks = [];

function NumberToNote(number) {
    let note = NOTES[number % NOTES_IN_OCTAVE];
	let octave = OCTAVES[Math.floor(number / NOTES_IN_OCTAVE)];

	// Hard coded octave
    return note + octave.toString();
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});

app.get("/test", (req, res) => {
	console.log("nice");
	res.send("ass");
});

app.post("/addTrack", (req, res) => {
    let track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: current_instrument++ }));

    req.body.midi_events.forEach((event) => {
      const note = new MidiWriter.NoteEvent({pitch: [NumberToNote(event.midiNumber)], duration: '2' });
      track.addEvent(note);
    });

	in_memory_tracks.push(track);

	res.sendStatus(201);

});

app.post("/send", (req, res) => {
    const write = new MidiWriter.Writer(in_memory_tracks);
    let url = write.dataUri();
	console.log(url)

	res.sendStatus(201);
});

app.post("/clear", (req, res) => {
	in_memory_tracks.length = 0;
	console.log("cleared");
	res.sendStatus(201)
});

console.log("profit!")