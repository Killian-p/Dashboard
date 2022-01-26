import { useState, useEffect } from 'react';
import ModalWidget from './../../Modals/WidgetSelection';
import { CButton } from '@coreui/react';
import WeatherWidget from '../../Widgets/WeatherWidget';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import CoronavirusWidget from '../../Widgets/CoronavirusWidget';
import SpotifyAlbumWidget from '../../Widgets/SpotifyAlbumWidget';
import GoogleEmailListWidget from '../../Widgets/GoogleEmailListWidget';
import GoogleSendEmailWidget from './../../Widgets/GoogleSendEmailWidget';
import { useToken } from '../../../hooks/useToken';
import { AllWidgets, fetchActivatedWidgets, updateWidget, disableWidget, WidgetInfo, WidgetPatchBody } from '../../../api/widget';
import { AllServices } from '../../../api/service';
import { MdLogout } from 'react-icons/md';
import { logOutFromBackend } from './../../../api/user';
import { useNavigate } from 'react-router-dom';
import GithubRepoInfoWidget from './../../Widgets/GithubRepoInfoWidget';
import GithubUserInfoWidget from './../../Widgets/GithubUserInfoWidget';
import GithubSSHKeyWidget from './../../Widgets/GithubSSHKeyWidget';

type WidgetComponentsType<S extends AllServices> = {
  [W in AllWidgets<S>]: ({id}: {id: number}) => JSX.Element
}

type ServiceWidgetsType = {
  [S in AllServices]: WidgetComponentsType<S>
}

const ServiceWidgets: ServiceWidgetsType = {
  connection_less: {
    weather: WeatherWidget,
    coronavirus: CoronavirusWidget
  },
  spotify: {
    media_player: SpotifyAlbumWidget
  },
  google: {
    fetch_emails: GoogleEmailListWidget,
    send_email: GoogleSendEmailWidget
  },
  github: {
    repository: GithubRepoInfoWidget,
    user: GithubUserInfoWidget,
    ssh_key: GithubSSHKeyWidget
  }
};

const HomePage = () => {
  const [modalIsVisible, setModalVisible] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<WidgetInfo[]>([]);
  const navigate = useNavigate();
  const token = useToken();

  const onstop = (e: DraggableEvent, data: DraggableData, id: number) => {
    const body: WidgetPatchBody = {
      x: data.x,
      y: data.y
    }
    updateWidget(id, token.get(), body);
  };

  const getWidgets = () => {
    fetchActivatedWidgets(token.get())
      .then(setWidgets)
      .catch(console.error);
  }

  const logout = () => {
    logOutFromBackend(token.get())
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch(console.error);
  }

  const deleteWidget = (widgetId: number) => {
    disableWidget(widgetId, token.get())
      .then(getWidgets)
      .catch(console.error)
  }

  useEffect(() => {
    getWidgets();
  }, []);

  return (
    <div className="h-screen bg-repeat" style={{ backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABnSURBVHja7M5RDYAwDEXRDgmvEocnlrQS2SwUFST9uEfBGWs9c97nbGtDcquqiKhOImLs/UpuzVzWEi1atGjRokWLFi1atGjRokWLFi1atGjRokWLFi1af7Ukz8xWp8z8AAAA//8DAJ4LoEAAlL1nAAAAAElFTkSuQmCC)" }}>
      <div>
        {
          widgets.map((element: WidgetInfo, key: number) => {
            const allWidgets = ServiceWidgets[element.service] ?? {};
            const Component = allWidgets[element.type];
            if (typeof Component === 'undefined') {
              return <div></div>
            }
            return (
              <Draggable
                defaultPosition={{ x: element.x, y: element.y }}
                onStop={(e, data) => onstop(e, data, element.id)}
                key={key}
              >
                <div>
                  <div className="m-0">
                    <CButton color="danger" onClick={() => deleteWidget(element.id)}>
                      x
                    </CButton>
                  </div>
                  <Component id={element.id} />
                </div>
              </Draggable>
            )
          })
        }
      </div>
      <div className="flex justify-center fixed top-5 right-5">
        <CButton shape="rounded-pill" size="lg" onClick={() => logout()}>
          <MdLogout size={30}/>
        </CButton>
      </div>
      <div className="flex justify-center fixed bottom-5 inset-x-0">
        <CButton color="info" size="lg" shape="rounded-pill" onClick={() => setModalVisible(!modalIsVisible)}>+ Add widget</CButton>
        <ModalWidget getWidgets={getWidgets} modalIsVisible={modalIsVisible} setModalVisible={setModalVisible}/>
      </div>
    </div>
  );
}

export default HomePage;