from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Objective(Base):
    __tablename__ = "objectives"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)

    keyresults: Mapped[list["KeyResult"]] = relationship(
        "KeyResult", back_populates="objective", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"Objective(id={self.id}, name={self.name})"
