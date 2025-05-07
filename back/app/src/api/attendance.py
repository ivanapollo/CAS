from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select, distinct
from src.api.dependencies import SessionDep
from src.models.attendance import AttendanceModel
from src.models.group import GroupModel
from src.models.lesson import LessonModel
from src.models.student_group import StudentGroupModel
from src.models.user import UserModel
from src.schemas.attendance import AttendanceAddSchema

attendance_router = APIRouter(tags=["Посещаемость"])


@attendance_router.post(
    "/attendances",
    summary="Добавить запись посещаемости"
)
async def create_attendance(data: AttendanceAddSchema, session: SessionDep):
    new_attendance = AttendanceModel(
        lesson_id=data.lesson_id,
        student_id=data.student_id,
        mark=data.mark
    )
    session.add(new_attendance)
    await session.commit()
    return {"ок": True}


@attendance_router.get(
    "/attendances",
    summary="Получить все записи посещаемости"
)
async def read_attendances(session: SessionDep):
    query = select(AttendanceModel)
    result = await session.execute(query)
    return result.scalars().all()


