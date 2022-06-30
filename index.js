// Example filename: index.js

const { Deepgram } = require("@deepgram/sdk");
const fetch = require("cross-fetch");

// Your Deepgram API Key
const deepgramApiKey = "5cf9ca04c295726e84d5b9b3f238a4b7639aa377";

// URL for the audio you would like to stream
// URL for the example resource will change depending on whether user is outside or inside the UK
// Outside the UK
// const url =
//   "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourlw_online_nonuk";
// Inside the UK
// const url = 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm';

//noisy sounds
// not detected
// const url = `https://cdn.freesound.org/previews/238/238387_2465106-lq.mp3`
//health checkup can not process
// const url = `https://cdn.freesound.org/previews/317/317121_5390223-lq.mp3`
//talking in crowd 
// const url = `https://cdn.freesound.org/previews/84/84391_1338546-lq.mp3`
// provided by prerana audio sample 1
const url = `https://drive.google.com/drive/u/1/folders/1kSJnTiIgBxe8RO-Cd61Bioo8TpK2JvgA`;
// Initialize the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

// Create a websocket connection to Deepgram
// In this example, punctuation is turned on, interim results are turned off, and language is set to UK English.
const deepgramLive = deepgram.transcription.live({
  punctuate: true,
  interim_results: false,
  // language: "en-GB",
  endpointing: true,
  model: "general-polaris",
  diarize: true,
});

// Listen for the connection to open and send streaming audio from the URL to Deepgram
fetch(url)
  .then((r) => r.body)
  .then((res) => {
    res.on("readable", () => {
      if (deepgramLive.getReadyState() == 1) {
        deepgramLive.send(res.read());
      }
    });
  });

// Listen for the connection to close
deepgramLive.addListener("close", () => {
  console.log("Connection closed.");
});

// Listen for any transcripts received from Deepgram and write them to the console
deepgramLive.addListener("transcriptReceived", (message) => {
  const data = JSON.parse(message);

  // Write the entire response to the console
  console.dir(data.channel, { depth: null });

  // Write only the transcript to the console
  //console.dir(data.channel.alternatives[0].transcript, { depth: null });
});
