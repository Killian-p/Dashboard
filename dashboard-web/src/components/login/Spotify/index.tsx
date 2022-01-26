import OAuth2Login from 'react-simple-oauth2-login';
import { CButton } from '@coreui/react';
import { enableService } from '../../../api/service';
import { useToken } from '../../../hooks/useToken';
import { RedirectUriEndpoint } from '../../../api/endpoint';

interface LoginResponseSpotify {
  code: string;
  scope: string;
}

const LoginSpotify = ({getWidgets, updateConnection}: {getWidgets: () => void, updateConnection: () => void}) => {
  const token = useToken();

  const onFailure = (response: any) => console.error(response);

  const onSuccess = (response: LoginResponseSpotify) => (
    enableService('spotify', token.get(), { code: response.code, redirectUri: RedirectUriEndpoint })
      .then(() => {
        updateConnection();
        getWidgets();
      })
      .catch(console.error)
  );

  return (
    <div>
      <CButton>
        <OAuth2Login
          authorizationUrl='https://accounts.spotify.com/authorize'
          responseType='code'
          clientId={process.env.REACT_APP_SPOTIFY_CLIENT_ID}
          redirectUri={RedirectUriEndpoint}
          scope='streaming,user-read-email,user-read-private'
          buttonText='Login with Spotify'
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </CButton>
    </div>
  );
}

export default LoginSpotify;