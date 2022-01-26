# -*- coding: Utf-8 -*

from typing import Any, Dict, Final
from ...authentication.github import GithubSession
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class GithubSSHKeyDataParams(DataParams):
    pass


class GithubSSHKeyDataFetcher(DataFetcher[GithubSession, GithubSSHKeyDataParams]):
    URL: Final[str] = "https://api.github.com/user/keys"

    def get(self, session: GithubSession, params: GithubSSHKeyDataParams, request: DataRequest) -> DataResponse:
        query_params: Dict[str, Any] = {}
        query_params.update(request.query_params)
        response = session.get(self.URL, params=query_params, json=request.query_body)
        response.raise_for_status()
        return DataResponse(response.json(), response.status_code)
