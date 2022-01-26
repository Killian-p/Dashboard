# -*- coding: Utf-8 -*

from typing import Any, Dict, Final
from ...authentication.google import GoogleSession
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class FetchGoogleEmailsDataParams(DataParams):
    pass


class FetchGoogleEmailsDataFetcher(DataFetcher[GoogleSession, FetchGoogleEmailsDataParams]):
    URL: Final[str] = "https://gmail.googleapis.com/gmail/v1/users/me/messages"

    def get(self, session: GoogleSession, params: FetchGoogleEmailsDataParams, request: DataRequest) -> DataResponse:
        query_params: Dict[str, Any] = {
            "maxResults": 15
        }
        query_params.update(request.query_params)
        response = session.get(self.URL, params=query_params)
        response.raise_for_status()
        response_body: Dict[str, Any] = response.json()
        all_emails: Dict[str, Any] = {"messages": [], "nextPageToken": response_body["nextPageToken"]}
        for email_info in response_body["messages"]:
            email_data_response = session.get(f"{self.URL}/{email_info['id']}")
            email_data_response.raise_for_status()
            all_emails["messages"].append(email_data_response.json())
        return DataResponse(all_emails, 200)
