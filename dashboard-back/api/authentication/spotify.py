# -*- coding: Utf-8 -*

from typing import ClassVar
from dashboard.settings import env
from .manager import OAuthSessionManager
from .session import ServiceOAuthSession


class SpotifySession(ServiceOAuthSession):
    BASIC_AUTH: ClassVar[bool] = True
    client_id: str
    client_secret: str


class Spotify(OAuthSessionManager[SpotifySession]):
    TOKEN_ENDPOINT: ClassVar[str] = "https://accounts.spotify.com/api/token"
    CLIENT_ID: ClassVar[str] = env('SPOTIFY_CLIENT_ID')
    CLIENT_SECRET: ClassVar[str] = env('SPOTIFY_CLIENT_SECRET')
    BASIC_AUTH: ClassVar[bool] = True
    SessionType = SpotifySession

    @classmethod
    def from_token(cls, token: ServiceOAuthSession.Token) -> SpotifySession:
        session = super().from_token(token)
        session.headers['Accept'] = "application/json"
        return session
