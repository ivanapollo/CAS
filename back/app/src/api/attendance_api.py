from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import joinedload, lazyload

from src.database import Base, engin
from sqlalchemy import select, distinct
from src.api.dependencies import SessionDep
from src.models.attendance import AttendanceModel
from src.models.discipline import DisciplineModel
from src.models.group import GroupModel
from src.models.lesson import LessonModel
from src.models.student_group import StudentGroupModel
from src.models.user import UserModel
from src.schemas.discipline import DisciplineSchema

# Создание роутера
router = APIRouter(prefix="/api/attendance", tags=["attendance"])


# @router.get("/schedule/")
# async def get_schedule(
#     student_id: int,
#     start_date: datetime,
#     session: SessionDep
# ):
#     """Получение расписания и посещаемости для студента начиная с указанной даты"""
#     # Вычисляем дату конца недели
#     end_date = start_date + timedelta(days=6)
#
#     # Формируем сложный запрос с джойнами
#     query = session.query(
#         LessonModel,
#         AttendanceModel.mark.label('attendance_mark')
#     ).outerjoin(
#         AttendanceModel,
#         (AttendanceModel.lesson_id == LessonModel.id) &
#         (AttendanceModel.student_id == student_id)
#     ).join(
#         UserModel,
#         UserModel.student_group == LessonModel.group_id
#     ).filter(
#         UserModel.id == student_id,
#         LessonModel.date >= start_date,
#         LessonModel.date <= end_date
#     ).order_by(
#         LessonModel.date,
#         LessonModel.time_start
#     )
#
#     lessons = await query.all()
#
#     # Группируем результаты по датам
#     schedule_dict = {}
#     for lesson, attendance_mark in lessons:
#         date_str = lesson.date.strftime('%Y-%m-%d')
#
#         if date_str not in schedule_dict:
#             schedule_dict[date_str] = []
#
#         schedule_dict[date_str].append([
#             lesson.time_start.strftime('%H:%M'),  # Время начала
#             lesson.time_end.strftime('%H:%M'),  # Время окончания
#             lesson.discipline.name,  # Название дисциплины
#             attendance_mark  # Оценка за посещение
#         ])




@router.get("/teachers/{teacher_id}/disciplines",
            summary="Получить список дисциплин преподавателя")
async def get_teacher_disciplines(
    teacher_id: int,
    session: SessionDep
) -> dict:
    """
    Получение списка дисциплин преподавателя.

    Args:
        teacher_id (int): ID преподавателя
        session (SessionDep): Сессия базы данных

    Returns:
        list: Спискок названий дисциплин
    """
    # Получение уникальных названий дисциплин преподавателя
    result = await session.execute(
        select(DisciplineModel.name)
        .join(LessonModel)
        .filter(LessonModel.teacher_id == teacher_id)
        .distinct()
    )

    return result.scalars().all()


@router.get(
    "/groups/filter",
    summary="Получить список групп по фильтрам",
)
async def read_groups_by_filters(
        teacher_id: int,
        discipline_id: int,
        lesson_type: str,
        session: SessionDep
) -> list:
    """
    Получение групп по фильтрам.

    Args:
        teacher_id (int): ID преподавателя
        discipline_id (int): ID дисциплины
        lesson_type (str): Тип занятия
        session (SessionDep): Сессия базы данных

    Returns:
        list: Список групп
    """

    # Поиск групп по заданным критериям
    query = (
        select(GroupModel.name)
        .join(LessonModel)
        .join(DisciplineModel)
        .filter(
            LessonModel.teacher_id == teacher_id,
            LessonModel.discipline_id == discipline_id,
            LessonModel.type == lesson_type
        )
        .distinct()
    )

    result = await session.execute(query)
    return result.scalars().all()


@router.get("/groups/{group_id}/subgroups",
            summary="Получить подгруппы по фильтрам")
async def read_subgroups(
    group_id: int,
    teacher_id: int,
    discipline_id: int,
    lesson_type: str,
    session: SessionDep
) -> list:
    """
    Получение подгрупп по фильтрам.

    Args:
        group_id (int): ID группы
        teacher_id (int): ID преподавателя
        discipline_id (int): ID дисциплины
        lesson_type (str): Тип занятия
        session (SessionDep): Сессия базы данных

    Returns:
        list: Список уникальных номеров подгрупп
    """
    # Поиск уникальных подгрупп для заданной группы
    query = (
        select(distinct(LessonModel.subgroup))
        .select_from(LessonModel)
        .join(GroupModel)
        .filter(
            GroupModel.id == group_id,
            LessonModel.teacher_id == teacher_id,
            LessonModel.discipline_id == discipline_id,
            LessonModel.type == lesson_type
        )
    )

    result = await session.execute(query)
    return result.scalars().all()


@router.get("/lessons/{discipline_id}/types",
            summary="Получить все типы пар по дисциплине")
