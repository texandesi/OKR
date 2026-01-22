from datetime import datetime

from pydantic import BaseModel, ConfigDict


class QuestionBase(BaseModel):
    question_text: str


class QuestionCreate(QuestionBase):
    pub_date: datetime | None = None


class QuestionUpdate(BaseModel):
    question_text: str | None = None
    pub_date: datetime | None = None


class QuestionResponse(QuestionBase):
    id: int
    pub_date: datetime

    model_config = ConfigDict(from_attributes=True)


class ChoiceBase(BaseModel):
    choice_text: str
    question_id: int


class ChoiceCreate(ChoiceBase):
    votes: int = 0


class ChoiceUpdate(BaseModel):
    choice_text: str | None = None
    question_id: int | None = None
    votes: int | None = None


class ChoiceResponse(ChoiceBase):
    id: int
    votes: int

    model_config = ConfigDict(from_attributes=True)
