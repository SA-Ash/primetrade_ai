"""Motor client singleton and helpers to access Mongo collections."""

from functools import lru_cache
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase

from app.core.config import settings

_MONGO_CLIENT: AsyncIOMotorClient | None = None


def _get_client() -> AsyncIOMotorClient:
    global _MONGO_CLIENT  # noqa: PLW0603 (module-level global intended)
    if _MONGO_CLIENT is None:
        _MONGO_CLIENT = AsyncIOMotorClient(settings.mongodb_uri)
    return _MONGO_CLIENT


@lru_cache(maxsize=1)
def get_database() -> AsyncIOMotorDatabase:
    """Return the primary Motor database instance."""
    return _get_client()[settings.database_name]


def get_user_collection() -> AsyncIOMotorCollection[Any]:  # type: ignore[type-var]
    return get_database()["users"]


def get_task_collection() -> AsyncIOMotorCollection[Any]:  # type: ignore[type-var]
    return get_database()["tasks"]
