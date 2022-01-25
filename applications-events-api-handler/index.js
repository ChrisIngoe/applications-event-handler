const AWS = require('aws-sdk');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event.body, null, 2));

  const ebClient = new EventBridgeClient({ region: process.env.AWSREGION });

  let body;
  let statusCode = '200';
  const headers = {
    'Content-Type': 'application/json',
  };

  const entry = {
    Entries: [
      {
        EventBusName: 'default',
        Source: 'applicationsApiHandler.applications',
        DetailType: 'subscription',
        Detail: event.body,
      },
    ],
  };

  const command = new PutEventsCommand(entry);

  try {
    const data = await ebClient.send(command);
    console.log('Success, event sent; requestID:', data);
    body = { status: 'Ok' };
  } catch (err) {
    console.log('Error', err);
    statusCode = '400';
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
