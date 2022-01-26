import { CModal, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { enableWidget } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';

const GoogleEmailListModal = ({ getWidgets, modalIsVisible, setModalVisible }: { getWidgets: () => void, modalIsVisible: boolean, setModalVisible: (value: boolean) => void }) => {
  const token = useToken();

  const addGoogleEmailListWidget = () => {
    enableWidget('google', 'fetch_emails', token.get(), {})
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
        <p className="mb-2">This widget does not require parameters.</p>
        <div className="flex justify-center mt-4">
          <CButton color="primary" onClick={addGoogleEmailListWidget}>
            Add
          </CButton>
        </div>
      </div>
    </CModal>
  )
}

export default GoogleEmailListModal;