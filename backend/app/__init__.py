"""
AI-QGen Backend - Main Flask Application
"""
from flask import Flask, send_file
from flask_cors import CORS
import os
from pathlib import Path

# Import API blueprints
from app.api.upload import upload_bp
from app.api.generate import generate_bp
from app.api.export import export_bp

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)

    # Enable CORS for frontend communication
    CORS(app, origins=[
        'http://localhost:3000',
        'http://localhost:8000',
        'http://localhost:5500',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8000',
        'http://127.0.0.1:5500',
        'file://'
    ])

    # Register blueprints
    app.register_blueprint(upload_bp)
    app.register_blueprint(generate_bp)
    app.register_blueprint(export_bp)

    # Ensure output directories exist
    Path('backend/outputs/pdf').mkdir(parents=True, exist_ok=True)
    Path('backend/outputs/docx').mkdir(parents=True, exist_ok=True)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'ok', 'message': 'AI-QGen backend is running'}, 200

    # Download endpoints for exported files
    @app.route('/download/pdf/<file_id>', methods=['GET'])
    def download_pdf(file_id):
        try:
            file_path = f'backend/outputs/pdf/{file_id}.pdf'
            if os.path.exists(file_path):
                return send_file(file_path, as_attachment=True, download_name=f'questions_{file_id}.pdf')
            else:
                return {'detail': 'File not found'}, 404
        except Exception as e:
            return {'detail': f'Download error: {str(e)}'}, 500

    @app.route('/download/docx/<file_id>', methods=['GET'])
    def download_docx(file_id):
        try:
            file_path = f'backend/outputs/docx/{file_id}.docx'
            if os.path.exists(file_path):
                return send_file(file_path, as_attachment=True, download_name=f'questions_{file_id}.docx')
            else:
                return {'detail': 'File not found'}, 404
        except Exception as e:
            return {'detail': f'Download error: {str(e)}'}, 500

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'detail': 'Endpoint not found'}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {'detail': 'Internal server error'}, 500

    return app


if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting AI-QGen Backend on http://127.0.0.1:8001")
    app.run(debug=True, host='127.0.0.1', port=8001)
