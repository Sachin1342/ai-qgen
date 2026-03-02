@echo off
REM AI-QGen Backend Startup Script (Windows)
REM This script installs dependencies and runs the backend

color 0A
title AI-QGen Backend

echo.
echo =========================================
echo    AI-QGen Backend Installation
echo =========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Checking Python...
python --version
echo OK
echo.

echo [2/3] Installing dependencies...
echo Please wait, this may take a few minutes...
cd backend
pip install -r requirements.txt >nul 2>&1

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Run this manually: pip install -r requirements.txt
    pause
    exit /b 1
)

echo Dependencies installed successfully!
echo.

echo [3/3] Starting AI-QGen Backend...
echo.
echo =========================================
echo    Backend is running on:
echo    http://127.0.0.1:8001
echo.
echo    Press Ctrl+C to stop
echo =========================================
echo.

python -m app.main

pause
