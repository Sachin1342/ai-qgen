"""
Generate API endpoint - generates questions based on keywords
"""
from flask import Blueprint, request, jsonify
import json

generate_bp = Blueprint('generate', __name__, url_prefix='/api')


def generate_mcq_questions(keywords: list, count: int = 5, difficulty: str = 'medium') -> list:
    """
    Generate MCQ questions (placeholder - would use AI model in production)
    """
    questions = []

    # Simple template-based generation for demo
    templates = {
        'easy': [
            f"Which of the following is related to {{keyword}}?\na) {{keyword}}\nb) Other\nc) Something\nd) Nothing",
            f"What is {{keyword}}?\na) Definition 1\nb) Definition 2\nc) Something else\nd) None of the above",
        ],
        'medium': [
            f"Explain the relationship between {{keyword}} and other concepts?",
            f"What is the significance of {{keyword}} in the context of this material?",
        ],
        'hard': [
            f"Analyze the implications of {{keyword}} and provide a comprehensive explanation.",
            f"Compare {{keyword}} with related concepts and discuss the differences.",
        ]
    }

    selected_templates = templates.get(difficulty.lower(), templates['medium'])

    for i, keyword in enumerate(keywords[:count]):
        question_data = {
            'question': f"{i+1}. What is {keyword}?",
            'options': [
                f"Definition of {keyword}",
                "Alternative concept 1",
                "Alternative concept 2",
                "Incorrect definition"
            ],
            'answer': 'a) Definition of {{keyword}}'.replace('{{keyword}}', keyword)
        }
        questions.append(question_data)

    return questions


def generate_descriptive_questions(keywords: list, count: int = 5, difficulty: str = 'medium') -> list:
    """
    Generate descriptive questions (placeholder - would use AI model in production)
    """
    questions = []

    difficulty_templates = {
        'easy': 'Define {{keyword}}.',
        'medium': 'Explain {{keyword}} and its significance.',
        'hard': 'Provide a comprehensive analysis of {{keyword}} including its applications and implications.',
    }

    template = difficulty_templates.get(difficulty.lower(), difficulty_templates['medium'])

    for i, keyword in enumerate(keywords[:count]):
        question = {
            'question': template.replace('{{keyword}}', keyword),
            'options': []
        }
        questions.append(question)

    return questions


@generate_bp.route('/generate', methods=['POST'])
def generate():
    """
    Generate questions based on keywords

    Request body:
        - keywords: List of keywords to base questions on
        - count: Number of questions to generate (default: 10)
        - difficulty: Difficulty level (easy/medium/hard)
        - qtype: Question type (mcq/descriptive)

    Returns:
        - questions: List of generated questions
    """
    try:
        data = request.get_json()

        keywords = data.get('keywords', [])
        count = data.get('count', 10)
        difficulty = data.get('difficulty', 'medium')
        qtype = data.get('qtype', 'mcq')

        if not keywords or len(keywords) == 0:
            return jsonify({'detail': 'No keywords provided'}), 400

        # Ensure count doesn't exceed available keywords
        count = min(count, len(keywords))

        # Generate questions based on type
        if qtype.lower() == 'mcq':
            questions = generate_mcq_questions(keywords, count, difficulty)
        else:
            questions = generate_descriptive_questions(keywords, count, difficulty)

        return jsonify({
            'questions': questions,
            'count': len(questions),
            'message': 'Questions generated successfully'
        }), 200

    except Exception as e:
        return jsonify({'detail': f'Generation error: {str(e)}'}), 500
