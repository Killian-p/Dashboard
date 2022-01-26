# -*- coding: Utf-8 -*


import jwt
from time import time
from typing import Any, Dict, TypedDict
from uuid import UUID
from dashboard.settings import SECRET_KEY
from jwt.exceptions import InvalidAlgorithmError, InvalidTokenError


class TokenBody(TypedDict):
    user_id: int
    user_uuid: UUID


class TokenPayload(TokenBody):
    iat: int


class Token:
    @staticmethod
    def create(body: TokenBody) -> str:
        payload: Dict[str, Any] = {
            "user_id": body["user_id"],
            "user_uuid": str(body["user_uuid"]),
            "iat": int(time()),
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    @staticmethod
    def parse(token: str) -> TokenPayload:
        header: Dict[str, str] = jwt.get_unverified_header(token)  # type: ignore
        if header.get("typ") != "JWT":
            raise InvalidTokenError("Invalid token")
        if header.get("alg") != "HS256":
            raise InvalidAlgorithmError("Invalid token")
        body: Dict[str, Any] = jwt.decode(token, SECRET_KEY, algorithms=["HS256"], options={"require": ["iat"]})  # type: ignore
        try:
            user_id = int(body.get("user_id", ""))
            user_uuid = UUID(body.get("user_uuid", ""))
            iat: int = int(body["iat"])
        except (ValueError, TypeError) as exc:
            raise InvalidTokenError("Invalid token") from exc
        return TokenPayload(user_id=user_id, user_uuid=user_uuid, iat=iat)