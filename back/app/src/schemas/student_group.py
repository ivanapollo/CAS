from pydantic import BaseModel


class StudentGroupAddSchema(BaseModel):
    group_id: int
    student_id: int
    device_address: str
    academic_leave: bool
    subgroup: int
