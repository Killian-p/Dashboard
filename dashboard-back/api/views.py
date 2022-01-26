from json import loads as json_loads
from functools import wraps
from json.decoder import JSONDecodeError
from traceback import print_exc
from typing import Any, Callable, Dict, Final, Iterator, List, Optional, Sequence, Tuple, TypeVar, Union, overload
from dashboard.settings import DEFAULT_CHARSET
from django.core.exceptions import BadRequest, PermissionDenied
from django.http.request import HttpRequest
from django.http.response import Http404, HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound, HttpResponseServerError, JsonResponse, ResponseHeaders
from django.urls.conf import path as route_path
from django.urls.resolvers import URLPattern
from django.views.decorators.csrf import csrf_exempt
from django.views.defaults import page_not_found, server_error, permission_denied, bad_request
from time import time
from .authentication.linkedin import LinkedIn
from .authentication.session import LoginServiceOAuthSession
from .controller import Controller
from .exceptions import ControllerException
from .models import AuthenticatedDashboardUser
from .types.method import Methods, ALL_METHODS
from .types.request import OAuthLoginRequest, OAuthRegisterRequest, RegisterRequest
from .widgets.base import DataResponse

_Func = TypeVar("_Func", bound=Callable[..., Any])


def _make_error_dict(status_code: int, message: str) -> Dict[str, Any]:
    return {"error": {"code": status_code, "message": message}}


def _make_error_json(status_code: int, message: str) -> JsonResponse:
    return JsonResponse(_make_error_dict(status_code, message), status=status_code)


def _convert_response_to_json_error(response: HttpResponse, message: Optional[str] = None) -> JsonResponse:
    headers = response.headers.copy()
    headers.pop("Content-Type", None)
    headers["Access-Control-Allow-Origin"] = "*"
    error = _make_error_dict(response.status_code, message or response.reason_phrase)
    return JsonResponse(error, status=response.status_code, headers=headers)


def _json_body(request: HttpRequest) -> Any:
    return request.POST or json_loads(request.body.decode(request.encoding or DEFAULT_CHARSET))


class HttpResponseNoContent(HttpResponse):
    status_code = 204

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)


