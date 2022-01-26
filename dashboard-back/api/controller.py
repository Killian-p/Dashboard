# -*- coding: Utf-8 -*

from __future__ import annotations

import json
from copy import deepcopy
from jwt.exceptions import PyJWTError
from typing import Any, Dict, Final, List, Optional, Union, overload
from uuid import UUID, uuid4 as uuid_generate_random
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.http.request import HttpRequest

from .authentication.manager import OAuthSessionManager
from .authentication.session import ServiceOAuthSession
from .exceptions import ControllerException
from .models import WIDGET_CONFIG, AuthenticatedDashboardUser, DashboardService, DashboardUser, DashboardWidget
from .password import Password
from .token import Token, TokenBody
from .types.about import AboutJson, AboutService
from .types.request import (
    LoginRequest,
    NewServiceRequest,
    NewWidgetRequest,
    RegisterRequest,
    UpdateWidgetRequest
)
from .types.response import (
    LoginResponse,
    LogoutResponse,
    NewServiceResponse,
    NewWdigetResponse,
    RegisterResponse,
    RemoveServiceResponse,
    RemoveWidgetResponse,
    UserInfoResponse,
    UserServicesResponse,
    UserWidgetForServiceResponse,
    UserWidgetsResponse
)
from .widgets.base import DataResponse


