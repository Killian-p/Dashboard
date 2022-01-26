# -*- coding: Utf-8 -*

import hashlib
import hmac
from dashboard.settings import SECRET_KEY
from operator import truth

SECRET_KEY_ENCODED: bytes = SECRET_KEY.encode()

class Password:
    @staticmethod
    def encrypt(password: str) -> str:
        return hmac.new(SECRET_KEY_ENCODED, password.encode(), hashlib.sha256).hexdigest()

    @staticmethod
    def is_same(p1: str, p2: str) -> bool:
        return truth(hmac.compare_digest(p1, p2))
