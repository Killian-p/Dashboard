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

interface RegisterErrorResponse {
  error: {
    code: number
    message: string
  }
}

const RegisterPage = () => {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [code, setCode] = useState<string>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const CredentialsEndpoint = getBackendEndpoint('/register');
  const CodeEndpoint = getBackendEndpoint('/register/oauth');
  const token = useToken();

  const togglePassword = () => setPasswordShown(!passwordShown);

  const registerToBackEnd = <T extends {}>(endpoint: string, body: T) => {
    Axios.post(endpoint, body)
      .then((response: AxiosResponse<CredentialsResponse>) => {
        setError(undefined);
        token.set(response.data.access_token);
        navigate('/home', { replace: true });
      })
      .catch((reason: AxiosError<RegisterErrorResponse>) => {
        if (!reason.response || !reason.isAxiosError) {
          console.error(reason);
          return;
        }
        setError(reason.response.data.error.message);
        console.error(reason.response.data.error.code);
      })
  }

  const registerCredentials = () => {
    const data = {
      'username': username,
      'password': password,
      'email': email
    };
    registerToBackEnd(CredentialsEndpoint, data);
  }

  const registerCode = () => {
    const data = {
      'code': code,
      'password': password,
      'redirect_uri': RedirectUriEndpoint,      
    }
    registerToBackEnd(CodeEndpoint, data);
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-max">
        {
          (!code) ?
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
                <CFormLabel htmlFor="exampleInputPassword1">Username</CFormLabel>
                <CFormInput type="text" id="exampleInputPassword1" placeholder="Enter Username" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} required/>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleInputPassword1">Password</CFormLabel>
                <CFormInput type={passwordShown ? "text" : "password"} id="exampleInputPassword1" placeholder="Enter password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required/>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleInputPassword1">Confirm Password</CFormLabel>
                <CFormInput type={passwordShown ? "text" : "password"} id="exampleInputPassword1" placeholder="Confirm password" value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} required/>
              </div>
              <CFormCheck
                className="mb-3"
                label="Show password"
                onChange={togglePassword}
              />
              {
                (password !== confirmPassword) ? 
                  <CAlert color="danger">
                    Password are different.
                  </CAlert> : <></>
              }
              {
                (password && password.length < 8 && password.length > 0) ?
                  <CAlert color="danger">
                    Password is too short.
                  </CAlert> : <></>
              }
              <CButton color="primary" onClick={registerCredentials}>
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
                buttonText='Sign up with Linkedin'
                onSuccess={(response: LinkedinResponse) => {setCode(response.code); setPasswordShown(false);}}
                onFailure={(response: any) => console.error(response)}
              />
            </div>
          </div>
          :
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <CForm className="needs-validation">
              {
                (error) ?
                <CAlert color="danger">
                  {error}
                </CAlert> : <></>
              }    
              <div className="mb-3">
                <CFormLabel htmlFor="exampleInputPassword1">Password</CFormLabel>
                <CFormInput type={passwordShown ? "text" : "password"} id="exampleInputPassword1" placeholder="Enter password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required/>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleInputPassword1">Confirm Password</CFormLabel>
                <CFormInput type={passwordShown ? "text" : "password"} id="exampleInputPassword1" placeholder="Confirm password" value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} required/>
              </div>
              <CFormCheck
                className="mb-3"
                label="Show password"
                onChange={togglePassword}
              />
              {
                (password !== confirmPassword) ? 
                  <CAlert color="danger">
                    Password are different.
                  </CAlert> : <></>
              }
              {
                (password && password.length < 8 && password.length > 0) ?
                  <CAlert color="danger">
                    Password is too short.
                  </CAlert> : <></>
              }
              <CButton color="primary" onClick={registerCode}>
                Submit
              </CButton>
            </CForm>
          </div>
        }
        <div className="flex justify-center">
          <Link to={'/login'}>Login to your account</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;