class Controller:
    ABOUT_SERVICES: Final[List[AboutService]] = [
        {
            "name": service,
            "widgets": [
                {
                    "name": widget_name,
                    "description": widget_config["description"],
                    "params": [
                        {
                            "name": param_name,
                            "type": param_type
                        }
                        for param_name, param_type in widget_config["params"].items()
                    ]
                }
                for widget_name, widget_config in WIDGET_CONFIG[service].items()
            ]
        }
        for service in DashboardService.Name
    ]

    @staticmethod
    def get_about_json(host: Optional[str], current_time: int) -> AboutJson:
        return {
            "client": {
                "host": host
            },
            "server": {
                "current_time": int(current_time),
                "services": deepcopy(Controller.ABOUT_SERVICES)
            }
        }

    @staticmethod
    def login_to_account(request: LoginRequest) -> LoginResponse:
        if any(field not in request for field in {"email", "password"}) \
        or any(not isinstance(value, str) for value in request.values()):
            raise ControllerException("Bad request", 400)
        email = request["email"]
        password = Password.encrypt(request["password"])
        try:
            user: DashboardUser = DashboardUser.objects.get(email=email)
            if not Password.is_same(password, user.password):
                raise ControllerException("Wrong email and/or password", 401)
        except ObjectDoesNotExist:
            raise ControllerException("Wrong email and/or password", 401) from None
        if user.uuid is None:
            user.uuid = uuid_generate_random()
            user.save()
        return LoginResponse(access_token=Token.create(TokenBody(user_id=user.id, user_uuid=user.uuid)))

    @staticmethod
    def login_to_account_no_password(email: str) -> LoginResponse:
        try:
            user: DashboardUser = DashboardUser.objects.get(email=email)
        except ObjectDoesNotExist:
            raise ControllerException("Account not created", 401) from None
        if user.uuid is None:
            user.uuid = uuid_generate_random()
            user.save()
        return LoginResponse(access_token=Token.create(TokenBody(user_id=user.id, user_uuid=user.uuid)))

    @staticmethod
    def register_account(request: RegisterRequest) -> RegisterResponse:
        if any(field not in request for field in {"username", "password", "email"}) \
        or any(not isinstance(value, str) for value in request.values()):
            raise ControllerException("Bad request", 400)

        if DashboardUser.exists(request["email"]):
            raise ControllerException("Account already exists", 409) from None

        uuid: UUID = uuid_generate_random()
        user: DashboardUser = DashboardUser.objects.create(
            username=request["username"],
            password=Password.encrypt(request["password"]),
            email=request["email"],
            uuid=uuid
        )
        return RegisterResponse(access_token=Token.create(TokenBody(user_id=user.id, user_uuid=uuid)))

    @staticmethod
    def authenticate(request: HttpRequest) -> AuthenticatedDashboardUser:
        user: AuthenticatedDashboardUser
        if "Authorization" not in request.headers:
            raise ControllerException("Unauthorized", 401)
        auth: str = request.headers["Authorization"]
        if len(auth.split()) != 2:
            raise ControllerException("Unauthorized", 401)
        auth_type, token = auth.split()
        if auth_type.lower() != "bearer":
            raise ControllerException("Unauthorized", 401)
        try:
            body = Token.parse(token)
        except PyJWTError as exc:
            raise ControllerException("Invalid token", 401) from exc
        try:
            user = AuthenticatedDashboardUser.objects.get(pk=body["user_id"], uuid=body["user_uuid"])
        except ObjectDoesNotExist:
            raise ControllerException("Invalid token", 401) from None
        return user

    @staticmethod
    def logout_account(user: AuthenticatedDashboardUser) -> LogoutResponse:
        user.uuid = None
        user.save()
        return LogoutResponse(result="success")

    @staticmethod
    def get_user_info(user: AuthenticatedDashboardUser) -> UserInfoResponse:
        return UserInfoResponse(username=user.username, email=user.email)

    @staticmethod
    def get_user_services(user: AuthenticatedDashboardUser) -> UserServicesResponse:
        return UserServicesResponse(services=[
            {
                "name": service.name
            }
            for service in user.services.all()
            if service.is_enabled()
        ])

    @staticmethod
    def add_new_service(user: AuthenticatedDashboardUser, request: NewServiceRequest) -> NewServiceResponse:
        if any(field not in request for field in {"name"}) \
        or any(not isinstance(value, str) for value in request.values()):
            raise ControllerException("Bad request", 400)
        try:
            service: DashboardService = user.services.get_or_create(name=request["name"])[0]
        except ValidationError as exc:
            raise ControllerException("Unprocessable entity", 422) from exc
        oauth_session = service.oauth_session
        if oauth_session:
            if any(field not in request for field in {"code", "redirect_uri"}) \
            or any(not isinstance(value, str) or not value for value in request.values()):
                raise ControllerException("Bad request", 400)
            try:
                service.token = oauth_session.new(request["code"], request["redirect_uri"]).token
                service.save()
            except OAuthSessionManager.Error as exc:
                raise ControllerException(str(exc), 400) from exc
        return {"result": "success"}

    @staticmethod
    def remove_service(user: AuthenticatedDashboardUser, service_name: str) -> RemoveServiceResponse:
        service: DashboardService
        try:
            service = user.services.get(name=service_name)
        except ObjectDoesNotExist:
            raise ControllerException("Unknown service", 404) from None
        service.token = None
        service.save()
        return {"result": "success"}

    @overload
    @staticmethod
    def get_user_widgets(user: AuthenticatedDashboardUser) -> UserWidgetsResponse:
        ...

    @overload
    @staticmethod
    def get_user_widgets(user: AuthenticatedDashboardUser, service: str) -> UserWidgetForServiceResponse:
        ...

    @staticmethod
    def get_user_widgets(user: AuthenticatedDashboardUser, service: Optional[str] = None) -> Union[UserWidgetsResponse, UserWidgetForServiceResponse]:
        if service is not None:
            try:
                service = DashboardService.Name(service)
            except ValueError as exc:
                raise ControllerException("Unknown service", 404) from exc
            try:
                user_service: DashboardService = user.services.get(name=service)
                if not user_service.is_enabled():
                    raise ObjectDoesNotExist
                return UserWidgetForServiceResponse(widgets=[
                    {
                        "id": widget.id,
                        "type": widget.type,
                        "x": widget.x,
                        "y": widget.y,
                        "params": widget.params
                    }
                    for widget in user_service.widgets.all()
                ])
            except ObjectDoesNotExist:
                return UserWidgetForServiceResponse(widgets=[])
        return UserWidgetsResponse(widgets=[
            {
                "id": widget.id,
                "service": service.name,
                "type": widget.type,
                "x": widget.x,
                "y": widget.y,
                "params": widget.params
            }
            for service in user.services.all() if service.is_enabled()
            for widget in service.widgets.all()
        ])

    @staticmethod
    def add_new_widget(user: AuthenticatedDashboardUser, request: NewWidgetRequest) -> NewWdigetResponse:
        if any(field not in request for field in {"service", "type", "params"}) \
        or any(not isinstance(value, str) for value in request.values()):
            raise ControllerException("Bad request", 400)
        try:
            params: Dict[str, Any] = json.loads(request["params"])
        except json.JSONDecodeError as exc:
            raise ControllerException("Bad request", 400) from exc
        if not isinstance(params, dict):
            raise ControllerException("Bad request", 400)
        service: DashboardService
        try:
            service = user.services.get(name=request["service"])
        except ObjectDoesNotExist:
            raise ControllerException("Unknown service", 404) from None
        try:
            widget: DashboardWidget = service.widgets.create(type=request["type"], params=params)
        except ValidationError as exc:
            raise ControllerException("Unprocessable entity", 422) from exc
        return NewWdigetResponse(result="success", id=widget.id)

    @staticmethod
    def remove_widget(user: AuthenticatedDashboardUser, widget_id: int) -> RemoveWidgetResponse:
        try:
            widget: DashboardWidget = user.widgets.get(id=widget_id)
            if not widget.service.is_enabled():
                raise ControllerException("Service disabled", 401)
        except ObjectDoesNotExist:
            raise ControllerException("Unknown widget", 404) from None
        widget.delete()
        return RemoveWidgetResponse(result="success")

    @staticmethod
    def update_widget(user: AuthenticatedDashboardUser, request: UpdateWidgetRequest, widget_id: int) -> None:
        try:
            x: Optional[int] = int(request["x"]) if "x" in request else None
            y: Optional[int] = int(request["y"]) if "y" in request else None
        except ValueError as exc:
            raise ControllerException("Bad request", 400) from exc
        try:
            widget: DashboardWidget = user.widgets.get(id=widget_id)
        except ObjectDoesNotExist:
            raise ControllerException("Unknown widget", 404) from None
        if x is not None:
            widget.x = x
        if y is not None:
            widget.y = y
        try:
            widget.save()
        except ValidationError as exc:
            raise ControllerException("Unprocessable entity", 422) from exc

    @staticmethod
    def fetch_widget_data(user: AuthenticatedDashboardUser, widget_id: int, request: HttpRequest) -> DataResponse:
        try:
            widget: DashboardWidget = user.widgets.get(id=widget_id)
        except ObjectDoesNotExist:
            raise ControllerException("Unknown widget", 404)
        service: DashboardService = widget.service
        oauth_session_manager = service.oauth_session
        request_session: Optional[ServiceOAuthSession] = None
        if oauth_session_manager:
            token: Optional[ServiceOAuthSession.Token] = service.token
            if token is None:
                raise ControllerException("Service disabled", 401)

            def token_updater(token: ServiceOAuthSession.Token) -> None:
                service.token = token
                service.save()

            request_session = oauth_session_manager.from_token(token)
            request_session.token_updater = token_updater
        widget_data: DataResponse
        try:
            widget_data = widget.data(request, request_session)
        except ServiceOAuthSession.TokenExpiredError as exc:
            raise ControllerException("Service session expired", 401) from exc
        except DashboardWidget.DataFetchError as exc:
            raise ControllerException(str(exc), exc.status_code) from exc
        return widget_data
