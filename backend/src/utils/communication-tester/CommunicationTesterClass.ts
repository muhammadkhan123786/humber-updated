import axios from 'axios';
import nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

export class CommunicationTester {

  static async testSMTP(config:any) {

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    auth: {
      user: config.username,
      pass: config.password
    }
  });

  await transporter.verify();

  return {
    message: "SMTP connection successful"
  };
}

static async testTwilio(config:any) {

  const client = new Twilio(
    config.account_sid,
    config.auth_token
  );

  await client.api.accounts(config.account_sid).fetch();

  return {
    message: "Twilio connection successful"
  };
}

static async testWhatsapp(config:any) {

  await axios.get(
    "https://graph.facebook.com/v18.0/me",
    {
      headers: {
        Authorization: `Bearer ${config.access_token}`
      }
    }
  );

  return {
    message: "WhatsApp connection successful"
  };
}

  static async test(provider: string, config: any) {

    switch (provider) {

      case "smtp":
        return await this.testSMTP(config);

      case "twilio":
        return await this.testTwilio(config);

      case "whatsapp":
        return await this.testWhatsapp(config);

      default:
        throw new Error("Provider not supported");
    }

  }

}