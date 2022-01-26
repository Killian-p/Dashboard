import { useState } from 'react';
import { CRow, CCol, CCard, CCardBody, CImage, CCardText, CButton, CCardTitle } from '@coreui/react';
import ModalGithubRepoInfoWidget from './../../ModalGithubRepoInfoWidget';
import ModalGithubUserInfoWidget from './../../ModalGithubUserInfoWidget';
import ModalGithubSSHKeyWidget from './../../ModalGithubSSHKeyWidget';

const GithubWidgets = ({ getWidgets }: { getWidgets: () => void }) => {
  const [githubRepoInfoModalWidget, setGithubRepoInfoModalWidget] = useState<boolean>(false);
  const [githubUserInfoModalWidget, setGithubUserInfoModalWidget] = useState<boolean>(false);
  const [githubKeySSHModalWidget, setGithubKeySSHModalWidget] = useState<boolean>(false);

  return (
    <div>
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid rounded src="/images/githubrepositoryinfo.png"/>
            <CCardBody>
              <CCardTitle>Repository info</CCardTitle>
              <CCardText>
                Give some information about the repository of your choice.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setGithubRepoInfoModalWidget(!githubRepoInfoModalWidget)}>Add this widget</CButton>
              </div>
              <ModalGithubRepoInfoWidget getWidgets={getWidgets} modalIsVisible={githubRepoInfoModalWidget} setModalVisible={setGithubRepoInfoModalWidget}/>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid rounded src="/images/githubuserinfo.png"/>
            <CCardBody>
              <CCardTitle>User info</CCardTitle>
              <CCardText>
                Give some information about the user of your choice.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setGithubUserInfoModalWidget(!githubUserInfoModalWidget)}>Add this widget</CButton>
              </div>
              <ModalGithubUserInfoWidget getWidgets={getWidgets} modalIsVisible={githubUserInfoModalWidget} setModalVisible={setGithubUserInfoModalWidget}/>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid rounded src="/images/githubsshkeywidget.png"/>
            <CCardBody>
              <CCardTitle>Key SSH</CCardTitle>
              <CCardText>
                A widgets that display your personal key SSH.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setGithubKeySSHModalWidget(!githubKeySSHModalWidget)}>Add this widget</CButton>
              </div>
              <ModalGithubSSHKeyWidget getWidgets={getWidgets} modalIsVisible={githubKeySSHModalWidget} setModalVisible={setGithubKeySSHModalWidget}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default GithubWidgets;