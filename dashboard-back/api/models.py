from __future__ import annotations
import json

from contextlib import suppress
from uuid import UUID
from requests.sessions import Session
from dashboard.settings import DEFAULT_CHARSET
from django.http.request import HttpRequest
from django.http.response import HttpResponseNotAllowed
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db.models import Model
from django.db.models.deletion import CASCADE
from django.db.models.enums import TextChoices
from django.db.models.fields import CharField, EmailField, IntegerField, UUIDField
from django.db.models.fields.json import JSONField
from django.db.models.fields.related import ForeignKey
from django.db.models.manager import Manager
from django.db.models.query import QuerySet
from enum import Enum, auto, unique
from functools import reduce
from requests.models import HTTPError
from typing import Any, Callable, ClassVar, Dict, Iterable, Optional, Tuple, Type, TypeVar, TypedDict, Union
from .authentication.manager import OAuthSessionManager
from .authentication.session import ServiceOAuthSession
from .authentication.github import Github as GithubSessionManager
from .authentication.google import Google as GoogleSessionManager
from .authentication.spotify import Spotify as SpotifySessionManager
from .types.about import WidgetConfigParamType
from .types.method import ALL_METHODS, Methods
from .widgets.base import DataFetcher, DataRequest, DataResponse
from .widgets.connection_less.weather import WeatherDataFetcher, WeatherDataParams
from .widgets.connection_less.coronavirus import CovidDataFetcher, CovidDataParams
from .widgets.google.fetch_emails import FetchGoogleEmailsDataFetcher, FetchGoogleEmailsDataParams
from .widgets.google.send_email import SendGoogleEmailsDataFetcher, SendGoogleEmailsDataParams
from .widgets.github.ssh_key import GithubSSHKeyDataFetcher, GithubSSHKeyDataParams
from .widgets.github.repository import GithubRepositoryDataFetcher, GithubRepositoryDataParams
from .widgets.github.user import GithubUserDataFetcher, GithubUserDataParams
from .widgets.spotify.media_player import MediaPlayerDataFetcher, MediaPlayerDataParams
from django_cryptography.fields import PickledField

_T = TypeVar("_T", bound=Model, covariant=True)


class RelatedManager(Manager[_T]):
    related_val: Tuple[int, ...]

    def add(self, *objs: Union[_T, int], bulk: bool = ...) -> None:
        ...

    def remove(self, *objs: Union[_T, int], bulk: bool = ...) -> None:
        ...

    def set(self, objs: Union[QuerySet[_T], Iterable[Union[_T, int]]], *, bulk: bool = ..., clear: bool = ...) -> None:
        ...

    def clear(self) -> None:
        ...


class DashboardModelBase(Model):
    class Meta:
        abstract = True

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.full_clean()
        super().save(*args, **kwargs)


class DashboardUser(DashboardModelBase):
    id: int
    username: str = CharField(max_length=100)
    password: str = CharField(max_length=256)
    email: str = EmailField(max_length=254, unique=True)
    uuid: Optional[UUID] = UUIDField(null=True, default=None, blank=True)

    objects: ClassVar[Manager["DashboardUser"]]
    services: RelatedManager[DashboardService]

    def __str__(self) -> str:
        return f"{self.email} ({self.username})"

    @property
    def widgets(self) -> QuerySet[DashboardWidget]:
        return reduce(lambda fst, snd: fst | snd, (service.widgets.all() for service in self.services.all()), QuerySet(DashboardWidget))

    @classmethod
    def exists(cls, email: str) -> bool:
        try:
            cls.objects.get(email=email)
        except ObjectDoesNotExist:
            return False
        return True


class AuthenticatedDashboardUser(DashboardUser):
    class Meta:
        proxy = True

    objects: ClassVar[Manager["AuthenticatedDashboardUser"]]


