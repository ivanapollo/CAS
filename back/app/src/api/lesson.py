from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.discipline import DisciplineModel
from src.models.lesson import LessonModel
from src.schemas.lesson import LessonAddSchema

lesson_router = APIRouter(tags=["Занятия"])


@lesson_router.post(
    "/lessons",
    summary="Добавить занятие"
)
async def create_lesson(data: LessonAddSchema, session: SessionDep):
    new_lesson = LessonModel(
        discipline_id=data.discipline_id,
        date=data.date,
        time_start=data.time_start,
        time_end=data.time_end,
        group_id=data.group_id,
        teacher_id=data.teacher_id,
        subgroup=data.subgroup,
        type=data.type
    )
    session.add(new_lesson)
    await session.commit()
    return {"ок": True}

@lesson_router.get(
    "/lessons",
    summary="Получить все занятия"
)
async def read_lessons(session: SessionDep):
    query = select(LessonModel)
    result = await session.execute(query)
    return result.scalars().all()


