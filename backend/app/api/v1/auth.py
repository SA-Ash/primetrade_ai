"""Authentication endpoints."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.core.logging import get_logger
from app.db.database import get_user_collection
from app.schemas.auth import LoginRequest, RegisterRequest, RegisterResponse, TokenResponse
from app.crud.user import authenticate, create_user, get_by_email
from app.services.token import mint_access_token

logger = get_logger(__name__)

router = APIRouter(prefix="/v1/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest):
    collection = get_user_collection()
    existing = await get_by_email(collection, data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Convert string role to Role enum
    from app.models.user import Role
    role = Role.ADMIN if data.role == "admin" else Role.USER
    
    user = await create_user(collection, email=data.email, password=data.password, role=role)
    token = await mint_access_token(sub=user.email, role=user.role)
    return RegisterResponse(
        user_id=user.id,
        email=user.email,
        role=user.role,
        access=TokenResponse(access_token=token, expires_in=60 * 60),
        created_at=datetime.utcnow(),
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    collection = get_user_collection()
    user = await authenticate(collection, data.email, data.password)
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = await mint_access_token(sub=user.email, role=user.role)
    return TokenResponse(access_token=token, expires_in=60 * 60)
