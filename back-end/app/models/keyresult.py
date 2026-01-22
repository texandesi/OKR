from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class KeyResult(Base):
    __tablename__ = "key_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)
    objective_id: Mapped[int] = mapped_column(Integer, ForeignKey("objectives.id"), nullable=False)

    target_value: Mapped[float | None] = mapped_column(Float, nullable=True, default=100.0)
    current_value: Mapped[float | None] = mapped_column(Float, nullable=True, default=0.0)
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True, default="%")

    objective: Mapped["Objective"] = relationship("Objective", back_populates="keyresults")

    @property
    def progress_percentage(self) -> float:
        if self.target_value and self.target_value > 0:
            return min(100.0, (self.current_value or 0) / self.target_value * 100)
        return 0.0

    def __repr__(self) -> str:
        return f"KeyResult(id={self.id}, name={self.name})"
