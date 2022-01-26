import Axios, { AxiosRequestConfig, Method } from "axios";
import { getBackendEndpoint } from "./endpoint";

export type AllWidgetsByService = {
  'spotify': {
    'media_player': {
      'album': string
      'artist': string
    }
  }
  'github': {
    'repository': {
      repository: string
      organization: string
    }
    'user': {
      user: string
    }
    'ssh_key' : {}
  }
  'google': {
    'fetch_emails': {}
    'send_email': {}
  }
  'connection_less': {
    'weather': {
      'city': string
    }
    'coronavirus': {
      'departement': string
    }
  }
}

export type AllWidgets<Service extends keyof AllWidgetsByService> = keyof AllWidgetsByService[Service]

export type WidgetParams<Service extends keyof AllWidgetsByService, Widget extends AllWidgets<Service>> = AllWidgetsByService[Service][Widget]

export interface WidgetPatchBody {
  x?: number
  y?: number
}

export interface WidgetCreated {
  result: string;
  id: number;
}

export const enableWidget = async <Service extends keyof AllWidgetsByService, Widget extends AllWidgets<Service>>(
  service: Service, widget: Widget, token: string, params: WidgetParams<Service, Widget>): Promise<WidgetCreated> => {
    const widgetEndpoint = getBackendEndpoint('/user/widgets');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const data = {
      service: service,
      type: widget,
      params: JSON.stringify(params)
    };

    return (await Axios.post<WidgetCreated>(widgetEndpoint, data, config)).data
}

export interface WidgetDeleted {
  result: string;
}
  
export const disableWidget = async (widgetId: number, token: string): Promise<WidgetDeleted> => {
  const widgetEndpoint = getBackendEndpoint('/user/widgets');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      id: widgetId
    }
  }

  return (await (Axios.delete<WidgetDeleted>(widgetEndpoint, config))).data;
}

export const updateWidget = async (widgetId: number, token: string, params: WidgetPatchBody): Promise<void> => {
  const widgetEndpoint = getBackendEndpoint('/user/widgets');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      id: widgetId
    }
  }

  await (Axios.patch<any>(widgetEndpoint, params, config));
}

export interface WidgetInfo {
  id: number;
  service: string;
  type: string;
  params: Record<string, any>;
  x: number;
  y: number;
}

interface AllWidgetsResponse {
  widgets: WidgetInfo[]
}

export const fetchActivatedWidgets = async (token: string): Promise<WidgetInfo[]> => {
  const widgetEndpoint = getBackendEndpoint('/user/widgets');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  return (await Axios.get<AllWidgetsResponse>(widgetEndpoint, config)).data.widgets;
}

export const fetchWidgetData = async <T = any>(token: string, widgetId: number, method: Method, params?: Record<string, any>, body?: Record<string, any>): Promise<T> => {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
  }
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const config: AxiosRequestConfig<typeof body> = {
    url: getBackendEndpoint(`/user/widgets/data/${widgetId}`),
    params: params,
    headers: headers,
    data: body,
    method: method
  }
  return (await Axios.request<T>(config)).data;
}
