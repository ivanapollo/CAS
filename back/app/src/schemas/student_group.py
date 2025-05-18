from pydantic import BaseModel


class StudentGroupAddSchema(BaseModel):
    group_id: int
    student_id: int
    device_address: str
    academic_leave: bool
    subgroup: int
class StudentGroupModelUpdateScheme(StudentGroupAddSchema):
    group_id: int | None = None
    student_id: int | None = None
    device_address: str | None = None
    academic_leave: bool | None = None
    subgroup: int | None = None
