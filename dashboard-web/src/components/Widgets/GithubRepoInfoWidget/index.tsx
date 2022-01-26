import { useEffect, useState } from 'react';
import { fetchWidgetData } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';
import { CCard } from '@coreui/react';

interface GithubRepoInfo {
  disabled: boolean;
  forks: number;
  forks_count: number;
  id: number;
  language: string;
  name: string;
  open_issues: number;
  open_issues_count: number;
  owner: {
    id: number;
    login: string;
  }
  size: number;
  ssh_url: string;
  subscribers_count: number;
  visibility: string;
  stargazers_count: number;
}

const GithubRepoInfoWidget = ({ id }: { id: number }) => {
  const [repoInfoData, setRepoInfoData] = useState<GithubRepoInfo>();
  const token = useToken();
  
  const fetchRepoInfoData = () => fetchWidgetData<GithubRepoInfo>(token.get(), id, 'GET');

  const updateData = () => {
    fetchRepoInfoData()
      .then(setRepoInfoData)
      .catch(console.error)
  }

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 600000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div>
      {
        (repoInfoData) ?
          <CCard style={{ width: '40em' }}>
            <div className="m-3">
              <div className="flex justify-center">
                <p className="m-0">Information about repository:</p>
              </div>
              <div className="flex justify-center">    
                <p className="font-bold m-0">{repoInfoData.name}</p>
              </div>
              <div className="bg-black h-1 mt-3 mx-3" />
              <div className="mt-3">
                <div className="grid grid-cols-2">
                  <div>
                    <div className="flex justify-center">
                      <p>Repository Information</p>
                    </div>
                    <div className="bg-black h-1 mx-3" />
                    <div className="mt-2">
                      <div className="grid grid-cols-2">
                        <div>
                          <div className="flex justify-center">
                            <p>forks:</p>
                          </div>
                          <div className="flex justify-center">
                            <p>stars:</p>
                          </div>
                          <div className="flex justify-center">
                            <p>langage:</p>
                          </div>
                          <div className="flex justify-center">
                            <p>size:</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-center">
                            <p>{repoInfoData.forks_count}</p>
                          </div>
                          <div className="flex justify-center">
                            <p>{repoInfoData.stargazers_count}</p>
                          </div>
                          <div className="flex justify-center">
                            <p>{repoInfoData.language}</p>
                          </div>
                          <div className="flex justify-center">
                            <p>{repoInfoData.size}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-center">
                      <p>Owner Information</p>
                    </div>
                    <div className="bg-black h-1 mx-3" />
                    <div className="mt-2">
                      <div className="grid grid-cols-2">
                        <div>
                          <div className="flex justify-center">
                            <p>id:</p>
                          </div>
                          <div className="flex justify-center">
                            <p>login:</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-center">
                            <p>{repoInfoData.owner.id}</p>
                          </div>
                          <div className="flex justify-center">
                            <p>{repoInfoData.owner.login}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-black h-1 mx-3" />
                <div>
                  <div className="flex justify-center">
                    <p className="m-1">SSH url:</p>
                  </div>
                  <div className="flex justify-center">
                    <p className="m-1">{repoInfoData.ssh_url}</p>
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

export default GithubRepoInfoWidget;