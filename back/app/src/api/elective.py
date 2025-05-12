
from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.elective import ElectiveModel
from src.schemas.elective import ElectiveAddSchema

elective_router = APIRouter(tags=["Выборные курсы"])


@elective_router.post(
    "/electives",
    summary="Добавить запись на курс по выбору"
)
async def create_elective(data: ElectiveAddSchema, session: SessionDep):
    new_elective = ElectiveModel(
        student_id=data.student_id,
        discipline_id=data.discipline_id
    )
    session.add(new_elective)
    await session.commit()
    return {"ок": True}


@elective_router.get(
    "/electives",
    summary="Получить все записи на курсы по выбору"
)
async def read_electives(session: SessionDep):
    query = select(ElectiveModel)
    result = await session.execute(query)
    return result.scalars().all()

