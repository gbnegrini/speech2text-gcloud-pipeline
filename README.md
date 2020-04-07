# Speech-to-Text pipeline

A personal use pipeline integrating Google Cloud services to transcribe audio files. :cloud: :microphone:

![Docker build](https://img.shields.io/docker/cloud/automated/gbnegrini/speech2text-container)
![Docker build](https://img.shields.io/docker/cloud/build/gbnegrini/speech2text-container)
![License](https://img.shields.io/github/license/gbnegrini/speech2text-gcloud-pipeline)

## :rotating_light: Requirements
 - [Google Cloud](https://cloud.google.com) account *
 - [Cloud SDK](https://cloud.google.com/sdk)
 - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

\* Charges may apply, you should check [pricing](https://cloud.google.com/pricing/list) and [free tier limits](https://cloud.google.com/free) before using.

## :question: How does it work?

1. An upload to a [Cloud Storage](https://cloud.google.com/storage) bucket automatically triggers a [Cloud Function](https://cloud.google.com/functions).    

    - This function checks if the uploaded content is an audio file and, if so, does a POST request to the server
    
    - The POST request body contains the audio configuration data (encoding, language and sample rate) and the file URI 


2. Upon receiving the request, the server transcribes the audio using the [Google Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text).
    - This is a [Node.js](https://nodejs.org/) server built with the [Express.js](https://expressjs.com/) framework and implemented on a [Docker](https://www.docker.com/) container :whale2: 
    
    - The container is deployed to [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine) :ferris_wheel: 

## :computer: Usage

After creating a Google Cloud account and setting up a new project execute the following steps.

### Log in to your account and set the active project

```
gcloud init

gcloud config set project <PROJECT-ID>
```

### Create a Cloud Storage bucket
```
gsutil mb -l us-east1 gs://<BUCKET-NAME>/
```

### Deploy to Kubernetes Engine

Execute the following commands inside the project root folder:

```
gcloud container clusters create <CLUSTER-NAME> --zone us-east1 --disk-size=20GB --num-nodes=1 --machine-type=g1-small --scopes=gke-default,cloud-platform

gcloud container clusters get-credentials <CLUSTER-NAME> --zone us-east1

kubectl create -f ./app/kubernetes/deployment.yaml

kubectl create -f ./app/kubernetes/service.yaml

kubectl get services
```

- Copy the Service's EXTERNAL-IP value and edit the `const containerAddress = "http://SERVICES_EXTERNAL_IP";` value at ./cloud-functions/function.js.

### Deploy function.js to Cloud Functions
```
gcloud functions deploy triggerBucket --entry-point=triggerBucket --memory=128MB --runtime=nodejs8 --source=./cloud-functions/triggerBucker.js --timeout=5s --trigger-bucket=<BUCKET-NAME> --trigger-event=google.storage.object.finalize --trigger-resource=<BUCKET-NAME>
```

### Test it!

```
gsutil cp ./resources/audio.raw gs://<BUCKET-NAME>/

kubectl get pods

kubectl logs --follow <POD-NAME>
```

### When you're done, delete it
To avoid being charged you can delete everything:

```
gsutil rm -r gs://<BUCKET-NAME>/

gcloud functions delete triggerBucket

kubectl delete service speech2text-service

gcloud container clusters delete <CLUSTER-NAME> --zone 
```