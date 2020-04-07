/**
 * This function is implemented as a Google Cloud Function
 *
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const axios = require("axios");
const containerAddress = "http://35.196.200.49";

const formatUri = (event) => {
  return `gs://${event.bucket}/${event.name}`;
};

exports.triggerBucket = (event, context) => {
  const gcsEvent = event;
  if (gcsEvent.contentType.includes("audio") || gcsEvent.name.includes(".raw")) {
    console.log("Audio file detected");
    axios
      .post(`${containerAddress}/audio`, {
        config: {
          encoding: "LINEAR16",
          sampleRateHertz: 16000,
          languageCode: "en-US"
        },
        audio: {
          uri: formatUri(gcsEvent),
        }
      })
      .then((res) => {
        console.log(`Response status: ${res.statusCode}`);
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log("Not an audio file.");
  }
};
