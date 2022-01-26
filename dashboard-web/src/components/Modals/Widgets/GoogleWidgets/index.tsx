import { useState } from 'react';
import { CCard, CCardBody, CCardText, CCardTitle, CButton, CImage, CRow, CCol } from '@coreui/react'
import GoogleEmailListModal from '../../ModalEmailListWidget';
import ModalSendEmailWidget from './../../ModalSendEmailWidget';

const GoogleWidgets = ({getWidgets}: {getWidgets: () => void}) => {

  const [googleEmailListModalWidget, setGoogleEmailListModalWidget] = useState<boolean>(false);
  const [googleSendEmailModalWidget, setGoogleSendEmailModalWidget] = useState<boolean>(false);

  return (
    <div>
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid rounded src="/images/receivedemail.png"/>
            <CCardBody>
              <CCardTitle>List Email</CCardTitle>
              <CCardText>
                List all the mails received by the user connected.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setGoogleEmailListModalWidget(!googleEmailListModalWidget)}>Add this widget</CButton>
              </div>
              <GoogleEmailListModal getWidgets={getWidgets} modalIsVisible={googleEmailListModalWidget} setModalVisible={setGoogleEmailListModalWidget}/>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid rounded src="/images/sendemailwidget.png"/>
            <CCardBody>
              <CCardTitle>Send Email</CCardTitle>
              <CCardText>
                Send an email with the account of the user connected.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setGoogleSendEmailModalWidget(!googleSendEmailModalWidget)}>Add this widget</CButton>
              </div>
              <ModalSendEmailWidget getWidgets={getWidgets} modalIsVisible={googleSendEmailModalWidget} setModalVisible={setGoogleSendEmailModalWidget}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}

export default GoogleWidgets;