class DashboardService(DashboardModelBase):
    @unique
    class Name(TextChoices, Enum):
        def _generate_next_value_(name: str, /, *args: Any) -> str:  # type: ignore
            return name.lower()

        SPOTIFY = auto()
        GOOGLE = auto()
        GITHUB = auto()
        CONNECTION_LESS = auto()

    id: int
    user: DashboardUser = ForeignKey(DashboardUser, on_delete=CASCADE, db_index=False, related_name="services")
    name: str = CharField(max_length=max(len(p) for p in Name), choices=Name.choices)
    token: Optional[ServiceOAuthSession.Token] = PickledField(null=True, default=None, blank=True)

    objects: ClassVar[Manager["DashboardService"]]
    widgets: RelatedManager[DashboardWidget]

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.label} service ({self.id})"

    def clean(self) -> None:
        super().clean()
        try:
            self.name = DashboardService.Name(self.name).value
        except ValueError as exc:
            raise ValidationError(str(exc)) from exc

    @property
    def label(self) -> str:
        return DashboardService.Name(self.name).label

    @property
    def oauth_session(self) -> Optional[Type[OAuthSessionManager[ServiceOAuthSession]]]:
        return SERVICE_SESSION_MANAGER.get(self.name)

    def is_enabled(self) -> bool:
        return self.oauth_session is None or self.token is not None


class DashboardWidget(DashboardModelBase):
    id: int
    service: DashboardService = ForeignKey(DashboardService, on_delete=CASCADE, db_index=False, related_name="widgets")
    type: str = CharField(max_length=20)
    params: Dict[str, Any] = JSONField(blank=True)
    x: int = IntegerField(default=0)
    y: int = IntegerField(default=0)

    objects: ClassVar[Manager["DashboardWidget"]]

    def __str__(self) -> str:
        return f"Widget of type {self.type!r} (id={self.id}) from {self.service.name} service"

    def clean(self) -> None:
        super().clean()
        service: DashboardService = self.service
        widget_type: str = self.type
        widget_params: Dict[str, Any] = self.params
        if widget_type not in WIDGET_CONFIG[service.name]:
            raise ValidationError(f"{service.name} service has no widget {widget_type!r}")
        for param_name, param_type in WIDGET_CONFIG[service.name][widget_type]["params"].items():
            if param_name not in widget_params:
                raise ValidationError(f"Missing {param_name!r} parameter for widget {widget_type!r}")
            if not isinstance(widget_params[param_name], WIDGET_CONFIG_PARAM_TYPE[param_type]):
                raise ValidationError(f"Invalid parameter type for {param_name!r} parameter")

    def data(self, django_request: HttpRequest, session: Optional[ServiceOAuthSession] = None) -> DataResponse:
        self.full_clean()
        data_fetcher: DataFetcher[Session, Any] = WIDGET_CONFIG[self.service.name][self.type]["fetcher"]
        used_session: Session = session or Session()
        body: Optional[Dict[str, Any]] = django_request.POST or None
        if not body and django_request.body:
            with suppress(json.JSONDecodeError):
                body = json.loads(django_request.body.decode(django_request.encoding or DEFAULT_CHARSET))
        data_request = DataRequest(django_request.GET, body)
        try:
            fetcher_func = WIDGET_DATA_FETCHER[django_request.method.upper()]
        except KeyError as exc:
            raise DashboardWidget.DataFetchError('Not allowed', HttpResponseNotAllowed.status_code) from exc
        try:
            response: DataResponse = fetcher_func(data_fetcher, used_session, self.params, data_request)
        except NotImplementedError:
            raise DashboardWidget.DataFetchError('Not allowed', HttpResponseNotAllowed.status_code) from None
        except ServiceOAuthSession.Error as exc:
            raise DashboardWidget.DataFetchError(exc.description, exc.status_code) from exc
        except HTTPError as exc:
            if exc.response is None:
                raise DashboardWidget.DataFetchError(str(exc), 400) from exc
            raise DashboardWidget.DataFetchError(str(exc), exc.response.status_code) from exc
        return response

    class DataFetchError(Exception):
        def __init__(self, message: str, status_code: int) -> None:
            super().__init__(message)
            self.status_code: int = status_code


class _WidgetConfig(TypedDict):
    description: str
    params: Dict[str, WidgetConfigParamType]
    fetcher: DataFetcher[Any, Any]


