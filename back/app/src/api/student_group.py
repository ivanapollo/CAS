from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.student_group import StudentGroupModel
from src.schemas.student_group import StudentGroupAddSchema

student_group_router = APIRouter(tags=["Распределение в группы"])

@student_group_router.post(
    "/student-groups",
    summary="Добавить запись в группу"
)
async def create_student_group(data: StudentGroupAddSchema, session: SessionDep):
    new_student_group = StudentGroupModel(
        group_id=data.group_id,
        student_id=data.student_id,
        device_address=data.device_address,
        academic_leave=data.academic_leave,
        subgroup=data.subgroup
    )
    session.add(new_student_group)
    await session.commit()
    return {"ок": True}

@student_group_router.get(
    "/student-groups",
    summary="Получить все записи в группы"
)
async def read_student_groups(session: SessionDep):
    query = select(StudentGroupModel)
    result = await session.execute(query)
    return result.scalars().all()
