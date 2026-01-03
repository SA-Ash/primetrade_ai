"""Task CRUD endpoints."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status

from app.api.deps import get_current_user
from app.crud.task import create_task, delete_task, get_task, list_tasks, update_task
from app.db.database import get_task_collection
from app.models.user import UserInDB
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate

router = APIRouter(prefix="/v1/tasks", tags=["tasks"])


@router.get("/", response_model=List[TaskOut])
async def read_tasks(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), current_user: UserInDB = Depends(get_current_user)):
    collection = get_task_collection()
    tasks = await list_tasks(collection, owner_id=current_user.id, skip=skip, limit=limit)
    return tasks


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def create_new_task(task_in: TaskCreate, current_user: UserInDB = Depends(get_current_user)):
    collection = get_task_collection()
    task = await create_task(collection, owner_id=current_user.id, title=task_in.title, description=task_in.description)
    return task


@router.get("/{task_id}", response_model=TaskOut)
async def read_task(task_id: str = Path(...), current_user: UserInDB = Depends(get_current_user)):
    collection = get_task_collection()
    task = await get_task(collection, task_id)
    if task is None or (task.owner_id != current_user.id and current_user.role != "admin"):
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskOut)
async def update_existing_task(
    task_id: str = Path(...),
    task_in: TaskUpdate | None = None,
    current_user: UserInDB = Depends(get_current_user),
):
    collection = get_task_collection()
    task = await get_task(collection, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not permitted")
    updated = await update_task(collection, task_id, task_in.model_dump(exclude_unset=True))
    if updated is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_task(task_id: str = Path(...), current_user: UserInDB = Depends(get_current_user)):
    collection = get_task_collection()
    task = await get_task(collection, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not permitted")
    success = await delete_task(collection, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None
