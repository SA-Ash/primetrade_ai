"""Token service wrapper around core.security helpers for mint/verify including refresh stubs."""

from datetime import timedelta
from typing import Any, Dict

from app.core.config import settings
from app.core.security import create_access_token, decode_token


async def mint_access_token(sub: str, role: str) -> str:
    payload: Dict[str, Any] = {"sub": sub, "role": role}
    return create_access_token(payload, expires_delta_minutes=settings.access_token_expire_minutes)


verify_access_token = decode_token  # re-export
