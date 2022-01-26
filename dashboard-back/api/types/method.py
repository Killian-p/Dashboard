# -*- coding: Utf-8 -*

from typing import Final, Literal, Tuple

Methods = Literal["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"]

ALL_METHODS: Final[Tuple[Methods, ...]] = tuple(getattr(Methods, "__args__"))
