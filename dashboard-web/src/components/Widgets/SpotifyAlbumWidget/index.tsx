import { useState, useEffect } from 'react';
import { CCard } from '@coreui/react';
import ReactPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { fetchWidgetData } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';

interface SpotifyArtist {
  'external_url': {
    'spotif': string;
  },
  'href': string;
  'id': string;
  'name': string;
  'type': string;
  'uri': string;
}

interface SpotifyAlbumResponse {
  'artist': SpotifyArtist[];
  'available_arkets': string[];
  'disc_number': number
  'duration_ms': number
  'explicit': boolean
  'external_urls': {
    'spotify': string
    }
  'href': string
  'id': string
  'is_local': boolean
  'name': string
  'preview_url': string
  'track_number': number
  'type': string
  'uri': string

}

const SpotifyAlbumWidget = ({ id }: {id: number}) => {
  const [albumSongs, setAlbumSongs] = useState<SpotifyAlbumResponse[]>([]);
  const [songIndex, setSongIndex] = useState<number>(0);
  const token = useToken();

  const fetchAlbumSongs = () => fetchWidgetData<{items: SpotifyAlbumResponse[]}>(token.get(), id, 'GET');
  
  useEffect(() => {
    fetchAlbumSongs()
      .then(response => setAlbumSongs(response.items))
      .catch(console.error)
  }, []);

  return (
    <div>
      {
        (albumSongs) ? 
          <CCard style={{ width: '22em', height: '24em' }}>
            <div className="bg-blue-500 text-center">
              <p className="mb-3 mt-3">Song playing: {albumSongs[songIndex]?.name}</p>
            </div>
            <ReactPlayer src={albumSongs[songIndex]?.preview_url}/>
            <div className="overflow-auto">
              {
                albumSongs.map((element: SpotifyAlbumResponse, key: number) => {
                  return (
                    <div className="text-center" key={key} onClick={() => setSongIndex(key)}>
                      <p className="mb-3 mt-3">{element.name}</p>
                    </div>
                  )
                })
              }
            </div>
          </CCard>
          :
          <></>
      }
    </div>
  )
}

export default SpotifyAlbumWidget;