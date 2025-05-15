from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from sqlalchemy import BigInteger, Integer, String, Boolean, ForeignKey


class StudentGroupModel(Base):
    __tablename__ = "student_group"

    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("group.id", ondelete="CASCADE"),
        primary_key=True
    )
    student_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True
    )
    device_address: Mapped[str] = mapped_column(String)
    academic_leave: Mapped[bool] = mapped_column(Boolean)
    subgroup: Mapped[int] = mapped_column(Integer)

    group: Mapped["GroupModel"] = relationship(
        back_populates="students",
        passive_deletes=True
    )
    student_group: Mapped["UserModel"] = relationship(
        back_populates="student_group",
        passive_deletes=True
    )