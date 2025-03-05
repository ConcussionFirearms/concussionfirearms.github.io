const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      body: '',
      headers: {
        'Access-Control-Allow-Origin': '*',  // Allow all origins (or specify your GitHub domain)
        'Access-Control-Allow-Methods': 'POST, OPTIONS',  // Allow POST and OPTIONS methods
        'Access-Control-Allow-Headers': 'Content-Type',  // Allow Content-Type header
      },
    };
  }

  // Ensure only POST requests are handled
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,  // Method Not Allowed
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Parse the form data from the request body
  const { email, name, message } = JSON.parse(event.body);

  // Validate the data before proceeding (optional but recommended)
  if (!email || !name || !message) {
    return {
      statusCode: 400,  // Bad Request
      body: JSON.stringify({ message: 'All fields are required.' }),
    };
  }

  // Create the Nodemailer transporter object using Gmail's SMTP server
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Using Gmail's SMTP server
    auth: {
      user: 'concussionfirearms@outlook.com',   // Your Outlook email
      pass: 'adsz tnzq lbiu pcrx',              // Your app password for Outlook
    },
  });

  // Setup the email options
  const mailOptions = {
    from: email,  // The email of the person submitting the form
    to: 'concussionfirearms@outlook.com',  // Your email address to receive the form submissions
    subject: `New contact form message from ${name}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response with CORS headers
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully!' }),
      headers: {
        'Access-Control-Allow-Origin': '*',  // Allow all origins (or specify your GitHub domain)
        'Access-Control-Allow-Methods': 'POST, OPTIONS',  // Allow POST and OPTIONS methods
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  } catch (error) {
    // Return error response if something goes wrong with CORS headers
    return {
      statusCode: 500,  // Internal Server Error
      body: JSON.stringify({ message: 'Failed to send message', error: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',  // Allow all origins (or specify your GitHub domain)
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }
};
