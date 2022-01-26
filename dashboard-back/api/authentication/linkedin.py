# -*- coding: Utf-8 -*

__all__ = ["LinkedInSession", "LinkedIn"]

from typing import Any, ClassVar, Dict
from requests.models import HTTPError, Response
from dashboard.settings import env
from .manager import OAuthSessionManager
from .session import LoginServiceOAuthSession, ServiceOAuthSession


class LinkedInSession(LoginServiceOAuthSession):
    client_id: str
    client_secret: str

    def get_user_info(self) -> LoginServiceOAuthSession.UserInfo:
        url: str = "https://api.linkedin.com/v2/me"
        params: Dict[str, Any] = {
            "projection": "(firstName,lastName)"
        }

        try:
            response: Response = self.get(url, params=params, timeout=10)
        except Exception as exc:
            raise LinkedInSession.Error(str(exc)) from exc
        try:
            response.raise_for_status()
        except HTTPError as exc:
            raise LinkedInSession.Error(str(exc)) from exc
        body: Dict[str, Any] = response.json()

        def get_name(field: str) -> str:
            nonlocal body
            section: Dict[str, Dict[str, str]] = body[field]
            country: str = str(section["preferredLocale"]["country"])
            language: str = str(section["preferredLocale"]["language"])
            localization: str = f"{language}_{country}"
            return str(section["localized"][localization])

        first_name: str = get_name("firstName")
        last_name: str = get_name("lastName")
        email: str = self.get_user_email()
        return LinkedInSession.UserInfo(first_name=first_name, last_name=last_name, email=email)

    def get_user_email(self) -> str:
        url: str = "https://api.linkedin.com/v2/emailAddress"
        params: Dict[str, Any] = {
            "q": "members",
            "projection": "(elements*(handle~))"
        }

        try:
            response: Response = self.get(url, params=params, timeout=10)
        except Exception as exc:
            raise LinkedInSession.Error(str(exc)) from exc
        try:
            response.raise_for_status()
        except HTTPError as exc:
            raise LinkedInSession.Error(str(exc)) from exc
        body: Dict[str, Any] = response.json()
        return str(body["elements"][0]["handle~"]["emailAddress"])


class LinkedIn(OAuthSessionManager[LinkedInSession]):
    TOKEN_ENDPOINT: ClassVar[str] = "https://www.linkedin.com/oauth/v2/accessToken"
    CLIENT_ID: ClassVar[str] = env('LINKEDIN_CLIENT_ID')
    CLIENT_SECRET: ClassVar[str] = env('LINKEDIN_CLIENT_SECRET')
    SessionType = LinkedInSession

    @classmethod
    def from_token(cls, token: ServiceOAuthSession.Token) -> LinkedInSession:
        session = super().from_token(token)
        session.headers['Accept'] = "application/json"
        return session
