"""User CRUD helpers."""

from datetime import datetime
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorCollection

from app.core.security import get_password_hash, verify_password
from app.models.user import Role, UserInDB


async def get_by_email(collection: AsyncIOMotorCollection, email: str) -> Optional[UserInDB]:
    data = await collection.find_one({"email": email})
    if data:
        data["_id"] = str(data["_id"])
        return UserInDB.model_validate(data)
    return None


async def create_user(collection: AsyncIOMotorCollection, email: str, password: str, role: Role = Role.USER) -> UserInDB:
    user = UserInDB(
        _id=None,  # will be replaced by MongoDB ObjectId
        email=email,
        hashed_password=get_password_hash(password),
        role=role,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    result = await collection.insert_one(user.model_dump(by_alias=True, exclude={"id"}, exclude_none=True))
    user.id = str(result.inserted_id)
    return user


async def authenticate(collection: AsyncIOMotorCollection, email: str, password: str) -> Optional[UserInDB]:
    user = await get_by_email(collection, email)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
