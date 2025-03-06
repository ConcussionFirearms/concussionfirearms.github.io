const axios = require('axios');

exports.handler = async (event, context) => {
  // Get the authorization code from the query string
  const { code } = event.queryStringParameters;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Authorization code missing' }),
    };
  }

  const params = new URLSearchParams();
  params.append('code', code);
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);
  process.env.REDIRECT_URI = 'https://concussionfirearms.netlify.app/.netlify/functions/oauth2callback';
  params.append('grant_type', 'authorization_code');

  try {
    // Make a POST request to exchange the code for tokens
    const response = await axios.post('https://oauth2.googleapis.com/token', params);
    const { access_token, refresh_token } = response.data;

    // You should securely store these tokens
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tokens retrieved successfully!' }),
    };
  } catch (error) {
    console.error('Error getting tokens:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to exchange code for tokens', error: error.message }),
    };
  }
};
