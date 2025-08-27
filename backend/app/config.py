from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URI: str = "postgresql+psycopg2://postgres:11231@localhost:5432/blogdb"
    SQLALCHEMY_ECHO: bool = False
    SECRET_KEY: str = "change-me"
    REDIS_URL: str = "redis://localhost:6379/0"
    CORS_ORIGINS: str = "http://localhost:3000"
    PAGE_SIZE_DEFAULT: int = 10

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
