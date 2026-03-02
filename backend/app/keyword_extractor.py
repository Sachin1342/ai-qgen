"""
Keyword extraction and text processing utilities
"""
import re
from typing import List
from collections import Counter


def extract_keywords(text: str, num_keywords: int = 20) -> List[str]:
    """
    Extract keywords from text using frequency analysis and stopwords filtering
    """
    # Stop words to exclude
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you',
        'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where',
        'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'some',
        'such', 'no', 'nor', 'not', 'only', 'same', 'so', 'than', 'too', 'very',
        'as', 'if', 'then', 'because', 'while', 'during', 'before', 'after', 'above',
        'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further',
        'there', 'here', 'just', 'now', 'also', 'being', 'having', 'making'
    }

    # Clean and normalize text
    # Convert to lowercase
    text = text.lower()

    # Remove special characters and split into words
    words = re.findall(r'\b[a-z0-9]{2,}\b', text)

    # Filter stop words and short words
    filtered_words = [
        word for word in words
        if word not in stop_words and len(word) > 2
    ]

    # Count word frequencies
    word_freq = Counter(filtered_words)

    # Get top N keywords
    keywords = [word for word, _ in word_freq.most_common(num_keywords)]

    return keywords


def count_words(text: str) -> int:
    """Count total words in text"""
    words = text.split()
    return len(words)


def sanitize_text(text: str) -> str:
    """Remove extra whitespace and normalize text"""
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', text)
    # Remove leading/trailing whitespace
    text = text.strip()
    return text