async def get_lesson_types(
        discipline_id: int,
        session: SessionDep):
    """
    Получение всех типов пар по дисциплине

    Args:
        discipline_id (int): ID дисциплины

    Returns:
        list: Список уникальных типов пар
    """

    # Запрашиваем типы пар через связь с LessonModel
    result = await session.execute(
        select(LessonModel.type)
        .join(DisciplineModel)
        .filter(DisciplineModel.id == discipline_id)
        .distinct()
    )

    return result.scalars().all()


@router.get(
    "/marks/{group_id}/{subgroup}/{discipline_id}/",
    summary="Получить данные о посещаемости и оценках группы",
    response_model=dict
)
async def get_attendance_marks(
        group_id: int,
        subgroup: int,
        discipline_id: int,
        session: SessionDep,
        surname: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
) -> dict:
    """
    Получение данных о посещаемости и оценках группы.

    Args:
        group_id (int): ID группы
        subgroup (int): Номер подгруппы
        discipline_id (int): ID предмета
        surname (Optional[str]): Фамилия ученика для фильтрации
        start_date (Optional[str]): Дата начала периода (формат: YYYY-MM-DD)
        end_date (Optional[str]): Дата конца периода (формат: YYYY-MM-DD)
        session (SessionDep): Сессия базы данных

    Returns:
        dict: Словарь с данными о посещаемости и оценках
    """
    # Получение уникальных дат занятий для группы
    dates_query = (
        select(distinct(LessonModel.date))
        .join(GroupModel)
        .where(
            GroupModel.id == group_id,
            LessonModel.subgroup == subgroup,
            LessonModel.discipline_id == discipline_id,
        )
    )

    # Применение фильтров по дате если они указаны
    if start_date:
        dates_query = dates_query.where(LessonModel.date >= start_date)
    if end_date:
        dates_query = dates_query.where(LessonModel.date <= end_date)

    dates_query = dates_query.order_by(LessonModel.date)
    dates_result = await session.execute(dates_query)

    dates = [row[0] for row in dates_result.all()]

    # Получение данных о студентах и их оценках
    query = (
        select(
            UserModel.surname,
            UserModel.name,
            UserModel.patronymic,
            LessonModel.date,
            AttendanceModel.mark
        )
        .select_from(UserModel)
        .join(StudentGroupModel, UserModel.id == StudentGroupModel.student_id)
        .join(GroupModel, StudentGroupModel.group_id == GroupModel.id)
        .join(LessonModel, GroupModel.id == LessonModel.group_id)
        .join(AttendanceModel,
              (AttendanceModel.student_id == UserModel.id) &
              (AttendanceModel.lesson_id == LessonModel.id)
              )
        .where(
            GroupModel.id == group_id,
            StudentGroupModel.subgroup == subgroup,
            LessonModel.discipline_id == discipline_id,
        )
    )

    # Применение фильтров по дате и ФИО
    if start_date:
        query = query.where(LessonModel.date >= start_date)
    if end_date:
        query = query.where(LessonModel.date <= end_date)
    if surname:
        query = query.where(UserModel.surname.ilike(f"%{surname}%"))

    query = query.order_by(
        UserModel.surname,
        UserModel.name,
        UserModel.patronymic,
        LessonModel.date
    )

    result = await session.execute(query)
    rows = result.all()

    # Формирование структуры данных для ответа
    data = {"dates": dates, "attendance": []}

    # Группировка данных по студентам
    current_student = None
    student_data = {"name": "", "marks": []}
    print(rows)
    for row in rows:
        surname, name, patronymic, date, mark = row

        # Начало обработки нового студента
        if current_student is None or (
                current_student != (surname, name, patronymic)
        ):
            if current_student is not None:
                data["attendance"].append(student_data)
            current_student = (surname, name, patronymic)
            student_data = {
                "name": f"{surname} {name} {patronymic}".strip(),
                "marks": []
            }

        student_data["marks"].append(mark)

    # Добавление последнего студента
    if student_data["name"]:
        data["attendance"].append(student_data)

    return {"success": True, "data": data}


@router.get("/teachers/{teacher_id}/disciplines",
            summary="Получить список дисциплин преподавателя")
async def get_teacher_disciplines(
        teacher_id: int,
        session: SessionDep
) -> dict:
    """
    Получение списка дисциплин преподавателя.

    Args:
        teacher_id (int): ID преподавателя
        session (SessionDep): Сессия базы данных

    Returns:
        dict: Словарь с успешным статусом и списком названий дисциплин
    """
    # Получение уникальных названий дисциплин преподавателя
    result = await session.execute(
        select(DisciplineModel.name)
        .join(LessonModel)
        .filter(LessonModel.teacher_id == teacher_id)
        .distinct()
    )

    disciplines = result.scalars().all()

    return {"success": True, "data": disciplines}

