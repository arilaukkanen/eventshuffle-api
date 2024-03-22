/*
eventshuffle-aws-lambda-function.mjs.mjs
AWS Lambda for handling eventshuffle-api calls.
*/

import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "futurice-events";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      // List all events
      case "GET /api/v1/event/list":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items;
        var allEvents = [];
        body.forEach((item) => {
          allEvents.push({
            id: item.id,
            name: item.name,
          });
        });
        body = allEvents;
        break;

      // Show an event
      case "GET /api/v1/event/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = body.Item;
        break;

      // Create an event
      case "POST /api/v1/event":
        // Specification mismatch: Use UUIDs instead of incremental integer.
        // Incremental id is a DynamoDB anti-pattern, and is considered
        // not-so-good practise overall.
        let newEventUuid = randomUUID();
        let newEventRequestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: newEventUuid,
              name: newEventRequestJSON.name,
              dates: newEventRequestJSON.dates,
              votes: [],
            },
          })
        );
        body = { id: newEventUuid };
        break;

      // Add votes to an event
      case "POST /api/v1/event/{id}/vote":
        let newVoteRequestJSON = JSON.parse(event.body);
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );

        var voteName = newVoteRequestJSON.name;
        var voteDates = newVoteRequestJSON.votes;
        var votes = body.Item.votes;

        // Algorithm: Loop through voted dates and check for each one if
        // the date has been already voted. If so, add voter name to people
        // for the date, otherwise create new voted day item in votes.
        voteDates.forEach((voteDate) => {
          var dateFound = false;
          votes.forEach((vote) => {
            if (vote.date == voteDate) {
              // Add voter to people array, remove duplicates
              vote.people = [
                ...new Set(vote.people.concat([...vote.people, voteName])),
              ];
              dateFound = true;
            }
          });
          if (!dateFound) {
            votes.push({ date: voteDate, people: [voteName] });
          }
        });

        body = await dynamo.send(
          new UpdateCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
            UpdateExpression: "set votes = :votes",
            ExpressionAttributeValues: {
              ":votes": votes,
            },
            ReturnValues: "ALL_NEW",
          })
        );

        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = body.Item;
        break;

      // Show the results of an event
      case "GET /api/v1/event/{id}/results":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );

        var resultsEvent = body.Item;
        votes = body.Item.votes;
        var suitableDates = [];
        var allParticipants = [];

        votes.forEach((vote) => {
          // Add participants, remove duplicates
          allParticipants = [...new Set(allParticipants.concat(vote.people))];
        });

        votes.forEach((vote) => {
          var hasAllParticipants = true;
          allParticipants.forEach((participant) => {
            if (!vote.people.includes(participant)) {
              hasAllParticipants = false;
            }
          });
          hasAllParticipants && suitableDates.push(vote);
        });

        body = {
          id: resultsEvent.id,
          name: resultsEvent.name,
          suitableDates: suitableDates,
        };
        break;

      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
