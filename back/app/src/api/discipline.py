from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import joinedload

from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.discipline import DisciplineModel
from src.models.lesson import LessonModel
from src.schemas.discipline import DisciplineAddSchema, DisciplineSchema

discipline_router = APIRouter(tags=["Дисциплины"])


@discipline_router.post(
    "/disciplines",
    summary="Добавить дисциплину"
)
async def create_discipline(data: DisciplineAddSchema, session: SessionDep):
    new_discipline = DisciplineModel(
        name=data.name,
        date_start=data.date_start,
        date_end=data.date_end
    )
    session.add(new_discipline)
    await session.commit()
    return {"ок": True}


@discipline_router.get(
    "/disciplines",
    summary="Получить все дисциплины"
)
async def read_disciplines(session: SessionDep):
    query = select(DisciplineModel)
    result = await session.execute(query)
    return result.scalars().all()


