# -*- coding: Utf-8 -*

from base64 import urlsafe_b64encode
from email.mime.text import MIMEText
from typing import Any, Dict, Final, TypedDict, cast
from ...authentication.google import GoogleSession
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class SendGoogleEmailsDataParams(DataParams):
    pass


class SendEmailBody(TypedDict):
    to: str
    subject: str
    body: str


class SendGoogleEmailsDataFetcher(DataFetcher[GoogleSession, SendGoogleEmailsDataParams]):
    SEND_URL: Final[str] = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
    PROFILE_URL: Final[str] = "https://gmail.googleapis.com/gmail/v1/users/me/profile"

    def post(self, session: GoogleSession, params: SendGoogleEmailsDataParams, request: DataRequest) -> DataResponse:
        if request.query_body is None:
            return self.error_response(400, "Bad request")
        query_params: Dict[str, Any] = {}
        query_params.update(request.query_params)
        query_body: SendEmailBody = cast(SendEmailBody, request.query_body)
        if any(field not in query_body for field in {"to", "subject", "body"}) \
        or any(not isinstance(value, str) for value in query_body.values()):
            return self.error_response(400, "Bad request")
        message = MIMEText(query_body["body"])
        message["from"] = self.get_email_address(session)
        message["to"] = query_body["to"]
        message["subject"] = query_body["subject"]
        response = session.post(self.SEND_URL, params=query_params, json={"raw": urlsafe_b64encode(message.as_bytes()).decode()})
        response.raise_for_status()
        return DataResponse(response.json(), response.status_code)

    def get_email_address(self, session: GoogleSession) -> str:
        response = session.get(self.PROFILE_URL)
        response.raise_for_status()
        return response.json()["emailAddress"]
