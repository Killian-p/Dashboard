# -*- coding: Utf-8 -*

from typing import Any, Dict, Final
from ...authentication.github import GithubSession
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class GithubRepositoryDataParams(DataParams):
    repository: str
    organization: str


class GithubRepositoryDataFetcher(DataFetcher[GithubSession, GithubRepositoryDataParams]):
    USER_URL: Final[str] = "https://api.github.com/user"
    REPO_URL: Final[str] = "https://api.github.com/repos/{owner}/{repo}"

    def get(self, session: GithubSession, params: GithubRepositoryDataParams, request: DataRequest) -> DataResponse:
        query_params: Dict[str, Any] = {}
        query_params.update(request.query_params)
        repo_params = {"owner": params["organization"] or self.get_user_login(session), "repo": params["repository"]}
        response = session.get(self.REPO_URL.format_map(repo_params), params=query_params)
        response.raise_for_status()
        return DataResponse(response.json(), response.status_code)

    def get_user_login(self, session: GithubSession) -> str:
        response = session.get(self.USER_URL)
        response.raise_for_status()
        return response.json()["login"]
