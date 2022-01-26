# -*- coding: Utf-8 -*

__all__ = ["OAuthSessionManager"]

from typing import Any, ClassVar, Dict, Final, Generic, Optional, Type, TypeVar
from requests_oauthlib import OAuth2Session
from .session import ServiceOAuthSession


_S = TypeVar("_S", bound=ServiceOAuthSession)


class OAuthSessionManager(Generic[_S]):
    DEFAULT_USER_AGENT: Final[str] = "api.dashboard.backend/1.0.0"
    TOKEN_ENDPOINT: ClassVar[str]
    REFRESH_TOKEN_ENDPOINT: ClassVar[Optional[str]] = None
    CLIENT_ID: ClassVar[Optional[str]] = None
    CLIENT_SECRET: ClassVar[Optional[str]] = None
    BASIC_AUTH: ClassVar[bool] = False
    SessionType: Type[ServiceOAuthSession]

    class Error(Exception):
        pass

    @classmethod
    def new(cls, code: str, redirect_uri: str) -> _S:
        session = OAuth2Session(client_id=cls.CLIENT_ID, redirect_uri=redirect_uri)
        session.headers["User-Agent"] = cls.DEFAULT_USER_AGENT
        try:
            token = session.fetch_token(
                cls.TOKEN_ENDPOINT,
                code=code,
                timeout=10,
                include_client_id=(not cls.BASIC_AUTH),
                client_secret=cls.CLIENT_SECRET
            )
        except Exception as exc:
            raise OAuthSessionManager.Error(str(exc)) from exc
        return cls.from_token(token)

    @classmethod
    def from_token(cls, token: ServiceOAuthSession.Token) -> _S:
        auto_refresh_url: str = cls.REFRESH_TOKEN_ENDPOINT or cls.TOKEN_ENDPOINT
        auto_refresh_kwargs: Dict[str, Any] = {}
        if cls.CLIENT_ID:
            auto_refresh_kwargs["client_id"] = cls.CLIENT_ID
        if cls.CLIENT_SECRET:
            auto_refresh_kwargs["client_secret"] = cls.CLIENT_SECRET
        session = cls.SessionType(client_id=cls.CLIENT_ID, token=token, auto_refresh_url=auto_refresh_url, auto_refresh_kwargs=auto_refresh_kwargs)
        session.client_secret = cls.CLIENT_SECRET
        session.headers["User-Agent"] = cls.DEFAULT_USER_AGENT
        session.headers["Accept"] = "*/*"
        session.headers["Accept-Encoding"] = "gzip, deflate, br"
        return session
