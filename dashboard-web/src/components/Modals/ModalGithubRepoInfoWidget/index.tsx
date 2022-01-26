import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CForm, CFormLabel, CFormInput, CFormCheck, CButton } from '@coreui/react';
import { enableWidget } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';

const ModalGithubRepoInfoWidget = ({ getWidgets, modalIsVisible, setModalVisible }: { getWidgets: () => void, modalIsVisible: boolean, setModalVisible: (value: boolean) => void }) => {
  const [repoName, setRepoName] = useState<string>('');
  const [orgaName, setOrgaName] = useState<string>('');
  const [isOrga, setIsOrga] = useState<boolean>(false);
  const token = useToken();

  const addGithubRepoInfoWidget = () => {
    enableWidget('github', 'repository', token.get(), { repository: repoName, organization: orgaName })
      .then(getWidgets)
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
            <CFormLabel htmlFor="exampleInputEmail1">Organization name</CFormLabel>
            <CFormInput type="text" id="exampleInputEmail1" placeholder="Enter an organization name" value={orgaName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgaName(e.target.value)} required={isOrga ? true : false} disabled={isOrga ? false : true}/>
            <CFormCheck className="mb-3" label="Is repository in organization ?" onChange={() => setIsOrga(!isOrga)}/>
          </div>
          <div>
            <CFormLabel htmlFor="exampleInputEmail1">Repository name</CFormLabel>
            <CFormInput type="text" id="exampleInputEmail1" placeholder="Enter an repossitory name" value={repoName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepoName(e.target.value)} required />
          </div>
          <div className="flex justify-center mt-4">
            <CButton color="primary" onClick={addGithubRepoInfoWidget}>
              Add
            </CButton>
          </div>
        </CForm>
      </div>
    </CModal>
  )
}

export default ModalGithubRepoInfoWidget;