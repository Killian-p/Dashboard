# -*- coding: Utf-8 -*

from dataclasses import dataclass


@dataclass
class ControllerException(Exception):
    message: str
    status_code: int
