from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb+srv://saiashrith2605_db_user:iNn9DiU6kryhuhvg@cluster0.ljood0v.mongodb.net/?appName=Cluster0"
    database_name: str = "primetrade"

    secret_key: str = "change_this_secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
