# -*- coding: Utf-8 -*

from typing import Any, Dict, Final
from requests.sessions import Session
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class CovidDataParams(DataParams):
    departement: str


class CovidDataFetcher(DataFetcher[Session, CovidDataParams]):
    URL: Final[str] = "https://coronavirusapifr.herokuapp.com/data/departement/{departement}"

    def get(self, session: Session, params: CovidDataParams, request: DataRequest) -> DataResponse:
        query_params: Dict[str, Any] = {}
        query_params.update(request.query_params)
        response = session.get(self.URL.format_map(params), params=query_params)
        response.raise_for_status()
        return DataResponse(response.json(), response.status_code)
