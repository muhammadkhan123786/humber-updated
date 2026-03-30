import twilio from "twilio";

export default async function handler(config, payload, subject, message) {
  const client = twilio(config.accountSid, config.authToken);

  await client.messages.create({
    from: config.from,
    to: `whatsapp:${payload.phone}`,
    body: message
  });
}
