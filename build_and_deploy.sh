#!/bin/bash

GCP_CONFIGURATION_NAME=bot
GCP_PROJECT_NAME=DiscordBot
GCP_REGION=europe-west4

if [ -z "$1" ]
then
    ENVSUFFIX="test"
else
    ENVSUFFIX=$1
fi

# Ensure proper GCP configuration is set
gcloud config configurations activate ${GCP_CONFIGURATION_NAME}

rm data/auth.json
cp data/auth-"${ENVSUFFIX}".json data/auth.json

docker build --no-cache -t eu.gcr.io/${GCP_PROJECT_NAME}/pokecenter-"${ENVSUFFIX}" .
docker push eu.gcr.io/${GCP_PROJECT_NAME}/pokecenter-"${ENVSUFFIX}"

echo "Deploy new revision of pokecenter-${ENVSUFFIX}"

gcloud run deploy pokecenter-"${ENVSUFFIX}" --image=eu.gcr.io/${GCP_PROJECT_NAME}/pokecenter-"${ENVSUFFIX}" \
  --platform=managed --region=${GCP_REGION} --allow-unauthenticated \
  --max-instances 1 --memory=512Mi

echo "Ensure that there is cron job for checking pokecenter-${ENVSUFFIX}"

# Get proper URL
GCP_APP_URL=$(gcloud run services list --platform=managed --region=${GCP_REGION} \
  --filter="status.address.url ~ pokecenter-${ENVSUFFIX}" \
  --format="value(status.address.url)")

gcloud scheduler jobs create http GET-pokecenterbot-"${ENVSUFFIX}" \
  --schedule="* * * * *" --uri="${GCP_APP_URL}" --http-method GET