const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Parse the form data from the request body
  const { email, name, message } = JSON.parse(event.body);

  // Create the Nodemailer transporter object using Gmail's SMTP server
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Use Gmail's SMTP server
    auth: {
      user: 'concussionfirearms@outlook.com',   // Gmail address
      pass: 'adsz tnzq lbiu pcrx',      // Gmail app password
    },
  });

  // Setup the email options
  const mailOptions = {
    from: email,    // The email of the person submitting the form
    to: 'concussionfirearms@outlook.com',  // Your email address to receive the form submissions
    subject: `New contact form message from ${name}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully!' }),
    };
  } catch (error) {
    // Return error response if something goes wrong
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send message', error: error.message }),
    };
  }
};
