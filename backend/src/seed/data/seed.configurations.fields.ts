export const configurationFieldsData = [
  {
    providerName:"nodemailer",
    fields: [
      {
        name: 'user',
        label: 'User',
        type: 'text',
        required: true,
        placeholder: 'Enter username or email.',
        options: []
      },
      {
        name: 'pass',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter Password ',
        options: []
      },
      {
        name: 'host',
        label: 'Host',
        type: 'text',
        required: true,
        placeholder: 'Enter host. ',
        options: []
      },
      {
        name: 'port',
        label: 'Port',
        type: 'number',
        required: true,
        placeholder: 'Enter Port Number',
        options: []
      },
      {
        name: 'from',
        label: 'From',
        type: 'text',
        required: true,
        placeholder: 'From',
        options: []
      }
    ],
  },
  {
    providerName: "whatsapp",
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true, placeholder: 'Enter WhatsApp API Key' },
      { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true, placeholder: 'Enter sender phone number' }
    ]
  },
  {
    providerName: "twilio",
    fields: [
      { name: 'accountSid', label: 'Account SID', type: 'text', required: true, placeholder: 'Enter Twilio Account SID' },
      { name: 'authToken', label: 'Auth Token', type: 'password', required: true, placeholder: 'Enter Twilio Auth Token' },
      { name: 'from', label: 'From Number', type: 'text', required: true, placeholder: 'Enter Twilio phone number' }
    ]
  }
];

 