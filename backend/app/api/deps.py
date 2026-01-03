"""Common dependency functions used across routers."""

from typing import Annotated, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from app.core.logging import get_logger
from app.core.security import decode_token
from app.db.database import get_user_collection
from app.models.user import Role, UserInDB
from app.crud.user import get_by_email

logger = get_logger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/login")


async def get_token_payload(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_token(token)
    except JWTError as exc:
        logger.info("JWT decode failed", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


async def get_current_user(
    payload: Annotated[dict, Depends(get_token_payload)],
):
    email: Optional[str] = payload.get("sub")
    if not email:
        raise HTTPException(status_code=400, detail="Malformed token")

    collection = get_user_collection()
    user = await get_by_email(collection, email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def get_current_admin(
    user: Annotated[UserInDB, Depends(get_current_user)],
):
    if user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Insufficient privileges")
    return user
