import { useEffect, useState } from 'react';
import { fetchWidgetData } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';
import { CCard } from '@coreui/react';

interface GithubUserInfo {
  avatar_url: string;
  created_at: string;
  followers: number;
  following: number;
  id: number;
  login: string;
  email: string;
}

const GithubUserInfoWidget = ({ id }: { id: number }) => {
  const [userInfoData, setUserInfoData] = useState<GithubUserInfo>();
  const token = useToken();

  const fetchUserInfoData = () => fetchWidgetData<GithubUserInfo>(token.get(), id, 'GET')

  const updateData = () => {
    fetchUserInfoData()
      .then(setUserInfoData)
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
        (userInfoData) ?
          <CCard style={{ width: '24em' }}>
            <div className="m-3">
              <div className="flex justify-center">
                <p className="m-0">Information about</p>
              </div>
              <div className="flex justify-center">    
                <p className="font-bold m-0">{userInfoData.login}</p>
              </div>
              <div className="bg-black h-1 mt-3 mx-3" />
              <div className="mt-3">
                <div className="grid grid-cols-2">
                  <div className="ml-3">
                    <div className="flex justify-center">    
                      <p className="m-1">created at: </p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">user id: </p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">email: </p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">number of followers: </p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">number of people you follow: </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-center">    
                      <p className="m-1">{new Date(userInfoData.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">{userInfoData.id}</p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">{userInfoData.email? userInfoData.email : 'Private'}</p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">{userInfoData.followers}</p>
                    </div>
                    <div className="flex justify-center">    
                      <p className="m-1">{userInfoData.following}</p>
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

export default GithubUserInfoWidget;