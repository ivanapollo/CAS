from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase


DATABASE_NAME = "sup.db"
DATABASE = "sqlite+aiosqlite:///" + DATABASE_NAME # полная строка для подключения
engin = create_async_engine(DATABASE, echo=True)   # инициализируем новый движок, создаем бд в проекте
async_session = async_sessionmaker(engin, expire_on_commit=False)


# генератор сессии, создание контекстного менеджера, отдает сессию, передеает контроль
async def get_session():
    async with async_session() as session:
        yield session


# Все метаданные таблицы (поля, свзи), хранятся тут
class Base(DeclarativeBase):
    pass

