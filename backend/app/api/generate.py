from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import random

router = APIRouter()

VOCAB = {
    "easy": [
        "Define {}.",
        "What is {}?",
        "State the meaning of {}."
    ],
    "medium": [
        "Explain the concept of {}.",
        "Describe {} with an example.",
        "Discuss {} briefly."
    ],
    "hard": [
        "Analyze the importance of {}.",
        "Explain {} in detail.",
        "Discuss advantages and limitations of {}."
    ]
}

DISTRACTORS = [
    "An unrelated concept",
    "A partially correct idea",
    "A commonly confused term",
    "None of the above"
]

class GenerateRequest(BaseModel):
    keywords: List[str]
    count: int
    difficulty: str
    qtype: str   # mcq | descriptive

@router.post("/generate")
def generate(req: GenerateRequest):
    questions = []
    templates = VOCAB.get(req.difficulty, VOCAB["medium"])

    for kw in req.keywords[:req.count]:
        if req.qtype == "mcq":
            correct = f"Correct explanation of {kw}"
            options = random.sample(DISTRACTORS, 3) + [correct]
            random.shuffle(options)

            questions.append({
                "question": f"What best describes {kw}?",
                "options": options,
                "answer": correct
            })
        else:
            questions.append(random.choice(templates).format(kw))

    return {"questions": questions}
