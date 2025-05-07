from pydantic import BaseModel


class ElectiveAddSchema(BaseModel):
    student_id: int
    discipline_id: int
