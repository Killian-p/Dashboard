import React, { useState } from 'react';
import { CCard, CForm, CFormLabel, CFormInput, CRow, CCol, CButton } from '@coreui/react';
import { useToken } from '../../../hooks/useToken';
import { fetchWidgetData } from '../../../api/widget';

const GoogleSendEmailWidget = ({id}: { id: number}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>();
  const [subjectEmail, setSubjectEmail] = useState<string>();
  const [bodyEmail, setBodyEmail] = useState<string>();
  const token = useToken();

  
  const sendEmail = () => {
    const data = {
      "to": recipientEmail,
      "subject": subjectEmail,
      "body": bodyEmail,
    }
    fetchWidgetData<any>(token.get(), id, 'POST', {}, data)
      .catch(console.error)
  }

  return (
    <div>
      <CCard style={{ width: '28em' }}>
        <CForm className="m-4 needs-validation">
          <CRow className="mb-3">
            <CFormLabel className="col-sm-2 col-form-label">To: </CFormLabel>
            <CCol sm={10}>
              <CFormInput className="col-sm-2 col-form-label" type="email" placeholder="Enter recipient" value={recipientEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setRecipientEmail(e.target.value)} required/>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel className="col-sm-3 col-form-label">Subject: </CFormLabel>
            <CCol sm={9}>
              <CFormInput className="col-sm-2 col-form-label" type="text" placeholder="Enter subject" value={subjectEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>):void => setSubjectEmail(e.target.value)} required/>
            </CCol>
          </CRow>
          <textarea rows={13} cols={38} className="border-2	resize rounded-md" placeholder="Message" value={bodyEmail} onChange={(e) => setBodyEmail(e.target.value)} />
          <div className="flex justify-center mt-3">
            <CButton color="primary" onClick={sendEmail}>
              Send Email
            </CButton>
          </div>
        </CForm>
      </CCard>
    </div>
  );
}

export default GoogleSendEmailWidget;