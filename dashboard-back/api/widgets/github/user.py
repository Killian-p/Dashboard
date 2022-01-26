# -*- coding: Utf-8 -*

from typing import Any, Dict, Final
from ...authentication.github import GithubSession
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class GithubUserDataParams(DataParams):
    user: str


class GithubUserDataFetcher(DataFetcher[GithubSession, GithubUserDataParams]):
    SELF_USER_URL: Final[str] = "https://api.github.com/user"
    USER_URL: Final[str] = "https://api.github.com/users/{user}"

    def get(self, session: GithubSession, params: GithubUserDataParams, request: DataRequest) -> DataResponse:
        query_params: Dict[str, Any] = {}
        query_params.update(request.query_params)
        response = session.get(self.SELF_USER_URL, params=query_params)
        response.raise_for_status()
        body: Dict[str, Any] = response.json()
        if not params["user"] or params["user"] == body['login']:
            return DataResponse(body, response.status_code)
        response = session.get(self.USER_URL.format_map(params), params=query_params)
        response.raise_for_status()
        return DataResponse(response.json(), response.status_code)
