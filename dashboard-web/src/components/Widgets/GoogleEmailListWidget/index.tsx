import { useState, useEffect } from 'react';
import { CCard } from '@coreui/react';
import { useToken } from '../../../hooks/useToken';
import { fetchWidgetData } from '../../../api/widget';
import { decode } from 'js-base64';

interface EmailHeaders {
  "name": string
  "value": string
}

interface EmailParts {
  "partId": string,
  "mimeType": string,
  "filename": string,
  "headers": EmailHeaders[],
  "body": {
    "size": number,
    "data": string
  }
}

interface EmailListResponse {
  "id": string,
  "threadId": string,
  "labelIds": string[],
  "snippet": string,
  "payload": {
    "partId": string,
    "mimeType": string,
    "filename": string,
    "headers": EmailHeaders[],
    "body": {
      "size": number
    },
    "parts": EmailParts | EmailParts[]
  },
  "sizeEstimate": number,
  "historyId": string,
  "internalDate": string
}

interface EmailResponse {
  messages: EmailListResponse[],
  nextPageToken: string
}

const GoogleEmailListWidget = ({ id }: { id: number }) => {
  const [emailList, setEmailList] = useState<EmailListResponse[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>('');
  const [emailIndex, setEmailIndex] = useState<number>(0);
  const token = useToken();

  const fetchEmailList = (params?: Record<string, any>) => (
    fetchWidgetData<EmailResponse>(token.get(), id, 'GET', params)
  );

  const updateData = () => {
    fetchEmailList()
      .then(response => {
        setEmailList(response.messages);
        setNextPageToken(response.nextPageToken);
      })
      .catch(console.error)
  }

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 600000);
    return () => clearInterval(interval);
  }, []);

  const getValueFromHeaders = (headers: EmailHeaders[], name: string) => {
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].name === name) {
        return headers[i].value;
      }
    }
  }

  const getEmailSender = (sender?: string) => {
    return sender?.slice(0, sender?.indexOf('<'));
  }

  const handleScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      fetchEmailList({ pageToken: nextPageToken })
        .then(response => {
          setNextPageToken(response.nextPageToken);
          setEmailList([...emailList, ...response.messages]);
        })
      .catch(console.error);
    }
  }

  const getEmailParts = (parts: EmailParts | EmailParts[] | undefined): EmailParts | undefined => {
    if (!parts || !Array.isArray(parts)) {
      return parts;
    }
    return parts[0];
  }

  return (
    <div>
      {
        (emailList) ?
          <CCard style={{ width: '40em', height: '25em' }}>
            <div className="flex m-0">
              <div className="flex justify-center w-1/3">
                <p className="m-2 font-bold">Vos mails</p>
              </div>
              <div className="flex justify-center w-2/3">
                <p className="m-2 font-bold">Contenu du mail</p>
              </div>
            </div>
            <div className="flex overflow-auto">
              <div className="w-1/3 overflow-auto m-3" onScroll={handleScroll}>
                {
                  emailList.map((element: EmailListResponse, key: number) => {
                    return (
                      <div key={key} onClick={() => setEmailIndex(key)}>
                        <p className="font-bold">{getEmailSender(getValueFromHeaders(element.payload.headers, 'From'))}</p>
                        <p>{getValueFromHeaders(element.payload.headers, 'Subject')}</p>
                        {
                          (key !== emailList.length - 1) ?
                            <div className="bg-black h-1 mx-3" />
                            :
                            <></>
                        }
                      </div>
                    )
                  })
                }
              </div>
              <div className='w-2/3 overflow-auto m-2'>
                <p>{decode(getEmailParts(emailList[emailIndex]?.payload.parts)?.body.data ?? "")}</p>
              </div>
            </div>
          </CCard>
          :
          <></>
      }
    </div>
  )
}

export default GoogleEmailListWidget;