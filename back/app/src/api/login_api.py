from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.user import UserModel
from src.schemas.user import UserLoginSchema

# Создание роутера
router = APIRouter(prefix="/api/login", tags=["users"])


@router.post("/")
async def login(data: UserLoginSchema, session: SessionDep):
    """Проверка наличия пользователя в системе"""
    query = select(UserModel).where(
        UserModel.login == data.login,
        UserModel.password == data.password
    )

    user = await session.execute(query)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль")

    return {"ок": True}


