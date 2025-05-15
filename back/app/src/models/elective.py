from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from sqlalchemy import BigInteger, Integer, ForeignKey


class ElectiveModel(Base):
    __tablename__ = "elective"

    student_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True
    )
    discipline_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("discipline.id", ondelete="CASCADE"),
        primary_key=True
    )

    student: Mapped["UserModel"] = relationship(
        back_populates="electives",
        passive_deletes=True
    )
    discipline: Mapped["DisciplineModel"] = relationship(
        back_populates="electives",
        passive_deletes=True
    )