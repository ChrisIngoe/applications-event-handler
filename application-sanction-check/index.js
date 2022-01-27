const AWS = require('aws-sdk');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    event.detail.status = 'AWAITING_COMPLETION';
    console.log(event);
    await postNewApplicationEvent(event.detail);
    console.log('Sanction Check Ok');
  } catch (err) {
    console.error(err);
  }

  return;
};

async function postNewApplicationEvent(event) {
  const ebClient = new EventBridgeClient({ region: process.env.AWSREGION });

  const entry = {
    Entries: [
      {
        EventBusName: 'default',
        Source: 'applicationsApiHandler.applications',
        DetailType: 'subscription',
        Detail: JSON.stringify(event),
      },
    ],
  };

  const command = new PutEventsCommand(entry);

  try {
    const data = await ebClient.send(command);
    console.log('Success, event sent; requestID:', data);
  } catch (err) {
    console.log('Error', err);
  }

  return;
}
