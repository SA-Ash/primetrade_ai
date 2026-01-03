"""Task data model definitions."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, constr


class TaskStatus(str):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskInDB(BaseModel):
    id: str | None = Field(default=None, alias="_id")
    title: constr(min_length=3, max_length=120)  # type: ignore[valid-type]
    description: Optional[str] = None
    owner_id: str
    status: str = TaskStatus.PENDING
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "json_encoders": {datetime: lambda v: v.isoformat()},
    }
