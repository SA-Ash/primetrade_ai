"""Task schema objects for API validation and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, constr


class TaskBase(BaseModel):
    title: constr(min_length=3, max_length=120)  # type: ignore[valid-type]
    description: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[constr(min_length=3, max_length=120)] = None  # type: ignore[valid-type]
    description: Optional[str] = None
    status: Optional[str] = None  # should be validated by enum on model layer
    due_date: Optional[datetime] = None


class TaskOut(TaskBase):
    id: str = Field(alias="_id")
    owner_id: str
    status: str
    due_date: Optional[datetime] = None
    created_at: datetime

    model_config = {
        "populate_by_name": True,
        "json_encoders": {datetime: lambda v: v.isoformat()},
    }
