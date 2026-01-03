"""User schema objects used by the API layer."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, constr

from app.models.user import Role


class UserBase(BaseModel):
    email: EmailStr
    role: Role = Role.USER


class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8)  # type: ignore[valid-type]


class UserUpdate(BaseModel):
    password: Optional[constr(min_length=8)] = None  # type: ignore[valid-type]
    role: Optional[Role] = None


class UserPublic(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime

    model_config = {
        "populate_by_name": True,
        "json_encoders": {datetime: lambda v: v.isoformat()},
    }
