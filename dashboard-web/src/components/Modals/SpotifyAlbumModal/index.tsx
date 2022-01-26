import React, { useState } from 'react';
import { CForm, CModal, CFormLabel, CFormInput, CModalTitle, CModalHeader, CButton } from '@coreui/react';
import { enableWidget } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';

const SpotifyAlbumModal = ({ getWidgets, modalIsVisible, setModalVisible }: { getWidgets: () => void, modalIsVisible: boolean, setModalVisible: (value: boolean) => void }) => {
  const [artist, setArtist] = useState<string>('');
  const [album, setAlbum] = useState<string>('');
  const token = useToken();

  const addSpotifyAlbumWidget = () => {
    enableWidget('spotify', 'media_player', token.get(), { album: album, artist: artist })
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
            <CFormLabel htmlFor="exampleInputEmail1">Artist name</CFormLabel>
            <CFormInput type="text" id="exampleInputEmail1" placeholder="Enter an artist name" value={artist} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)} required/>
          </div>
          <div className="mb-3 m-7">
            <CFormLabel htmlFor="exampleInputEmail1">Album name</CFormLabel>
            <CFormInput type="text" id="exampleInputEmail1" placeholder="Enter an album name" value={album} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlbum(e.target.value)} required/>
          </div>
          <div className="flex justify-center mt-4">
            <CButton color="primary" onClick={addSpotifyAlbumWidget}>
              Add
            </CButton>
          </div>
        </CForm>
      </div>
    </CModal>
  );
}

export default SpotifyAlbumModal;