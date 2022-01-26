import { useState } from 'react';
import { CCard, CCardBody, CCardText, CCardTitle, CRow, CCol, CButton, CImage } from '@coreui/react'
import WeatherWidgetModal from '../../ModalWeatherWidgets';
import CoronavirusWidgetModal from '../../ModalCoronavirusWidget';

const ConnectionlessWidgets = ({getWidgets}: {getWidgets: () => void}) => {
  const [weatherModalIsVisible, setWeatherModalVisible] = useState<boolean>(false);
  const [coronavirusModalIsVisible, setCoronavirusModalVisible] = useState<boolean>(false);

  return (
    <div>
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid src="/images/weatherimg.png" />
            <CCardBody>
              <CCardTitle>
                Weather
              </CCardTitle>
              <CCardText>
                Enter a city and you will have the weather for your city.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setWeatherModalVisible(!weatherModalIsVisible)}>Add this widget</CButton>
              </div>
              <WeatherWidgetModal getWidgets={getWidgets} modalIsVisible={weatherModalIsVisible} setModalVisible={setWeatherModalVisible}/>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid src="/images/covidwidget.png" />
            <CCardBody>
              <CCardTitle>
                Covid19
              </CCardTitle>
              <CCardText>
                Select a departement and you will have the information about the number of case for the departement in one week.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setCoronavirusModalVisible(!coronavirusModalIsVisible)}>Add this widget</CButton>
              </div>
              <CoronavirusWidgetModal getWidgets={getWidgets} modalIsVisible={coronavirusModalIsVisible} setModalVisible={setCoronavirusModalVisible}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}
  
  export default ConnectionlessWidgets;