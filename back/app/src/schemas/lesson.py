from pydantic import BaseModel
from datetime import datetime


class LessonAddSchema(BaseModel):
    discipline_id: int
    date: str  # Принимает строку в формате YYYY-MM-DD
    time_start: str  # Принимает строку в формате HH:MM
    time_end: str   # Принимает строку в формате HH:MM
    group_id: int
    teacher_id: int
    subgroup: int
    type: str

    class Config:
        @staticmethod
        def json_encoder(value):
            if isinstance(value, datetime.time):
                return value.strftime('%H:%M')
            elif isinstance(value, datetime.date):
                return value.strftime('%Y-%m-%d')
            return value.__json__()

class LessonSchema(LessonAddSchema):
    id: int