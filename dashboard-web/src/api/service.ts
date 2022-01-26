import Axios, { AxiosRequestConfig } from "axios";
import { getBackendEndpoint } from "./endpoint";
import type { AllWidgetsByService } from "./widget";

export type AllServices = keyof AllWidgetsByService

export interface ServiceEnabled
{
  result: string
}

export interface ServiceDisabled
{
  result: string
}

export interface ServiceState
{
  name: AllServices
}

export const enableService = async (service: AllServices, token: string, authLogin?: {code: string, redirectUri: string}): Promise<ServiceEnabled> => {
  const serviceEndpoint = getBackendEndpoint('/user/services');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const data = {
    'name': service,
    'code': authLogin?.code,
    'redirect_uri': authLogin?.redirectUri
  }
  return (await Axios.post<ServiceEnabled>(serviceEndpoint, data, config)).data;
}

export const disableService = async (service: AllServices, token: string): Promise<ServiceDisabled> => {
  const serviceEndpoint = getBackendEndpoint('/user/services');
  const config: AxiosRequestConfig<any> = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      name: service
    }
  }

  return (await (Axios.delete<ServiceDisabled>(serviceEndpoint, config))).data;
}

export const fetchActivatedServices = async (token: string): Promise<ServiceState[]> => {
  const serviceEndpoint = getBackendEndpoint('/user/services');
  const config: AxiosRequestConfig<any> = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  return (await (Axios.get<{services: ServiceState[]}>(serviceEndpoint, config))).data.services;
}
