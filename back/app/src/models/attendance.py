from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from sqlalchemy import BigInteger, Integer, String, ForeignKey


class AttendanceModel(Base):
    __tablename__ = "attendance"

    lesson_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lesson.id", ondelete="CASCADE"),
        primary_key=True
    )
    student_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True
    )
    mark: Mapped[str] = mapped_column(String)

    lesson: Mapped["LessonModel"] = relationship(
        back_populates="attendances",
        passive_deletes=True
    )
    student: Mapped["UserModel"] = relationship(
        back_populates="attendances",
        passive_deletes=True
    )