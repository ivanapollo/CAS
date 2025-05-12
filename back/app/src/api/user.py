from datetime import datetime

from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.user import UserModel
from src.schemas.user import UserAddSchema

user_router = APIRouter(tags=["Пользоваетель"])


@user_router.post(
    "/users",
    summary="Добавить пользователя"
)
async def create_user(data: UserAddSchema, session: SessionDep):
    # Проверка уникальности логина
    query = select(UserModel).where(UserModel.login == data.login)
    result = await session.execute(query)
    if result.scalar():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким логином уже существует"
        )

    new_user = UserModel(
        name=data.name,
        surname=data.surname,
        patronymic=data.patronymic,
        role=data.role,
        login=data.login,
        password=data.password)
    print(data)
    session.add(new_user)
    await session.commit()
    return {"ок": True}


@user_router.get(
    "/users",
    summary="Получить всех пользователей"
)
async def read_users(session: SessionDep):
    query = select(UserModel)
    result = await session.execute(query)
    return result.scalars().all()
