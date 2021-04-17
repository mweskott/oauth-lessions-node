const axios = require('axios')

const auth0Config = {
    clientID: 'KvZA39DqwT8jk91iKXS57IiZBlNkQ0UD',
    clientSecret: 'xqWs-upbuOcM2IC9ejtq3FdW3mF0i2p0XMKgW1X6fu146wYNuHPlYmD8ZE8P4FkD',
    authorizeUrl: 'https://dev-3v86h4v4.us.auth0.com/authorize',
    tokenUrl: 'https://dev-3v86h4v4.us.auth0.com/oauth/token'
}
    
const oauthConfig = auth0Config;
  
const authorizationCode = "mLZm8goQZJ9znkvJ";
const data = {
    "grant_type": "authorization_code",
    "client_id": oauthConfig.clientID,
    "client_secret": oauthConfig.clientSecret,
    "code": authorizationCode,
    "redirect_uri": "http://localhost:8080/oauth/redirect"
};
const params = {
    method: 'post',
    url: oauthConfig.tokenUrl,
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
    console.log(`${oauthConfig.tokenUrl} response`, response.data);
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
    }).catch((error) => console.log(error));


