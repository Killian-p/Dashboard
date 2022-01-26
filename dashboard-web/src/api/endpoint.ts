const BackendEndpoint = 'http://' + process.env.REACT_APP_API_HOST + ':' + process.env.REACT_APP_API_PORT;

export const getBackendEndpoint = (route: string) => `${BackendEndpoint}${route}`;

export const RedirectUriEndpoint = 'http://localhost:8081/home';
