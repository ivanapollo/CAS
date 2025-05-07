from pydantic import BaseModel
from datetime import datetime

class DisciplineAddSchema(BaseModel):
    name: str
    date_start: str  # Принимает строку в формате YYYY-MM-DD
    date_end: str  # Принимает строку в формате YYYY-MM-DD

    class Config:
        @staticmethod
        def json_encoder(value):
            if isinstance(value, datetime):
                return value.strftime('%Y-%m-%d')
            return value.__json__()


class DisciplineSchema(DisciplineAddSchema):
    id: int
