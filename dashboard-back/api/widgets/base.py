# -*- coding: Utf-8 -*

from dataclasses import dataclass, field
from typing import Any, Dict, Generic, List, Optional, TypeVar, TypedDict, Union
from requests.sessions import Session


@dataclass
class DataResponse:
    body: Union[Dict[str, Any], List[Any]]
    status_code: int


@dataclass
class DataRequest:
    query_params: Dict[str, Any] = field(default_factory=dict)
    query_body: Optional[Dict[str, Any]] = None


class DataParams(TypedDict):
    pass


_D = TypeVar("_D", bound=DataParams)
_S = TypeVar("_S", bound=Session)


class DataFetcher(Generic[_S, _D]):
    def get(self, session: _S, params: _D, request: DataRequest) -> DataResponse:
        raise NotImplementedError

    def head(self, session: _S, params: _D, request: DataRequest) -> DataResponse:
        raise NotImplementedError

    def post(self, session: _S, params: _D, request: DataRequest) -> DataResponse:
        raise NotImplementedError

    def put(self, session: _S, params: _D, request: DataRequest) -> DataResponse:
        raise NotImplementedError

    def delete(self, session: _S, params: _D, request: DataRequest) -> DataResponse:
        raise NotImplementedError

    def patch(self, session: _S, params: _D, request: DataRequest) -> DataResponse:
        raise NotImplementedError

    @staticmethod
    def error_response(status_code: int, message: str) -> DataResponse:
        return DataResponse({"error": {"code": status_code, "message": message}}, status_code)
