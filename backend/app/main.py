"""
AI-QGen Backend - Entry Point
Run with: python backend/app/main.py
"""
from app import create_app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting AI-QGen Backend on http://127.0.0.1:8001")
    print("📝 Generate endpoint: POST /api/generate")
    print("📤 Upload endpoint: POST /api/upload")
    print("📥 Export endpoints: POST /api/export/pdf, POST /api/export/docx")
    print("💊 Health check: GET /api/health")
    app.run(debug=True, host='127.0.0.1', port=8001)
