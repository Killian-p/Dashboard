import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CForm, CFormLabel, CFormInput, CButton } from '@coreui/react';
import { enableWidget } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';

const ModalGithubUserInfoWidget = ({ getWidgets, modalIsVisible, setModalVisible }: { getWidgets: () => void, modalIsVisible: boolean, setModalVisible: (value: boolean) => void }) => {
  const [userName, setUserName] = useState<string>('');
  const token = useToken();

  const addGithubUserRepoInfoWidget = () => {
    enableWidget('github', 'user', token.get(), { user: userName })
      .then(getWidgets)
      .catch(console.error)
      .finally(() => {setModalVisible(false)})
  }

  return (
    <CModal scrollable alignment="center" visible={modalIsVisible} onClose={() => setModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>Widget Information</CModalTitle>
      </CModalHeader>
      <div className="mb-3 m-7">
        <CForm>
          <div>
            <CFormLabel htmlFor="exampleInputEmail1">User name</CFormLabel>
            <CFormInput type="text" id="exampleInputEmail1" placeholder="Enter a user name" value={userName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} required />
          </div>
          <div className="flex justify-center mt-4">
            <CButton color="primary" onClick={addGithubUserRepoInfoWidget}>
              Add
            </CButton>
          </div>
        </CForm>
      </div>
    </CModal>
  )
}

export default ModalGithubUserInfoWidget;