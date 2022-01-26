# -*- coding: Utf-8 -*

from typing import Any, Dict, Final
from requests.sessions import Session
from dashboard.settings import env
from ..base import DataFetcher, DataParams, DataRequest, DataResponse


class WeatherDataParams(DataParams):
    city: str


class WeatherDataFetcher(DataFetcher[Session, WeatherDataParams]):
    URL: Final[str] = "https://api.openweathermap.org/data/2.5/weather"
    WEATHER_APPID: Final[str] = env('WEATHER_APPID')

    def get(self, session: Session, params: WeatherDataParams, request: DataRequest) -> DataResponse:
        query_params: Dict[str, Any] = {
            "q": params["city"],
            "units": "metric",
            "appid": self.WEATHER_APPID
        }
        query_params.update(request.query_params)
        response = session.get(self.URL, params=query_params)
        response.raise_for_status()
        return DataResponse(response.json(), response.status_code)
