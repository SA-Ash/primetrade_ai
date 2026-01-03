"""Task CRUD helpers with ownership enforcement."""

from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from app.models.task import TaskInDB, TaskStatus


async def create_task(collection: AsyncIOMotorCollection, *, owner_id: str, title: str, description: str | None = None, due_date: datetime | None = None) -> TaskInDB:
    doc = TaskInDB(
        _id=None,
        title=title,
        description=description,
        owner_id=owner_id,
        status=TaskStatus.PENDING,
        due_date=due_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    result = await collection.insert_one(doc.model_dump(by_alias=True, exclude={"id"}, exclude_none=True))
    doc.id = str(result.inserted_id)
    return doc


async def get_task(collection: AsyncIOMotorCollection, task_id: str) -> Optional[TaskInDB]:
    if not ObjectId.is_valid(task_id):
        return None
    data = await collection.find_one({"_id": ObjectId(task_id)})
    if data:
        data["_id"] = str(data["_id"])
        return TaskInDB.model_validate(data)
    return None


async def list_tasks(
    collection: AsyncIOMotorCollection,
    *,
    owner_id: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> List[TaskInDB]:
    query = {}
    if owner_id is not None:
        query["owner_id"] = owner_id
    cursor = collection.find(query).skip(skip).limit(limit).sort("created_at", -1)
    tasks: List[TaskInDB] = []
    async for data in cursor:
        data["_id"] = str(data["_id"])
        tasks.append(TaskInDB.model_validate(data))
    return tasks


async def update_task(collection: AsyncIOMotorCollection, task_id: str, update_data: dict) -> Optional[TaskInDB]:
    if not ObjectId.is_valid(task_id):
        return None
    update_data["updated_at"] = datetime.utcnow()
    data = await collection.find_one_and_update(
        {"_id": ObjectId(task_id)},
        {"$set": update_data},
        return_document=True,
    )
    if data:
        data["_id"] = str(data["_id"])
        return TaskInDB.model_validate(data)
    return None


async def delete_task(collection: AsyncIOMotorCollection, task_id: str) -> bool:
    if not ObjectId.is_valid(task_id):
        return False
    result = await collection.delete_one({"_id": ObjectId(task_id)})
    return result.deleted_count == 1
