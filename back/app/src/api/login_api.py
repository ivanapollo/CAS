from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.user import UserModel
from src.models.group import GroupModel
from src.models.student_group import StudentGroupModel
from src.schemas.user import UserLoginSchema

# Создание роутера
router = APIRouter(prefix="/api/login", tags=["users"])


@router.post("/")
async def login(data: UserLoginSchema, session: SessionDep):
    """Проверка наличия пользователя в системе"""
    query = select(UserModel).where(
        UserModel.login == data.login,
        UserModel.password == data.password
    )

    user = await session.execute(query)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль")
    
    user = user.scalars().first()
    
    role = user.role
    info = f"{user.surname} {user.name[0]}.{user.patronymic[0]}."

    result = {"id": user.id, "role": role}
    if role in ["Студент", "Староста"]:
        group_query = (
            select(GroupModel.name, GroupModel.id, StudentGroupModel.subgroup)
            .select_from(StudentGroupModel)
            .join(GroupModel, StudentGroupModel.group_id == GroupModel.id)
            .where(StudentGroupModel.student_id == user.id)
        )

        group_result = await session.execute(group_query)
        group = group_result.first()
        
        if group:
            info = f"{info} {group.name}"
            result["group_id"] = group.id
            result["subgroup"] = group.subgroup

    result["info"] = info

    return result
