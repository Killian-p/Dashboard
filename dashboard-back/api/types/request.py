# -*- coding: Utf-8 -*

from typing import TypedDict


# POST /login
class LoginRequest(TypedDict):
    email: str
    password: str


# POST /login/oauth
class OAuthLoginRequest(TypedDict):
    code: str
    redirect_uri: str


# POST /register
class RegisterRequest(TypedDict):
    username: str
    password: str
    email: str


# POST /register/oauth
class OAuthRegisterRequest(TypedDict):
    password: str
    code: str
    redirect_uri: str


# POST /user/services
class NewServiceRequest(TypedDict, total=False):
    name: str
    code: str
    redirect_uri: str


# POST /user/widgets
class NewWidgetRequest(TypedDict):
    service: str
    type: str
    params: str


# PATCH /user/widgets?id={id}
class UpdateWidgetRequest(TypedDict, total=False):
    x: str
    y: str
