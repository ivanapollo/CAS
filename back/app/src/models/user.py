from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from sqlalchemy import BigInteger, String


class UserModel(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)
    surname: Mapped[str] = mapped_column(String)
    patronymic: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String)
    login: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)

    # Связи с другими моделями
    student_group: Mapped["StudentGroupModel"] = relationship(
        back_populates="student_group",
        passive_deletes=True
    )
    lessons: Mapped[list["LessonModel"]] = relationship(
        back_populates="teacher",
        passive_deletes=True
    )
    attendances: Mapped[list["AttendanceModel"]] = relationship(
        back_populates="student",
        passive_deletes=True
    )
    electives: Mapped[list["ElectiveModel"]] = relationship(
        back_populates="student",
        passive_deletes=True
    )