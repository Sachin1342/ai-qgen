from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class EvaluateRequest(BaseModel):
    answer: str
    keywords: List[str]
    max_marks: int

@router.post("/evaluate")
def evaluate(req: EvaluateRequest):
    text = req.answer.lower()
    hits = sum(1 for k in req.keywords if k in text)

    keyword_score = hits / max(len(req.keywords), 1)
    length_score = min(len(text.split()) / 120, 1)

    marks = round((0.7 * keyword_score + 0.3 * length_score) * req.max_marks, 2)

    return {
        "marks_awarded": marks,
        "max_marks": req.max_marks,
        "keywords_matched": hits,
        "feedback": "Excellent" if marks > req.max_marks * 0.6 else "Needs improvement"
    }
