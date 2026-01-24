from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.upload import router as upload_router
from app.api.generate import router as generate_router
from app.api.evaluate import router as evaluate_router
from app.api.export_pdf import router as pdf_router
from app.api.export_docx import router as docx_router

app = FastAPI(title="AI-QGen Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(generate_router, prefix="/api")
app.include_router(evaluate_router, prefix="/api")
app.include_router(pdf_router, prefix="/api")
app.include_router(docx_router, prefix="/api")
