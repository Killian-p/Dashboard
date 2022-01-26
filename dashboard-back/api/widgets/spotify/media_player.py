# -*- coding: Utf-8 -*

from typing import Any, Dict, Final, Optional
from ...authentication.spotify import SpotifySession
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class MediaPlayerDataParams(DataParams):
    album: str
    artist: str


class MediaPlayerDataFetcher(DataFetcher[SpotifySession, MediaPlayerDataParams]):
    URL: Final[str] = "https://api.spotify.com/v1/search"

    def get(self, session: SpotifySession, params: MediaPlayerDataParams, request: DataRequest) -> DataResponse:
        query_params: Dict[str, Any] = {
            "q": params["album"],
            "type": "track",
            "limit": 10
        }
        query_params.update(request.query_params)
        response = session.get(self.URL, params=query_params)
        response.raise_for_status()
        album: Optional[str] = self.find_album_link_by_artist(response.json(), params["artist"])
        if album is None:
            return DataResponse({"error": {"status": 404, "message": "Not found"}}, 404)
        response = session.get(album)
        return DataResponse(response.json()["tracks"], response.status_code)

    def find_album_link_by_artist(self, response: Dict[str, Any], artist: str) -> Optional[str]:
        for result in filter(lambda r: r["album"]["album_type"] == "album", response["tracks"]["items"]):
            if any(owner["name"].lower() == artist.lower() for owner in result["album"]["artists"]):
                return result["album"]["href"]
        return None
