import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "OKR API"
    debug: bool = True

    database_url: str = "sqlite+aiosqlite:///./okr.db"

    cors_origins: list[str] = [
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ]
    cors_allow_all: bool = True

    default_page_size: int = 10
    max_page_size: int = 1000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
