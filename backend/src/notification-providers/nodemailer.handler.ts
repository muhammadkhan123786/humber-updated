import nodemailer from "nodemailer";

export default async function handler(
  config,
  payload,
  subject,
  message
) {

  const transporter = nodemailer.createTransport({

    host: config.host,
    port: config.port,

    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  await transporter.sendMail({

    from: config.from,
    to: payload.email,
    subject,
    html: message
  });

  console.log("Email sent");
}

