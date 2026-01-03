"""Admin-only endpoints."""

from typing import List

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_current_admin
from app.crud.task import list_tasks
from app.db.database import get_task_collection
from app.models.user import UserInDB
from app.schemas.task import TaskOut

router = APIRouter(prefix="/v1/admin", tags=["admin"])


@router.get("/tasks", response_model=List[TaskOut])
async def admin_list_tasks(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), admin: UserInDB = Depends(get_current_admin)):
    collection = get_task_collection()
    tasks = await list_tasks(collection, owner_id=None, skip=skip, limit=limit)
    return tasks
