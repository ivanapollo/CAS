from fastapi import APIRouter, HTTPException, status, Depends
from src.database import Base, engin
from sqlalchemy import select
from src.api.dependencies import SessionDep
from src.models.student_group import StudentGroupModel
from src.schemas.student_group import StudentGroupAddSchema
from src.models.student_group import StudentGroupModelUpdate
from src.schemas.student_group import StudentGroupModelUpdateScheme

student_group_router = APIRouter(tags=["Распределение в группы"])
another_router = APIRouter(prefix = "/api/gr_update",tags = ["adasd"]);
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
    
@another_router.get("/student-groups")
async def a():
    return {"hi":"hi"}
@another_router.patch(
    "/",
    summary="Получить все записи в группы"
)
async def update_student_groups(data: StudentGroupAddSchema, session: SessionDep):
    stg = await session.get(StudentGroupModel,{"group_id":data.group_id,"student_id":data.student_id});

    if not stg:
        raise HTTPException(status_code=404, detail="Not found")
    group_id = stg.group_id
    student_id = stg.student_id
    if data.subgroup !=None:
        subgroup = data.subgroup
    else:
        subgroup = stg.subgroup
    if data.device_address !=None:
        device_address = data.device_address
    else:
        device_address = stg.device_address
    if data.academic_leave !=None:
        academic_leave = data.academic_leave
    else:
        academic_leave = stg.academic_leave
    new_group_data =StudentGroupModel(
        group_id=group_id,
        student_id=student_id,
        device_address=device_address,
        academic_leave=academic_leave,
        subgroup=subgroup
    )

    if new_group_data == None:
        return {"NO":True}
    
    await session.delete(stg);
    await session.commit();
    session.add(new_group_data);
    await session.commit();
    return {"OK":True};
    

