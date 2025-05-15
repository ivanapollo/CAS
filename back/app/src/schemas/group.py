from pydantic import BaseModel


class GroupAddSchema(BaseModel):
    name: str

class GroupSchema(GroupAddSchema):
    id: int
