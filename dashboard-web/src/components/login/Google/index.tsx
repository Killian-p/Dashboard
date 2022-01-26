import OAuth2Login from 'react-simple-oauth2-login';
import { CButton } from '@coreui/react';
import { useToken } from '../../../hooks/useToken';
import { enableService } from '../../../api/service';
import { RedirectUriEndpoint } from '../../../api/endpoint';

interface LoginResponseGoogle {
  code: string;
  scope: string;
}


const LoginGoogle = ({getWidgets, updateConnection}: {getWidgets: () => void, updateConnection: () => void}) => {
  const token = useToken()

  const onFailure = (response: any) => console.error(response);

  const onSuccess = (response: LoginResponseGoogle) => (
    enableService('google', token.get(), { code: response.code, redirectUri: RedirectUriEndpoint })
      .then(() => {
        updateConnection();
        getWidgets();
      })
      .catch(console.error)
  );

  return (
    <div>
      <CButton >
        <OAuth2Login
          authorizationUrl='https://accounts.google.com/o/oauth2/v2/auth'
          responseType='code'
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          redirectUri={RedirectUriEndpoint}
          scope='https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/gmail.modify'
          buttonText='Login with Google'
          onSuccess={onSuccess}
          onFailure={onFailure}
          extraParams={{
            access_type: 'offline',
            prompt: 'consent'
          }}
          access_type={'offline'}
        />
      </CButton>
    </div>
  );
}

export default LoginGoogle;