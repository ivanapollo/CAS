from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select, distinct
from src.api.dependencies import SessionDep
from src.models.discipline import DisciplineModel
from src.models.group import GroupModel
from src.models.lesson import LessonModel
from src.models.student_group import StudentGroupModel
from src.models.user import UserModel
from src.schemas.user import UserLoginSchema

# Создание роутера
router = APIRouter(prefix="/api/student_data", tags=["students"])


@router.get(
    "/disciplines",
    summary="Получить все дисциплины",
)
async def read_disciplines(session: SessionDep) -> list:
    """
    Получение списка всех дисциплин.

    Args:
        session (SessionDep): Сессия базы данных

    Returns:
        list: Список объектов DisciplineModel
    """
    query = select(DisciplineModel.name)
    result = await session.execute(query)
    return result.scalars().all()


@router.get(
    "/groups/filter",
    summary="Получить группы по фильтрам"
)
async def read_groups_by_filters(
    discipline_id: int,
    lesson_type: str,
    session: SessionDep
) -> list:
    """
    Получение групп по фильтрам.

    Args:
        discipline_id (int): ID дисциплины
        lesson_type (str): Тип занятия
        session (SessionDep): Сессия базы данных

    Returns:
        list: Список объектов GroupModel
    """
    query = (
        select(GroupModel.name)
        .join(LessonModel)
        .join(DisciplineModel)
        .filter(
            LessonModel.discipline_id == discipline_id,
            LessonModel.type == lesson_type
        )
        .distinct()
    )

    result = await session.execute(query)
    return result.scalars().all()


@router.get(
    "/groups/{group_id}/subgroups",
    summary="Получить подгруппы по фильтрам",
    response_model=list
)
async def read_subgroups(
    group_id: int,
    lesson_type: str,
    session: SessionDep
) -> list:
    """
    Получение подгрупп по фильтрам.

    Args:
        group_id (int): ID группы
        lesson_type (str): Тип занятия
        session (SessionDep): Сессия базы данных

    Returns:
        list: Список уникальных номеров подгрупп
    """
    query = (
        select(distinct(LessonModel.subgroup))
        .select_from(LessonModel)
        .join(GroupModel)
        .filter(
            GroupModel.id == group_id,
            LessonModel.type == lesson_type
        )
    )

    result = await session.execute(query)
    return result.scalars().all()


@router.get(
    "/groups",
    summary="Получить все группы",
    response_model=list
)
async def read_groups(session: SessionDep) -> list:
    """
    Получение списка всех групп.

    Args:
        session (SessionDep): Сессия базы данных

    Returns:
        list: Список объектов GroupModel
    """
    query = select(GroupModel.name)
    result = await session.execute(query)
    return result.scalars().all()


@router.get(
    "/groups/{group_id}/headmen/",
    summary="Получить список старост указанной группы"
)
async def get_group_headmen(
    group_id: int,
    session: SessionDep
) -> list:
    """
    Получение списка старост указанной группы.

    Args:
        group_id (int): ID группы
        session (SessionDep): Сессия базы данных

    Returns:
        list[dict]: Список словарей с информацией о старостах, включая их подгруппы

    Raises:
        HTTPException: Если группа не существует
    """
    # Проверяем существование группы
    group = await session.execute(
        select(GroupModel.id).where(GroupModel.id == group_id)
    )
    if not group.first():
        raise HTTPException(status_code=404, detail="Группа не найдена")

    # Получаем список старост с их подгруппами
    headmen = (
        select(
            UserModel.name,
            UserModel.surname,
            UserModel.patronymic,
            StudentGroupModel.subgroup
        )
        .select_from(UserModel)
        .join(StudentGroupModel, UserModel.id == StudentGroupModel.student_id)
        .join(GroupModel, StudentGroupModel.group_id == GroupModel.id)
        .filter(
            GroupModel.id == group_id,
            UserModel.role == "Староста"
        )
    )

    # Формируем список словарей с информацией о старостах
    return [
        {
            "name": name,
            "surname": surname,
            "patronymic": patronymic,
            "subgroup": subgroup
        }
        for name, surname, patronymic, subgroup in await session.execute(headmen)
    ]


@router.get(
    "/groups/{group_id}/subgroups/",
    summary="Получение словаря с номерами подгрупп и списками ФИО студентов",
)
async def get_students_by_subgroup(
    group_id: int,
    session: SessionDep
):
    """
    Получение словаря с номерами подгрупп и списками ФИО студентов

    Args:
        group_id: ID группы
        session: Сессия базы данных

    Returns:
        Dict[int, List[str]]: Словарь, где ключ - номер подгруппы,
                             значение - список ФИО студентов в этой подгруппе

    Raises:
        HTTPException: Если группа не существует
    """
    # Проверяем существование группы
    group = await session.execute(
        select(GroupModel.id).where(GroupModel.id == group_id)
    )
    if not group.first():
        raise HTTPException(status_code=404, detail="Группа не найдена")

    # Получаем список студентов с их подгруппами
    students = (
        select(
            StudentGroupModel.subgroup,
            UserModel.name,
            UserModel.surname,
            UserModel.patronymic
        )
        .select_from(StudentGroupModel)
        .join(UserModel, UserModel.id == StudentGroupModel.student_id)
        .join(GroupModel, GroupModel.id == StudentGroupModel.group_id)
        .filter(
            GroupModel.id == group_id
        )
        .order_by(
            StudentGroupModel.subgroup,
            UserModel.surname,
            UserModel.name,
            UserModel.patronymic
        )
    )

    # Группируем результаты по подгруппам
    result = {}
    for subgroup, name, surname, patronymic in await session.execute(students):
        fio = f"{surname} {name} {patronymic}"
        if subgroup not in result:
            result[subgroup] = []
        result[subgroup].append(fio)

    return result


@router.get(
    "/groups/{group_id}/academic-leave/students/",
    summary="Получение списка студентов в академическом отпуске для указанной группы",
)
async def get_students_on_academic_leave(
        group_id: int,
        session: SessionDep
):
    """
    Получение списка ФИО студентов в академическом отпуске для указанной группы

    Args:
        group_id: ID группы
        session: Сессия базы данных

    Returns:
        List[str]: Список строк в формате "Фамилия Имя Отчество"

    Raises:
        HTTPException: Если группа не существует
    """
    # Получаем группу
    group = await session.execute(
        select(GroupModel).where(GroupModel.id == group_id)
    )
    group = group.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail="Группа не найдена")

    # Получаем список студентов в академ отпуске
    students = await session.execute(
        select(
            UserModel.surname,
            UserModel.name,
            UserModel.patronymic
        ).select_from(
            UserModel
        ).join(
            StudentGroupModel,
            StudentGroupModel.student_id == UserModel.id
        ).join(
            GroupModel,
            GroupModel.id == StudentGroupModel.group_id
        ).where(
            GroupModel.id == group_id,
            StudentGroupModel.academic_leave == True
        ).order_by(
            UserModel.surname,
            UserModel.name,
            UserModel.patronymic
        )
    )

    # Формируем список ФИО
    return [
        f"{row.surname} {row.name} {row.patronymic}"
        for row in students
    ]
