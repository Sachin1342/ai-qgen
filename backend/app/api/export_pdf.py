from fastapi import APIRouter
from pydantic import BaseModel
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from pathlib import Path
import uuid

router = APIRouter()
OUT = Path("outputs/pdf")
OUT.mkdir(parents=True, exist_ok=True)

class Export(BaseModel):
    title: str
    questions: list

@router.post("/export/pdf")
def export_pdf(req: Export):
    name = f"{uuid.uuid4()}.pdf"
    path = OUT / name

    c = canvas.Canvas(str(path), pagesize=A4)
    y = 800
    c.drawString(50, y, req.title)
    y -= 40

    for i, q in enumerate(req.questions, 1):
        c.drawString(50, y, f"{i}. {q}")
        y -= 20

    c.save()
    return {"file": name}
