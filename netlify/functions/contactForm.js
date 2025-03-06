const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      body: '',
      headers: {
        'Access-Control-Allow-Origin': '*',
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
    };
  }

  // Validate the data before proceeding (optional but recommended)
  if (!email || !name || !message) {
    return {
      statusCode: 400,  // Bad Request
      body: JSON.stringify({ message: 'All fields are required.' }),
    };
  }

  // Create the Nodemailer transporter object using Gmail's SMTP server
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',  // Using Gmail's SMTP server
      auth: {
        user: 'concussionfirearms@outlook.com',   // Your Outlook email
        pass: 'adsz tnzq lbiu pcrx',              // Your app password for Outlook
      },
    });
  } catch (error) {
    console.error('Error creating transporter:', error);
    return {
      statusCode: 500,  // Internal Server Error
      body: JSON.stringify({ message: 'Failed to configure email transporter.' }),
    };
  }

  // Setup the email options
  const mailOptions = {
    from: email,
    to: 'concussionfirearms@outlook.com',
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
    };
  }

  // Return success response with CORS headers
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Message sent successfully!' }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  };
};
