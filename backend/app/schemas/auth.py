"""Pydantic models for authentication requests/responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, constr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)  # type: ignore[valid-type]
    display_name: Optional[str] = None
    role: Optional[str] = Field(default="user", pattern="^(user|admin)$")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = Field(default="bearer")
    expires_in: int


class RegisterResponse(BaseModel):
    user_id: str
    email: EmailStr
    role: str = "user"
    access: TokenResponse
    created_at: datetime
