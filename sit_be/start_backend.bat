@echo off
echo Starting SivanInfoTech Backend with MongoDB...
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
python -c "import pymongo; client = pymongo.MongoClient('mongodb://localhost:27017/'); print('MongoDB is running!')" 2>nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not running!
    echo Please start MongoDB service first.
    echo.
    echo To start MongoDB:
    echo 1. Open Command Prompt as Administrator
    echo 2. Run: net start MongoDB
    echo.
    pause
    exit /b 1
)

echo ✅ MongoDB is running!
echo.

REM Setup MongoDB with sample data
echo Setting up database with sample data...
python setup_mongodb.py
echo.

REM Start Flask application
echo Starting Flask backend on http://localhost:5000...
echo.
echo 🌐 API Base URL: http://localhost:5000/api
echo 🔑 Admin Login: admin@sitcloud.in / admin123
echo 📚 Student Login: student@test.com / student123
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py