class Routes:
    __all_paths: Dict[str, URLPattern] = {}

    @staticmethod
    def make_urlpatterns() -> List[URLPattern]:
        return list(Routes.__all_paths.values())

    @staticmethod
    def get_urlpatterns() -> Iterator[Tuple[str, URLPattern]]:
        yield from Routes.__all_paths.items()

    @staticmethod
    def path(route: str, *, methods: Sequence[Methods] = ["GET"], name: Optional[str] = None) -> Callable[[_Func], _Func]:
        methods = list(methods)

        if not methods:
            raise ValueError("No methods given")

        all_paths = Routes.__all_paths
        if route in all_paths:
            raise ValueError(f"{route!r} route already defined")

        def decorator(func: _Func, /) -> _Func:
            nonlocal name
            name = name or func.__name__

            if any(path.name == name for path in all_paths.values()):
                raise ValueError(f"{name!r} route name already defined")

            @wraps(func)
            def wrapper(request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
                response: HttpResponse
                if request.method is None:
                    raise BadRequest("Invalid method (None)")
                if request.method == "OPTIONS":
                    return handleOPTIONSRequest(request, methods)
                if request.method not in methods:
                    return _convert_response_to_json_error(HttpResponseNotAllowed(methods))
                try:
                    response = func(request, *args, **kwargs)
                    if response.status_code >= 400 and not isinstance(response, JsonResponse):
                        return _convert_response_to_json_error(response)
                except JSONDecodeError as exc:
                    raise BadRequest from exc
                except ControllerException as exc:
                    print_exc()
                    response = _make_error_json(exc.status_code, exc.message)
                response.headers["Access-Control-Allow-Origin"] = "*"
                return response

            @wraps(wrapper)
            def route_wrapper(*args: Any, **kwargs: Any) -> HttpResponse:
                try:
                    return wrapper(*args, **kwargs)
                except BaseException:
                    print_exc()
                    raise

            all_paths[route] = route_path(route, csrf_exempt(route_wrapper), name=name)
            return func

        return decorator

@Routes.path('')
def index(request: HttpRequest) -> HttpResponse:
    return JsonResponse({
        "version": "1.0.0",
        "api": {
            path.name: f"/{route}"
            for route, path in Routes.get_urlpatterns()
        }
    })


@Routes.path('about.json')
def about_json(request: HttpRequest) -> HttpResponse:
    return JsonResponse(Controller.get_about_json(request.META.get("REMOTE_ADDR"), int(time())))


LOGIN_SESSION_KEY: Final[str] = 'oauth2-login-token'


# def _retrieve_login_session_token(request: HttpRequest) -> Optional[LoginServiceOAuthSession.Token]:
#     return request.session.get(LOGIN_SESSION_KEY)


@overload
def _set_login_session(request: HttpRequest, session: None) -> None:
    ...


@overload
def _set_login_session(request: HttpRequest, session: LoginServiceOAuthSession) -> LoginServiceOAuthSession:
    ...


def _set_login_session(request: HttpRequest, session: Optional[LoginServiceOAuthSession]) -> Optional[LoginServiceOAuthSession]:
    request.session[LOGIN_SESSION_KEY] = session.token if session else None
    return session


@Routes.path('login', methods=["POST"])
def login(request: HttpRequest) -> HttpResponse:
    return JsonResponse(Controller.login_to_account(_json_body(request)))


@Routes.path('login/oauth', methods=["POST"])
def oauth_login(request: HttpRequest) -> HttpResponse:
    request_body: OAuthLoginRequest = _json_body(request)
    if any(field not in request_body for field in {"code", "redirect_uri"}):
        return _convert_response_to_json_error(HttpResponseBadRequest())
    try:
        session: LoginServiceOAuthSession = _set_login_session(request, LinkedIn.new(request_body["code"], request_body["redirect_uri"]))
        user_email: str = session.get_user_email()
    except (LoginServiceOAuthSession.Error, LinkedIn.Error) as exc:
        print_exc()
        raise ControllerException(str(exc), 400) from exc
    return JsonResponse(Controller.login_to_account_no_password(user_email))


@Routes.path('register', methods=["POST"])
def register(request: HttpRequest) -> HttpResponse:
    return JsonResponse(Controller.register_account(_json_body(request)), status=201)


@Routes.path('register/oauth', methods=["POST"])
def oauth_register(request: HttpRequest) -> HttpResponse:
    request_body: OAuthRegisterRequest = _json_body(request)
    if any(field not in request_body for field in {"code", "redirect_uri", "password"}):
        return _convert_response_to_json_error(HttpResponseBadRequest())
    try:
        session = _set_login_session(request, LinkedIn.new(request_body["code"], request_body["redirect_uri"]))
        info = session.get_user_info()
    except (LoginServiceOAuthSession.Error, LinkedIn.Error) as exc:
        print_exc()
        raise ControllerException(str(exc), 400) from exc
    username: str = f"{info.first_name} {info.last_name}"
    password: str = request_body["password"]
    email: str = info.email
    return JsonResponse(Controller.register_account(RegisterRequest(username=username, password=password, email=email)), status=201)


@Routes.path('logout', methods=["POST"])
def logout(request: HttpRequest) -> HttpResponse:
    user: AuthenticatedDashboardUser = Controller.authenticate(request)
    return JsonResponse(Controller.logout_account(user))


@Routes.path('user')
def user_info(request: HttpRequest) -> HttpResponse:
    user: AuthenticatedDashboardUser = Controller.authenticate(request)
    return JsonResponse(Controller.get_user_info(user))


@Routes.path('user/services', methods=["GET", "POST", "DELETE"])
def user_services(request: HttpRequest) -> HttpResponse:
    user: AuthenticatedDashboardUser = Controller.authenticate(request)
    if request.method == "POST":
        return JsonResponse(Controller.add_new_service(user, _json_body(request)), status=201)
    if request.method == "DELETE":
        service: Optional[str] = request.GET.get('name')
        if service is None:
            return _convert_response_to_json_error(HttpResponseBadRequest())
        return JsonResponse(Controller.remove_service(user, service))
    return JsonResponse(Controller.get_user_services(user))


@Routes.path('user/widgets', methods=["GET", "POST", "DELETE", "PATCH"])
def user_widgets(request: HttpRequest) -> HttpResponse:
    user: AuthenticatedDashboardUser = Controller.authenticate(request)
    if request.method == "POST":
        return JsonResponse(Controller.add_new_widget(user, _json_body(request)), status=201)
    if request.method in {"DELETE", "PATCH"}:
        widget_id: Optional[Union[str, int]] = request.GET.get('id')
        try:
            if widget_id is None:
                raise ValueError
            widget_id = int(widget_id)
        except ValueError:
            return _convert_response_to_json_error(HttpResponseBadRequest())
        if request.method == "DELETE":
            return JsonResponse(Controller.remove_widget(user, widget_id))
        Controller.update_widget(user, _json_body(request), widget_id)
        return HttpResponseNoContent()
    service: Optional[str] = request.GET.get("service")
    if service is not None:
        return JsonResponse(Controller.get_user_widgets(user, service))
    return JsonResponse(Controller.get_user_widgets(user))


@Routes.path('user/widgets/data/<int:id>', methods=ALL_METHODS)
def fetch_widget_data(request: HttpRequest, id: int) -> HttpResponse:
    user: AuthenticatedDashboardUser = Controller.authenticate(request)
    widget_data: DataResponse = Controller.fetch_widget_data(user, id, request)
    return JsonResponse(widget_data.body, status=widget_data.status_code, safe=False)


def handler400(request: HttpRequest, exception: Exception) -> HttpResponse:
    if request.path.startswith("/admin"):
        return bad_request(request, exception)
    return _convert_response_to_json_error(HttpResponseBadRequest(), message=str(exception))


def handler403(request: HttpRequest, exception: PermissionDenied) -> HttpResponse:
    if request.path.startswith("/admin"):
        return permission_denied(request, exception)
    return _convert_response_to_json_error(HttpResponseForbidden(), message=str(exception))


def handler404(request: HttpRequest, exception: Http404) -> HttpResponse:
    if request.path.startswith("/admin"):
        return page_not_found(request, exception)
    return _convert_response_to_json_error(HttpResponseNotFound())


def handler500(request: HttpRequest) -> HttpResponse:
    if request.path.startswith("/admin"):
        return server_error(request)
    return _convert_response_to_json_error(HttpResponseServerError())


def handleOPTIONSRequest(request: HttpRequest, allowed_methods: Sequence[Methods]) -> HttpResponse:
    headers = ResponseHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": ", ".join(set((*allowed_methods, "OPTIONS"))),
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers", ""),
        "Access-Control-Max-Age": 86400
    })

    return HttpResponseNoContent(headers=headers)
