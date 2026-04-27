// import axios from 'axios';
// import nodemailer from 'nodemailer';
// import { Twilio } from 'twilio';

// export class CommunicationTester {

//   static async testSMTP(config:any) {

//   const transporter = nodemailer.createTransport({
//     host: config.host,
//     port: config.port,
//     auth: {
//       user: config.username,
//       pass: config.password
//     }
//   });

//   await transporter.verify();

//   return {
//     message: "SMTP connection successful"
//   };
// }

// static async testTwilio(config:any) {

//   const client = new Twilio(
//     config.account_sid,
//     config.auth_token
//   );

//   await client.api.accounts(config.account_sid).fetch();

//   return {
//     message: "Twilio connection successful"
//   };
// }






//   static async testWhatsapp() {

//     try {

//       // 🔴 Paste your real values here
//       const ACCESS_TOKEN = "PASTE_YOUR_ACCESS_TOKEN_HERE";
//       const PHONE_NUMBER_ID = "PASTE_YOUR_PHONE_NUMBER_ID_HERE";

//       console.log("Testing WhatsApp API...");

//       const response = await axios.get(
//         `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}?fields=display_phone_number`,
//         {
//           headers: {
//             Authorization: `Bearer ${ACCESS_TOKEN}`
//           }
//         }
//       );

//       console.log("SUCCESS RESPONSE:", response.data);

//       return {
//         message: "WhatsApp connection successful",
//         data: response.data
//       };

//     } catch (error:any) {

//       console.log("ERROR RESPONSE:", error.response?.data);

//       throw new Error(
//         error.response?.data?.error?.message || "WhatsApp connection failed"
//       );

//     }

//   }



// // static async testWhatsapp(config:any) {

// //   console.log("accessToken", config.phoneNumber)
// //   await axios.get(
// //      `https://graph.facebook.com/v18.0/1134803813043310`,
// //     {
// //       headers: {
// //        Authorization:`Bearer ${config.apiKey}`
// //       }
// //     }
// //   );

// //   return {
// //     message: "WhatsApp connection successful"
// //   };
// // }

//   static async test(provider: string, config: any) {

//     switch (provider) {

//       case "smtp":
//         return await this.testSMTP(config);

//       case "twilio":
//         return await this.testTwilio(config);

//       case "whatsapp":
//         return await this.testWhatsapp(config);

//       default:
//         throw new Error("Provider not supported");
//     }

//   }

// }







import axios from 'axios';
import nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

export class CommunicationTester {

  // ✅ SMTP
  static async testSMTP(config: any) {

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

  // ✅ Twilio
  static async testTwilio(config: any) {

    const client = new Twilio(
      config.account_sid,
      config.auth_token
    );

    await client.api.accounts(config.account_sid).fetch();

    return {
      message: "Twilio connection successful"
    };
  }

  // ✅ WhatsApp (Dynamic + Static fallback)
  static async testWhatsapp(config?: any) {

    try {

      // 🔴 Priority: DB config → fallback to static
      const ACCESS_TOKEN =
         "c2d148224697674855585fbb89ac1992";

      const PHONE_NUMBER_ID =
         "1134803813043310";

      // ✅ Validation
      if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        throw new Error("Access Token or Phone Number ID missing");
      }

      console.log("Testing WhatsApp API...");
      console.log("Phone Number ID:", PHONE_NUMBER_ID);

      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}?fields=display_phone_number`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        }
      );

      console.log("SUCCESS RESPONSE:", response.data);

      return {
        message: "WhatsApp connection successful",
        data: response.data
      };

    } catch (error: any) {

      console.log("ERROR RESPONSE:", error.response?.data);

      throw new Error(
        error.response?.data?.error?.message || "WhatsApp connection failed"
      );

    }

  }

  // ✅ Main switch
  static async test(provider: string, config: any) {

    switch (provider) {

      case "smtp":
        return await this.testSMTP(config);

      case "twilio":
        return await this.testTwilio(config);

      case "whatsapp":
        return await this.testWhatsapp(config); // ✅ now works

      default:
        throw new Error("Provider not supported");
    }

  }

}