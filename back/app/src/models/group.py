from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from sqlalchemy import BigInteger, String


class GroupModel(Base):
    __tablename__ = "group"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)

    students: Mapped[list["StudentGroupModel"]] = relationship(
        back_populates="group",
        passive_deletes=True
    )
    lessons: Mapped[list["LessonModel"]] = relationship(
        back_populates="group",
        passive_deletes=True
    )