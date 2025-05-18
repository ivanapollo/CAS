from fastapi import APIRouter

from src.api.group import group_router
from src.api.attendance import attendance_router
from src.api.lesson import lesson_router
from src.api.discipline import discipline_router
from src.api.elective import elective_router
from src.api.student_group import student_group_router
from src.api.user import user_router
from src.api.attendance_api import router as attendance_api_router
from src.api.student_group import another_router
from src.api.login_api import router as login_api_router
from src.api.student_data_api import router as student_data_api_router
main_router = APIRouter()
main_router.include_router(another_router)
main_router.include_router(group_router)
main_router.include_router(attendance_router)
main_router.include_router(lesson_router)
main_router.include_router(discipline_router)
main_router.include_router(elective_router)
main_router.include_router(student_group_router)
main_router.include_router(user_router)
main_router.include_router(login_api_router)
main_router.include_router(attendance_api_router)
main_router.include_router(student_data_api_router)
