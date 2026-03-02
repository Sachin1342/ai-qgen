#!/bin/bash
# AI-QGen Backend Startup Script (macOS/Linux)

echo ""
echo "========================================="
echo "   AI-QGen Backend Installation"
echo "========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Install it with: brew install python3 (macOS) or apt-get install python3 (Linux)"
    exit 1
fi

echo "[1/3] Checking Python..."
python3 --version
echo "OK"
echo ""

echo "[2/3] Installing dependencies..."
echo "Please wait, this may take a few minutes..."
cd backend
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    echo "Run this manually: pip3 install -r requirements.txt"
    exit 1
fi

echo "Dependencies installed successfully!"
echo ""

echo "[3/3] Starting AI-QGen Backend..."
echo ""
echo "========================================="
echo "    Backend is running on:"
echo "    http://127.0.0.1:8001"
echo ""
echo "    Press Ctrl+C to stop"
echo "========================================="
echo ""

python3 -m app.main
