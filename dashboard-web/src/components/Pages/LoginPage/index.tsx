import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import OAuth2Login from 'react-simple-oauth2-login';
import { useState } from 'react';
import Axios, { AxiosResponse, AxiosError } from 'axios';
import { CForm, CFormLabel, CFormInput, CFormCheck, CButton, CFormText, CAlert } from '@coreui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useToken } from '../../../hooks/useToken';
import { RedirectUriEndpoint, getBackendEndpoint } from '../../../api/endpoint';

const LinkedinEndpoint = 'https://www.linkedin.com/oauth/v2/authorization';

interface LinkedinResponse {
  code: string;
}

interface CredentialsResponse {
  access_token: string;
}

interface LoginErrorResponse {
  error: {
    code: number
    message: string
  }
}

const LoginPage = () => {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const token = useToken();
  const CredentialsEndpoint = getBackendEndpoint('/login');
  const CodeEndpoint = getBackendEndpoint('/login/oauth');

  const togglePassword = () => setPasswordShown(!passwordShown);

  const loginToBackEnd = <T extends {}>(endpoint: string, body: T) => {
    Axios.post(endpoint, body)
      .then((response: AxiosResponse<CredentialsResponse>) => {
        setError(undefined);
        token.set(response.data.access_token);
        navigate('/home', { replace: true });
      })
      .catch((reason: AxiosError<LoginErrorResponse>) => {
        if (!reason.response || !reason.isAxiosError) {
          console.error(reason);
          return;
        }
        setError(reason.response.data.error.message);
        console.error(reason.response.data.error.code);
    })
  }

  const loginCredentials = () => {
    const data = {
      'email': email,
      'password': password
    }
    loginToBackEnd(CredentialsEndpoint, data);
  }

  const loginCode = (code: string) => {
    const data = {
      'code': code,
      'redirect_uri': RedirectUriEndpoint
    }

    loginToBackEnd(CodeEndpoint, data);
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-max">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <CForm className="needs-validation">
            {
              (error) ?
              <CAlert color="danger">
                {error}
              </CAlert> : <></>
            }
            <div className="mb-3">
              <CFormLabel htmlFor="exampleInputEmail1">Email address</CFormLabel>
              <CFormInput type="email" id="exampleInputEmail1" placeholder="Enter email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} aria-describedby="emailHelp" required/>
              <CFormText id="emailHelp">We'll never share your email with anyone else.</CFormText>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="exampleInputPassword1">Password</CFormLabel>
              <CFormInput type={passwordShown ? "text" : "password"} id="exampleInputPassword1" placeholder="Enter password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required/>
            </div>
            <CFormCheck
              className="mb-3"
              label="Show password"
              onChange={togglePassword}
            />
            <CButton color="primary" onClick={loginCredentials}>
              Submit
            </CButton>
          </CForm>
          <div className="flex justify-center items-center space-x-1 pt-3">
            <div className="inline h-px w-full bg-black"/>
              <text className="inline">OR</text>
            <div className="inline h-px w-full bg-black"/>
          </div>
          <div>
            <OAuth2Login
              authorizationUrl={LinkedinEndpoint}
              responseType='code'
              clientId={process.env.REACT_APP_LINKEDIN_CLIENT_ID}
              redirectUri={RedirectUriEndpoint}
              scope='r_emailaddress r_liteprofile'
              buttonText='Login with Linkedin'
              onSuccess={(response: LinkedinResponse) => loginCode(response.code)}
              onFailure={(response: any) => console.error(response)}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Link to={'/register'}>Create a new account</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;