WIDGET_CONFIG_PARAM_TYPE: Dict[WidgetConfigParamType, type] = {
    "string": str,
    "integer": int
}

WIDGET_CONFIG_PARAM_TYPE_NAME: Dict[type, WidgetConfigParamType] = {v: k for k, v in WIDGET_CONFIG_PARAM_TYPE.items()}


def _make_widget_config_params(data_type: Type[Any]) -> Dict[str, WidgetConfigParamType]:
    return {k: WIDGET_CONFIG_PARAM_TYPE_NAME[v] for k, v in data_type.__annotations__.items()}


WIDGET_CONFIG: Dict[str, Dict[str, _WidgetConfig]] = {
    DashboardService.Name.SPOTIFY: {
        "media_player": {
            "description": "Spotify album media player",
            "params": _make_widget_config_params(MediaPlayerDataParams),
            "fetcher": MediaPlayerDataFetcher(),
        }
    },
    DashboardService.Name.GITHUB: {
        "repository": {
            "description": "Github repository overview",
            "params": _make_widget_config_params(GithubRepositoryDataParams),
            "fetcher": GithubRepositoryDataFetcher(),
        },
        "user": {
            "description": "Github user profile overview",
            "params": _make_widget_config_params(GithubUserDataParams),
            "fetcher": GithubUserDataFetcher(),
        },
        "ssh_key": {
            "description": "List all the user's public SSH keys on Github",
            "params": _make_widget_config_params(GithubSSHKeyDataParams),
            "fetcher": GithubSSHKeyDataFetcher(),
        }
    },
    DashboardService.Name.GOOGLE: {
        "fetch_emails": {
            "description": "Fetch all emails from Gmail account",
            "params": _make_widget_config_params(FetchGoogleEmailsDataParams),
            "fetcher": FetchGoogleEmailsDataFetcher(),
        },
        "send_email": {
            "description": "Send an email with Gmail account",
            "params": _make_widget_config_params(SendGoogleEmailsDataParams),
            "fetcher": SendGoogleEmailsDataFetcher(),
        }
    },
    DashboardService.Name.CONNECTION_LESS: {
        "weather": {
            "description": "Current weather info",
            "params": _make_widget_config_params(WeatherDataParams),
            "fetcher": WeatherDataFetcher()
        },
        "coronavirus": {
            "description": "COVID-19 contamination rate by day",
            "params": _make_widget_config_params(CovidDataParams),
            "fetcher": CovidDataFetcher()
        }
    }
}

if any(service not in WIDGET_CONFIG for service in DashboardService.Name):
    raise KeyError(f"Missing widget for the following services: {', '.join(filter(lambda s: s not in WIDGET_CONFIG, DashboardService.Name))}")

SERVICE_SESSION_MANAGER: Dict[str, Type[OAuthSessionManager[ServiceOAuthSession]]] = {
    DashboardService.Name.GITHUB: GithubSessionManager,
    DashboardService.Name.GOOGLE: GoogleSessionManager,
    DashboardService.Name.SPOTIFY: SpotifySessionManager
}

WIDGET_DATA_FETCHER: Dict[Methods, Callable[[DataFetcher[Session, Any], Session, Any, DataRequest], DataResponse]] = {
    "GET": lambda fetcher, session, params, request: fetcher.get(session, params, request),
    "HEAD": lambda fetcher, session, params, request: fetcher.head(session, params, request),
    "POST": lambda fetcher, session, params, request: fetcher.post(session, params, request),
    "PUT": lambda fetcher, session, params, request: fetcher.put(session, params, request),
    "DELETE": lambda fetcher, session, params, request: fetcher.delete(session, params, request),
    "PATCH": lambda fetcher, session, params, request: fetcher.patch(session, params, request),
}

if any(method not in WIDGET_DATA_FETCHER for method in ALL_METHODS):
    raise KeyError(f"Missing method for the following data fetcher: {', '.join(filter(lambda m: m not in WIDGET_DATA_FETCHER, ALL_METHODS))}")
