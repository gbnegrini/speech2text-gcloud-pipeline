# Speech-to-Text pipeline

A personal use pipeline integrating Google Cloud services to transcribe audio files. :cloud: :microphone:

![Docker build](https://img.shields.io/docker/cloud/automated/gbnegrini/speech2text-container)
![Docker build](https://img.shields.io/docker/cloud/build/gbnegrini/speech2text-container)
![License](https://img.shields.io/github/license/gbnegrini/speech2text-gcloud-pipeline)

## Requirements
 - [Google Cloud](https://cloud.google.com) account *
 - [Cloud SDK](https://cloud.google.com/sdk)
 - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

\* Charges may apply, check [free tier limits](https://cloud.google.com/free) before using.

## How does it work?

1. An upload to a [Cloud Storage](https://cloud.google.com/storage) bucket automatically triggers a [Cloud Function](https://cloud.google.com/functions).    

    - This function checks if the uploaded content is an audio file and, if so, does a POST request to the server
    
    - The POST request body contains the audio configuration data (encoding, language and sample rate) and the file URI 


2. Upon receiving the request, the server transcribes the audio using the [Google Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text).
    - This is a [Node.js](https://nodejs.org/) server built with the [Express.js](https://expressjs.com/) framework and implemented on a [Docker](https://www.docker.com/) container :whale2: 
    
    - The container is deployed to [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine) :ferris_wheel: 