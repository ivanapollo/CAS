from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from sqlalchemy import BigInteger, String, Date, Identity, Time


class DisciplineModel(Base):
    __tablename__ = "discipline"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)
    date_start: Mapped[str] = mapped_column(String)
    date_end: Mapped[str] = mapped_column(String)

    lessons: Mapped[list["LessonModel"]] = relationship(
        back_populates="discipline",
        passive_deletes=True
    )
    electives: Mapped[list["ElectiveModel"]] = relationship(
        back_populates="discipline",
        passive_deletes=True
    )