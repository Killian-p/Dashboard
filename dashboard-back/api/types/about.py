# -*- coding: Utf-8 -*

from __future__ import annotations
from typing import List, Literal, Optional, TypedDict


class AboutJson(TypedDict):
    client: AboutClient
    server: AboutServer


class AboutClient(TypedDict):
    host: Optional[str]


class AboutServer(TypedDict):
    current_time: int
    services: List[AboutService]


class AboutService(TypedDict):
    name: str
    widgets: List[AboutWidget]

    
class AboutWidget(TypedDict):
    name: str
    description: str
    params: List[AboutWidgetConfigParams]


class AboutWidgetConfigParams(TypedDict):
    name: str
    type: WidgetConfigParamType


WidgetConfigParamType = Literal["string", "integer"]
