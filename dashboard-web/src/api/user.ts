import Axios, { AxiosRequestConfig } from "axios";
import { getBackendEndpoint } from "./endpoint";

interface LogOutSuccess {
  result: string;
}

export const logOutFromBackend = async (token: string): Promise<LogOutSuccess> => {
  const logOutEndpoint = getBackendEndpoint('/logout');

  const config: AxiosRequestConfig<any> = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return (await Axios.post<LogOutSuccess>(logOutEndpoint, undefined, config)).data;
}