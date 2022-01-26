import { useState } from 'react';
import { CCard, CCardBody, CCardText, CCardTitle, CRow, CCol, CButton, CImage } from '@coreui/react'
import SpotifyAlbumModal from '../../SpotifyAlbumModal';

const SpotifyWidgets = ({getWidgets}: {getWidgets: () => void}) => {

  const [spotifyAlbumModalWidget, setSpotifyAlbumModalWidget] = useState<boolean>(false);

  return (
    <div>
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
        <CCol xs>
          <CCard style={{ width: '18rem' }}>
            <CImage fluid src="/images/spotifywidget.png" />
            <CCardBody>
              <CCardTitle>
                Album tracklist
              </CCardTitle>
              <CCardText>
                Enter an album name and an artist name and you will get the album from the artist.
              </CCardText>
              <div className="flex justify-center mt-2">
                <CButton onClick={() => setSpotifyAlbumModalWidget(!spotifyAlbumModalWidget)}>Add this widget</CButton>
              </div>
              <SpotifyAlbumModal getWidgets={getWidgets} modalIsVisible={spotifyAlbumModalWidget} setModalVisible={setSpotifyAlbumModalWidget}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default SpotifyWidgets;