"""User data model definitions."""

from enum import Enum
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"


class UserInDB(BaseModel):
    """Representation of a user document stored in MongoDB."""

    id: str | None = Field(default=None, alias="_id")
    email: EmailStr
    hashed_password: str
    role: Role = Role.USER
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "json_encoders": {datetime: lambda v: v.isoformat()},
    }


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    role: Role

    model_config = {
        "json_encoders": {datetime: lambda v: v.isoformat()},
    }
