const { google } = require('googleapis');
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      body: '',
      headers: {
        'Access-Control-Allow-Origin': 'https://concussionfirearms.github.io',  // Allow only your GitHub Pages domain
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  // Ensure only POST requests are handled
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Access-Control-Allow-Origin': 'https://concussionfirearms.github.io' }, // Ensure CORS is applied here
    };
  }

  // Parse the form data from the request body
  let email, name, message;
  try {
    const { email: bodyEmail, name: bodyName, message: bodyMessage } = JSON.parse(event.body);
    email = bodyEmail;
    name = bodyName;
    message = bodyMessage;
  } catch (error) {
    console.error('Error parsing body:', error);
    return {
      statusCode: 400,  // Bad Request
      body: JSON.stringify({ message: 'Invalid form data.' }),
      headers: { 'Access-Control-Allow-Origin': 'https://concussionfirearms.github.io' },
    };
  }

  // Validate the data before proceeding (optional but recommended)
  if (!email || !name || !message) {
    return {
      statusCode: 400,  // Bad Request
      body: JSON.stringify({ message: 'All fields are required.' }),
      headers: { 'Access-Control-Allow-Origin': 'https://concussionfirearms.github.io' },
    };
  }

  // OAuth2 Client setup with secrets from GitHub
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,      // Use GitHub secret for Client ID
    process.env.CLIENT_SECRET,  // Use GitHub secret for Client Secret
    process.env.REDIRECT_URI   // Use GitHub secret for Redirect URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,  // Use GitHub secret for Refresh Token
  });

  const accessToken = await oauth2Client.getAccessToken();

  // Create Nodemailer transporter using OAuth2 authentication
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'concussionfirearms@outlook.com',  // Replace with your Gmail address
        clientId: process.env.CLIENT_ID,         // Use GitHub secret for Client ID
        clientSecret: process.env.CLIENT_SECRET, // Use GitHub secret for Client Secret
        refreshToken: process.env.REFRESH_TOKEN, // Use GitHub secret for Refresh Token
        accessToken: accessToken.token,         // OAuth2 access token
      },
    });
  } catch (error) {
    console.error('Error creating transporter:', error);
    return {
      statusCode: 500,  // Internal Server Error
      body: JSON.stringify({ message: 'Failed to configure email transporter.' }),
      headers: { 'Access-Control-Allow-Origin': 'https://concussionfirearms.github.io' },
    };
  }

  // Setup the email options
  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com',  // Replace with your Gmail address
    subject: `New contact form message from ${name}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,  // Internal Server Error
      body: JSON.stringify({ message: 'Failed to send message', error: error.message }),
      headers: { 'Access-Control-Allow-Origin': 'https://concussionfirearms.github.io' },
    };
  }

  // Return success response with CORS headers
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Message sent successfully!' }),
    headers: {
      'Access-Control-Allow-Origin': 'https://concussionfirearms.github.io', // Allow only GitHub Pages
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  };
};
