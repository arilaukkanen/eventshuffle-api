# eventshuffle-api

Eventshuffle backend API.

This repository contains the Lambda function code. 

## Technical information

The eventshuffle-api backend is constructed on AWS cloud. The backend consists of HTTP API Gateway, a Lambda function, and a DynamoDB database.

API Gateway receives clients' requests and routes them to Lambda function, which parses requests and serves them. The event data is persisted on DynamoDB document database.

All used AWS resources are serverless, meaning they all scale automatically and generate costs only when used. Being serverless backend, generated CO2 emissions are hopefully minimized, too. :)

## API URL

https://50fphxreva.execute-api.eu-north-1.amazonaws.com

For example list all events:

https://50fphxreva.execute-api.eu-north-1.amazonaws.com/api/v1/event/list

