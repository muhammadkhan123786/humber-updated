import twilio from "twilio";

export default async function handler(
  config,
  payload,
  subject,
  message,
  channelKey
) {

  const client = twilio(
    config.accountSid,
    config.authToken
  );

  if (channelKey === "sms") {

    await client.messages.create({
      from: config.from,
      to: payload.phone,
      body: message
    });
  }

  if (channelKey === "whatsapp") {

    await client.messages.create({
      from: config.from,
      to: `whatsapp:${payload.phone}`,
      body: message
    });
  }

}