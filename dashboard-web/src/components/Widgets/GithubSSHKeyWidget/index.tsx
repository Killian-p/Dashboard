import { useEffect, useState } from 'react';
import { fetchWidgetData } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';
import { CCard } from '@coreui/react';

interface GithubSshKeyResponse {
  created_at: string;
  id: number;
  key: string;
  read_only: boolean;
  title: string;
  verified: boolean;
}

const GithubSSHKeyWidget = ({ id }: { id: number }) => {
  const [sshKey, setSshKey] = useState<GithubSshKeyResponse[]>([]);
  const [sshIndex, setSshIndex] = useState<number>(0);
  const token = useToken();

  const fetchUserInfoData = () => fetchWidgetData<GithubSshKeyResponse[]>(token.get(), id, 'GET')

  const updateData = () => {
    fetchUserInfoData()
      .then(setSshKey)
      .catch(console.error)
  }

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 3600000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div>
      {
        (sshKey) ?
          <CCard style={{ width: '35em', height: '25em'}}>
            <div className="flex m-0">
              <div className="flex justify-center w-1/3">
                <p className="m-2 font-bold">Your keys</p>
              </div>
              <div className="flex justify-center w-2/3">
                <p className="m-2 font-bold">Key info</p>
              </div>
            </div>
            <div className="flex overflow-y">
              <div className="w-1/3 overflow-auto m-3">
                {
                  sshKey.map((element: GithubSshKeyResponse, key: number) => {
                    return (
                      <div key={key} onClick={() => setSshIndex(key)}>
                        <p>{element.title}</p>
                          {
                            (key !== sshKey.length - 1) ?
                              <div className="bg-black h-1 mx-3" />
                              :
                              <></>
                          }
                      </div>
                    )
                  })
                }
              </div>
              <div className='w-2/3 overflow-y m-2'>
                <div className="">
                  <div className="flex">
                    <div className="ml-0">
                      <p>id:</p>
                    </div>
                    <div className="ml-4">
                      <p>{sshKey[sshIndex]?.id}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="ml-0">
                      <p>created_at:</p>
                    </div>
                    <div className="ml-4">
                      <p>{sshKey[sshIndex]?.created_at}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="ml-0">
                      <p>read_only:</p>
                    </div>
                    <div className="ml-4">
                      <p>{(sshKey[sshIndex]?.read_only) ? "true" : "false"}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="ml-0">
                      <p>verified:</p>
                    </div>
                    <div className="ml-4">
                      <p>{(sshKey[sshIndex]?.verified) ? "true" : "false"}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="ml-0">
                      <p>key:</p>
                    </div>
                    <div className="ml-4">
                      <p className='w-50'>{sshKey[sshIndex]?.key}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CCard>
          :
          <></>
      }
    </div>
  )
}

export default GithubSSHKeyWidget;