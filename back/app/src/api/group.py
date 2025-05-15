from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select, distinct

from src.models.discipline import DisciplineModel
from src.models.lesson import LessonModel
from src.schemas.group import GroupAddSchema
from src.models.group import GroupModel
from src.api.dependencies import SessionDep


group_router = APIRouter(tags=["Группы"])


@group_router.post(
    "/groups",
    summary="Добавить группу"
)
async def create_group(data: GroupAddSchema, session: SessionDep):
    new_group = GroupModel(
        name=data.name
    )
    session.add(new_group)
    await session.commit()
    return {"ок": True}


@group_router.get(
    "/groups",
    summary="Получить все группы"
)
async def read_groups(session: SessionDep):
    query = select(GroupModel)
    result = await session.execute(query)
    return result.scalars().all()


