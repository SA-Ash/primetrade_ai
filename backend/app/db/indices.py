"""Helpers to create MongoDB indexes at startup."""

from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ASCENDING

from app.db.database import get_user_collection, get_task_collection


async def ensure_indexes() -> None:
    user_col: AsyncIOMotorCollection = get_user_collection()
    await user_col.create_index("email", unique=True)
    await user_col.create_index("role")

    task_col: AsyncIOMotorCollection = get_task_collection()
    await task_col.create_index([("owner_id", ASCENDING), ("status", ASCENDING)])
