# -*- coding: Utf-8 -*

from __future__ import annotations
from typing import Any, Dict, List, Literal, TypedDict


# POST /login
# POST /login/oauth
class LoginResponse(TypedDict):
    access_token: str


# POST /register
# POST /register/oauth
class RegisterResponse(TypedDict):
    access_token: str


# POST /logout
class LogoutResponse(TypedDict):
    result: Literal["success"]


# GET /user
class UserInfoResponse(TypedDict):
    username: str
    email: str


# GET /user/services
class UserServicesResponse(TypedDict):
    services: List[Service]


# POST /user/services
class NewServiceResponse(TypedDict):
    result: Literal["success"]


# DELETE /user/services
class RemoveServiceResponse(TypedDict):
    result: Literal["success"]


# GET /user/widgets
class UserWidgetsResponse(TypedDict):
    widgets: List[WidgetWithService]


# GET /user/widgets?service={service}
class UserWidgetForServiceResponse(TypedDict):
    widgets: List[Widget]


# POST /user/widgets
class NewWdigetResponse(TypedDict):
    result: Literal["success"]
    id: int


# DELETE /user/widgets
class RemoveWidgetResponse(TypedDict):
    result: Literal["success"]


#########################  Utility Classes #########################
class Service(TypedDict):
    name: str


class Widget(TypedDict):
    id: int
    type: str
    x: int
    y: int
    params: Dict[str, Any]


class WidgetWithService(Widget):
    service: str