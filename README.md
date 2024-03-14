# eventshuffle-api

Eventshuffle backend API.

This repository contains the Lambda function code. 

## Technical Information

The eventshuffle-api backend is constructed on AWS cloud. The backend consists of HTTP API Gateway, a Lambda function, and a DynamoDB database.

![Backend architecture](https://github.com/arilaukkanen/eventshuffle-api/blob/main/eventshuffle-api.png?raw=true)

API Gateway receives clients' requests and routes them to Lambda function, which parses requests and serves them. The event data is persisted on DynamoDB document database.

All used AWS resources are serverless, meaning they all scale automatically and generate costs only when used. Being serverless backend, generated CO2 emissions are hopefully minimized, too. :)

## API URL

https://50fphxreva.execute-api.eu-north-1.amazonaws.com

For example list all events:

https://50fphxreva.execute-api.eu-north-1.amazonaws.com/api/v1/event/list

### All Methods

GET /api/v1/event/list
GET /api/v1/event/{id}
POST /api/v1/event
POST /api/v1/event/{id}/vote
GET /api/v1/event/{id}/results

## Further Development

Some ideas how to continue developing the backend:
* Input validation on API Gateway level and code level
* Better error handling in backend code
* Minimum access policies for services
* Security 
* Authorization
