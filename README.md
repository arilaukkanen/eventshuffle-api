# eventshuffle-api

Eventshuffle backend API.

This repository contains the NodeJS Lambda function code. 

## Technical Information

The eventshuffle-api backend is constructed on AWS cloud. The backend consists of HTTP API Gateway, a Lambda function, and a DynamoDB database.

![Backend architecture](https://github.com/arilaukkanen/eventshuffle-api/blob/main/eventshuffle-api.png?raw=true)

API Gateway receives clients' requests and routes them to Lambda function, which parses requests and serves them. The event data is persisted on DynamoDB document database, which has one table for events. All single event data including votes given is contaianed in a single item on DynamoDB.

All used AWS resources are serverless, meaning they all scale automatically and generate costs only when used. Being serverless backend, generated CO2 emissions are hopefully minimized, too. :)

## API URL

https://50fphxreva.execute-api.eu-north-1.amazonaws.com

For example list all events:

https://50fphxreva.execute-api.eu-north-1.amazonaws.com/api/v1/event/list

### All Methods

```
GET /api/v1/event/list
GET /api/v1/event/{id}
POST /api/v1/event
POST /api/v1/event/{id}/vote
GET /api/v1/event/{id}/results
```

More information at https://gist.github.com/VilluNikolaiV/44eae2829f7ece9c0d0657d502ed8c63. Note that the current implementation differs from the given specification in event id type. Auto incrementing id is an anti-pattern in DynamoDB, UUIDs are used instead.

## Further Development Ideas

Some ideas how to continue developing the backend:
* Input syntax and semantics validation on API Gateway level and code level
* CloudFormation stack for automatically create all resources when needed
* Logging and monitoring improvements
* API tests
* Distribute code on different Lambdas based on request
* Better error handling in backend code
* Minimum access policies for services
* Security hardening
* GitHub integration and automatic pipeline for updating Lambda function code when commit is made
* Separate environments for testing/staging/production and a mechanism to release staged version to production
* Domain name for API
* Introduction of e.g. edge locations or multiple regions based on access patterns 
