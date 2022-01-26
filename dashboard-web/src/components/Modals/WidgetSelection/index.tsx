import { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import GoogleWidgets from '../Widgets/GoogleWidgets';
import ConnectionlessWidgets from '../Widgets/ConnectionlessWidgets';
import SpotifyWidgets from '../Widgets/SpotifyWidgets';
import GithubWidgets from '../Widgets/GithubWidgets';

import LoginGoogle from './../../login/Google';
import LoginGithub from './../../login/Github';
import LoginSpotify from './../../login/Spotify';
import LoginConnectionLess from './../../login/ConnectionLess';
import { fetchActivatedServices, ServiceState } from '../../../api/service';
import { useToken } from '../../../hooks/useToken';
import { AllServices, disableService } from './../../../api/service';

const WidgetModal = ({ getWidgets, modalIsVisible, setModalVisible }: { getWidgets: () => void, modalIsVisible: boolean, setModalVisible: (value: boolean) => void }) => {
  const [widgetSelected, setWidgetSelected] = useState<string>('Google');
  const [connectedServices, setConnectedServices] = useState<ServiceState[]>([]);
  const token = useToken();

  const getServiceConnected = () => {
    fetchActivatedServices(token.get())
      .then(setConnectedServices)
      .catch(console.error)
  }

  useEffect(() => {
    getServiceConnected();
  }, []);

  const isUserConnected = (serviceName: string) => {
    for (const connectedService of connectedServices) {
      if (connectedService.name === serviceName) {
        return 1;
      }
    }
    return 0;
  }

  const disconnectFromService = (serviceName: AllServices) => {
    disableService(serviceName, token.get())
      .then(() => {
        getServiceConnected();
        getWidgets();
      })
      .catch(console.error)
  }

  return (
    <CModal scrollable size="xl" alignment="center" visible={modalIsVisible} onClose={() => setModalVisible(false)}>
      <CModalHeader>
        <div className="w-full flex justify-around">
          <div>          
            <CButton color="secondary" shape="rounded-pill" onClick={() => setWidgetSelected('Google')}>Google Widgets</CButton>
          </div>
          <div>
            <CButton color="secondary" shape="rounded-pill" onClick={() => setWidgetSelected('Spotify')}>Spotify Widgets</CButton>
          </div>
          <div>
            <CButton color="secondary" shape="rounded-pill" onClick={() => setWidgetSelected('Github')}>Github Widgets</CButton>
          </div>
          <div>
            <CButton color="secondary" shape="rounded-pill" onClick={() => setWidgetSelected('Connectionless')}>Connectionless Widgets</CButton>
          </div>
        </div>
      </CModalHeader>
      <CModalBody>
        {
          (widgetSelected === 'Google') ?
            (!isUserConnected('google')) ?
              <LoginGoogle getWidgets={getWidgets} updateConnection={getServiceConnected}/>
              :
              <GoogleWidgets getWidgets={getWidgets} />
            :
            <></>
        }
        {
          (widgetSelected === 'Spotify') ?
            (!isUserConnected('spotify')) ?
              <LoginSpotify getWidgets={getWidgets} updateConnection={getServiceConnected}/>
              :
              <SpotifyWidgets getWidgets={getWidgets}/>
            :
            <></>
        }
        {
          (widgetSelected === 'Github') ?
            (!isUserConnected('github')) ?
              <LoginGithub getWidgets={getWidgets} updateConnection={getServiceConnected}/>
              :
              <GithubWidgets getWidgets={getWidgets}/>
            :
            <></>
        }
        {
          (widgetSelected === 'Connectionless') ?
            (!isUserConnected('connection_less')) ?
              <LoginConnectionLess getWidgets={getWidgets} updateConnection={getServiceConnected}/>
              :
              <ConnectionlessWidgets getWidgets={getWidgets}/>
            :
            <></>
        }
      </CModalBody>
      <CModalFooter>
          {
            (widgetSelected === 'Google' && isUserConnected('google')) ?
            <CButton color="primary" onClick={() => disconnectFromService('google')}>
                Logout from Google
              </CButton>
              :
              <></>
          }
          {
            (widgetSelected === 'Spotify' && isUserConnected('spotify')) ?
              <CButton color="primary" onClick={() => disconnectFromService('spotify')}>
                Logout from Spotify
              </CButton>
              :
              <></>
          }
          {
            (widgetSelected === 'Github' && isUserConnected('github')) ?
              <CButton color="primary" onClick={() => disconnectFromService('github')}>
                Logout from Github
              </CButton>
              :
              <></>
          }
          {
            (widgetSelected === 'Connectionless' && isUserConnected('connection_less')) ?
              <CButton color="primary" onClick={() => disconnectFromService('connection_less')}>
                Logout from Connectionless
              </CButton>
              :
              <></>
          }
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
      </CModalFooter>
    </CModal>
    );
}

export default WidgetModal;