import OAuth2Login from 'react-simple-oauth2-login';
import { CButton } from '@coreui/react';
import { enableService } from '../../../api/service';
import { useToken } from '../../../hooks/useToken';
import { RedirectUriEndpoint } from '../../../api/endpoint';

interface LoginResponseGithub {
  code: string;
  scope: string;
}

const LoginGithub = ({getWidgets, updateConnection}: {getWidgets: () => void, updateConnection: () => void}) => {
  const token = useToken();

  const onFailure = (response: any) => console.error(response);

  const onSuccess = (response: LoginResponseGithub) => (
    enableService('github', token.get(), { code: response.code, redirectUri: RedirectUriEndpoint })
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
          authorizationUrl='https://github.com/login/oauth/authorize'
          responseType='code'
          clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
          redirectUri={RedirectUriEndpoint}
          scope='repo read:user admin:public_key'
          buttonText='Login with Github'
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </CButton>
    </div>
  );
}

export default LoginGithub;