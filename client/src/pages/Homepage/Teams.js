import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { callMsGraph } from '../Main/graph';
import { loginRequest } from '../Main/authConfig';
import { ProfileData } from '../Main/ProfileData';
const Teams = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const login = async () => {
    // Use MSAL to initiate the login process
    await instance.loginPopup();
  };
  
  const logout = () => {
    // Use MSAL to log the user out
    instance.logoutRedirect();
  };
  async function RequestProfileData () {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    await instance
    .acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
        })
        .then((response) => {
          console.log(response,"yyy")
            callMsGraph(response.accessToken).then((response) => setGraphData(response));
          });
}
  return (
    <div>
      <h2>Teams Component</h2>
      {accounts.length === 0 ? (
        <button onClick={login}>Login</button>
      ) : (
        <>
          <p>Welcome, {accounts[0].name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      )}
      {/* Other content specific to your Teams component */}
      {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <button variant="secondary" onClick={RequestProfileData}>
                    Request Profile Information
                </button>
            )}
    </div>
  );
};

export default Teams;



