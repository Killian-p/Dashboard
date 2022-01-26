# -*- coding: Utf-8 -*

__all__ = ["LoginServiceOAuthSession", "ServiceOAuthSession"]

from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import ClassVar, Optional, TypedDict
from oauthlib.oauth2 import OAuth2Error, TokenExpiredError as OAuth2TokenExpiredError
from requests.models import Response
from requests_oauthlib import OAuth2Session, TokenUpdated as OAuth2TokenUpdated


class ServiceOAuthSession(OAuth2Session, metaclass=ABCMeta):
    Error = OAuth2Error
    TokenExpiredError = OAuth2TokenExpiredError
    TokenUpdated = OAuth2TokenUpdated

    class Token(TypedDict, total=False):
        access_token: str
        token_type: str
        refresh_token: str
        expires_in: int

    BASIC_AUTH: ClassVar[bool] = False

    token: Optional[Token]

    def __init__(  # type: ignore
        self,
        client_id=None,
        client=None,
        auto_refresh_url=None,
        auto_refresh_kwargs=None,
        scope=None,
        redirect_uri=None,
        token=None,
        state=None,
        token_updater=None,
        **kwargs
    ) -> None:
        super().__init__(
            client_id=client_id,
            client=client,
            auto_refresh_url=auto_refresh_url,
            auto_refresh_kwargs=auto_refresh_kwargs,
            scope=scope,
            redirect_uri=redirect_uri,
            token=token,
            state=state,
            token_updater=token_updater,
            **kwargs
        )
        self.client_secret: Optional[str] = None

    def __del__(self) -> None:
        self.close()

    def request(self, method, url, data=None, headers=None, withhold_token=False, **kwargs) -> Response:  # type: ignore
        client_id = kwargs.pop('client_id', self.client_id if self.BASIC_AUTH else None)
        client_secret = kwargs.pop('client_secret', self.client_secret if self.BASIC_AUTH else None)
        return super().request(method, url, data=data, headers=headers, withhold_token=withhold_token, client_id=client_id, client_secret=client_secret, **kwargs)

    # def revoke_token(self, url: str, http_method: str = "POST", timeout: Optional[int] = None, **kwargs: Any) -> None:
    #     token: Optional[ServiceOAuthSession.Token] = self.token  # type: ignore
    #     if not token:
    #         return

    #     def revoke_token(token: ServiceOAuthSession.Token, type_hint: Literal["access_token", "refresh_token"]) -> None:
    #         prepared: Tuple[str, Dict[str, Any], Dict[str, Any]] = self._client.prepare_token_revocation_request(
    #             url,
    #             token[type_hint],
    #             token_type_hint=type_hint,
    #             **kwargs
    #         )
    #         used_url, headers, body = prepared
    #         self.request()
    #     self.token = {}  # type: ignore


class LoginServiceOAuthSession(ServiceOAuthSession):
    @dataclass
    class UserInfo:
        first_name: str
        last_name: str
        email: str

    @abstractmethod
    def get_user_info(self) -> UserInfo:
        raise NotImplementedError

    @abstractmethod
    def get_user_email(self) -> str:
        raise NotImplementedError
