import nodemailer from "nodemailer";

export default async function handler(config, payload, subject, message) {
  console.log("Configuration Data: ", config);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port == 465, // auto SSL
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to: payload.email,
    subject,
    html: message,
  });

  console.log("Email sent");
}
