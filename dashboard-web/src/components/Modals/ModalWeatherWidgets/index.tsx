import React, { useState } from 'react';
import { CForm, CModal, CFormLabel, CFormInput, CModalTitle, CModalHeader, CButton } from '@coreui/react';
import { useToken } from '../../../hooks/useToken';
import { enableWidget } from '../../../api/widget';

const WeatherWidgetModal = ({ getWidgets, modalIsVisible, setModalVisible }: { getWidgets: () => void, modalIsVisible: boolean, setModalVisible: (value: boolean) => void }) => {
  const [city, setCity] = useState<string>('');
  const token = useToken();

  const addWeatherWidget = () => {
    enableWidget('connection_less', 'weather', token.get(), { city: city })
      .then(() => getWidgets())
      .catch(console.error)
      .finally(() => setModalVisible(false))
  }

  return (
    <CModal scrollable alignment="center" visible={modalIsVisible} onClose={() => setModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>Widget Information</CModalTitle>
      </CModalHeader>
      <div className="mb-3 m-7">
        <CForm>
          <div>
            <CFormLabel htmlFor="exampleInputEmail1">City</CFormLabel>
            <CFormInput type="text" id="exampleInputEmail1" placeholder="Enter valid city name" value={city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)} required/>
          </div>
          <div className="flex justify-center mt-4">
            <CButton color="primary" onClick={addWeatherWidget}>
              Add
            </CButton>
          </div>
        </CForm>
      </div>
    </CModal>
  );
}

export default WeatherWidgetModal;