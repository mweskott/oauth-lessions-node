// Import the express lirbary
const express = require('express')

// Import the axios library, to make HTTP requests
const axios = require('axios')


const githubConfig = {
  // This is the client ID and client secret that you obtained
  // while registering the application
  clientID: 'f6ec992e2bf4349ccd5a',
  clientSecret: '64c5656a82760d5be6dbd77d68cea0426ce69580',
  authorization_endpoint: 'https://github.com/login/oauth/authorize',
  token_endpoint: 'https://github.com/login/oauth/access_token',
  userinfo_endpoint: 'https://api.github.com/user'
}

// https://manage.auth0.com/dashboard/us/dev-3v86h4v4/
// https://dev-3v86h4v4.us.auth0.com/.well-known/openid-configuration
const auth0Config = {
  clientID: 'KvZA39DqwT8jk91iKXS57IiZBlNkQ0UD',
  clientSecret: 'xqWs-upbuOcM2IC9ejtq3FdW3mF0i2p0XMKgW1X6fu146wYNuHPlYmD8ZE8P4FkD',
  authorization_endpoint: 'https://dev-3v86h4v4.us.auth0.com/authorize',
  token_endpoint: 'https://dev-3v86h4v4.us.auth0.com/oauth/token',
  userinfo_endpoint: 'https://dev-3v86h4v4.us.auth0.com/userinfo'
}


const oauthConfig = auth0Config; // githubConfig;
// const oauthConfig = githubConfig;

// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express();
app.use(express.static(__dirname + '/public'))

// request logging
app.all('*', function (req, res, next) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('request', fullUrl, req.headers);
  next(); // pass control to the next handler
});

// redirect to github auth server
app.get('/', (req, res) => {
  // res.redirect(`${oauthConfig.authorizeUrl}?client_id=${oauthConfig.clientID}&redirect_uri=http://localhost:8080/oauth/redirect`)
  res.redirect(`${oauthConfig.authorization_endpoint}?response_type=code&client_id=${oauthConfig.clientID}&redirect_uri=http://localhost:8080/oauth/redirect`)
});

app.get('/oauthconfig', (req, res) => {
  res.send(oauthConfig);
});

// browser comes back from github auth server
app.get('/oauth/redirect', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const authorizationCode = req.query.code;
  const data = {
    "grant_type": "authorization_code",
    "client_id": oauthConfig.clientID,
    "client_secret": oauthConfig.clientSecret,
    "code": authorizationCode,
    "redirect_uri": "http://localhost:8080/oauth/redirect"
  };
  const params = {
    method: 'post',
    url: oauthConfig.token_endpoint,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      "Accept": 'application/json',
      "Content-type": 'application/json'
    },
    data: data
  }; 
  console.log('fetching access token', params);
  axios(params).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    console.log(`${oauthConfig.token_endpoint} response: `, response.data);
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  }).catch((error) => console.log(error));
})

// Start the server on port 8080
app.listen(8080)
