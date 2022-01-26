# -*- coding: Utf-8 -*

from typing import ClassVar
from dashboard.settings import env
from .manager import OAuthSessionManager
from .session import ServiceOAuthSession


class GoogleSession(ServiceOAuthSession):
    client_id: str
    client_secret: str


class Google(OAuthSessionManager[GoogleSession]):
    TOKEN_ENDPOINT: ClassVar[str] = "https://oauth2.googleapis.com/token"
    CLIENT_ID: ClassVar[str] = env('GOOGLE_CLIENT_ID')
    CLIENT_SECRET: ClassVar[str] = env('GOOGLE_CLIENT_SECRET')
    SessionType = GoogleSession

    @classmethod
    def from_token(cls, token: ServiceOAuthSession.Token) -> GoogleSession:
        session = super().from_token(token)
        session.headers['Accept'] = "application/json"
        return session
