

let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");

// ..

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId,
//       audience: "https://dev-3v86h4v4.us.auth0.com/userinfo" 
    });
};

// https://dev-3v86h4v4.us.auth0.com/authorize?client_id=KvZA39DqwT8jk91iKXS57IiZBlNkQ0UD&scope=openid%20profile%20email&response_type=code&response_mode=query&state=WERXS01Tdlhud1FHVG0zaUF1aEVHLnZtSnNFci1NUzN6Mmphdl9kdGRNdQ%3D%3D&nonce=ZjJWTWV1MVNlbm1xbDBiRmlrajV4dDhzQnJWZEdVb0dUTVU4N0EuQUhVTg%3D%3D&redirect_uri=http%3A%2F%2Flocalhost%3A8080&code_challenge=Neouhjpd0-o8ZP4t6Y-xxA0HXqYE7H46CAqVT8YkmNI&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjEuMTMuNiJ9

window.onload = async () => {
    await configureClient();
  
    // NEW - update the UI state
    updateUI();

    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      // show the gated content
      return;
    }
  
    // NEW - check for the code and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
  
      // Process the login state
      await auth0.handleRedirectCallback();
      
      updateUI();
  
      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, "/");
    }


};
  
const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();

    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;

    if (isAuthenticated) {
        document.getElementById("gated-content").classList.remove("hidden");
    
        document.getElementById(
          "ipt-access-token"
        ).innerHTML = await auth0.getTokenSilently();


        document.getElementById("ipt-user-profile").textContent = JSON.stringify(
          await auth0.getUser(), null, 2
        );
    
    } else {
        document.getElementById("gated-content").classList.add("hidden");
     }

};


const login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
    });
};

const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
};

const callApi = async () => {
    try {
  
      // Get the access token from the Auth0 client
      const token = await auth0.getTokenSilently();
  
      // Make the call to the API, setting the token
      // in the Authorization header
      const response = await fetch("/api/external", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Fetch the JSON result
      const responseData = await response.json();
  
      // Display the result in the output element
      const responseElement = document.getElementById("api-call-result");
  
      responseElement.innerText = JSON.stringify(responseData, {}, 2);
  
    } catch (e) {
      // Display errors in the console
      console.error(e);
    }
};


