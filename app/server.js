const express = require("express");
const speech = require("@google-cloud/speech");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

async function transcribe(config, audio) {
  const client = new speech.SpeechClient();
  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}

app.post("/audio", (req, res) => {
  res.status(200).send('Received!');
  console.log('Transcribing...');
  transcribe(req.body.config, req.body.audio);
});

app.get("/", (req, res) => {
  return console.log("Working");
});

app.listen(port);
console.log(`Server runing at: ${require("os").hostname()}/${port}`);
