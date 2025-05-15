from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from sqlalchemy import BigInteger, Integer, String, Date, Time, ForeignKey


class LessonModel(Base):
    __tablename__ = "lesson"

    id: Mapped[int] = mapped_column(primary_key=True)
    discipline_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("discipline.id", ondelete="CASCADE")
    )
    date: Mapped[str] = mapped_column(String)
    time_start: Mapped[str] = mapped_column(String)
    time_end: Mapped[str] = mapped_column(String)
    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("group.id", ondelete="CASCADE")
    )
    teacher_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET DEFAULT")
    )
    subgroup: Mapped[int] = mapped_column(Integer)
    type: Mapped[str] = mapped_column(String)

    discipline: Mapped["DisciplineModel"] = relationship(
        back_populates="lessons",
        passive_deletes=True
    )
    group: Mapped["GroupModel"] = relationship(
        back_populates="lessons",
        passive_deletes=True
    )
    teacher: Mapped["UserModel"] = relationship(
        back_populates="lessons",
        passive_deletes=True
    )
    attendances: Mapped[list["AttendanceModel"]] = relationship(
        back_populates="lesson",
        passive_deletes=True
    )