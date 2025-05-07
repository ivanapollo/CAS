from pydantic import BaseModel


class UserAddSchema(BaseModel):
    name: str
    surname: str
    patronymic: str
    role: str
    login: str
    password: str


class UserSchema(UserAddSchema):
    id: int


class UserLoginSchema(BaseModel):
    login: str
    password: str