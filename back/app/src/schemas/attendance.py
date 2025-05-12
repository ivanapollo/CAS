from pydantic import BaseModel


class AttendanceAddSchema(BaseModel):
    lesson_id: int
    student_id: int
    mark: str
