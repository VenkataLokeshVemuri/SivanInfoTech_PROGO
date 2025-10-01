# MongoDB Setup for SivanInfoTech Backend Testing

This guide will help you set up MongoDB locally for testing the quiz creation and batch scheduling features.

## Prerequisites

1. **MongoDB Community Server** - Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. **MongoDB Compass** - GUI tool for MongoDB (usually included with MongoDB installation)
3. **Python Environment** - Ensure you have Python with required packages

## 🚀 Quick Setup Steps

### 1. Start MongoDB Service

**Windows:**
```cmd
# Open Command Prompt as Administrator
net start MongoDB
```

**Alternative (if service doesn't exist):**
```cmd
# Navigate to MongoDB bin directory (usually C:\Program Files\MongoDB\Server\7.0\bin)
mongod --dbpath "C:\data\db"
```

### 2. Run the Setup Script

```cmd
cd sit_be
python setup_mongodb.py
```

### 3. Start the Backend

```cmd
# Option 1: Use the batch file
start_backend.bat

# Option 2: Manual start
python app.py
```

## 📊 Database Structure

After setup, your MongoDB will have:

### Database: `sivaninfo_db`

**Collections:**
- `users` - User accounts (admin and students)
- `courses` - Course catalog with batch information
- `quizzes` - Quiz definitions
- `questions` - Quiz questions
- `quiz_assignments` - Quiz assignments to batches/students
- `attempts` - Student quiz attempts
- `result_logs` - Quiz activity logs
- `ads` - Flash advertisements

## 🔑 Test Accounts

### Admin Account
- **Email:** admin@sitcloud.in
- **Password:** admin123
- **Role:** ADMIN (can create quizzes, manage batches, view all data)

### Student Account
- **Email:** student@test.com
- **Password:** student123
- **Role:** STUDENT (can take quizzes, view results)

## 📚 Sample Data

The setup includes:

### Courses
1. **AWS Solutions Architect Associate**
   - Course ID: AWS-001
   - 2 batches available
   - Duration: 60 days

2. **Azure Fundamentals AZ-900**
   - Course ID: AZURE-001
   - 1 batch available
   - Duration: 30 days

3. **Google Cloud Platform Fundamentals**
   - Course ID: GCP-001
   - 1 batch available
   - Duration: 45 days

4. **DevOps Engineering Bootcamp**
   - Course ID: DEVOPS-001
   - 1 batch available
   - Duration: 90 days

## 🧪 Testing Quiz Features

### Using the Test Script

```cmd
cd sit_be
python test_admin_features.py
```

This script will:
1. Login as admin
2. Create a sample AWS quiz
3. Add 5 sample questions
4. Assign quiz to AWS course batches
5. Display results

### Manual Testing via API

#### 1. Admin Login
```bash
curl -X POST http://localhost:5000/api/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitcloud.in",
    "password": "admin123"
  }'
```

#### 2. Create Quiz
```bash
curl -X POST http://localhost:5000/api/admin/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Quiz",
    "courseId": "AWS-001",
    "duration": 30,
    "totalMarks": 100,
    "passingMarks": 70
  }'
```

#### 3. Add Question
```bash
curl -X POST http://localhost:5000/api/admin/quiz/QUIZ_ID/question \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "single_choice",
    "questionText": "What does AWS stand for?",
    "marks": 10,
    "options": ["Amazon Web Services", "Advanced Web Systems"],
    "correctAnswer": "Amazon Web Services"
  }'
```

## 🔍 MongoDB Compass Exploration

### Connection Details
- **Connection String:** `mongodb://localhost:27017/`
- **Database:** `sivaninfo_db`

### Key Collections to Explore

1. **users** - See admin and student accounts
2. **courses** - Browse course catalog and batch schedules
3. **quizzes** - View created quizzes
4. **questions** - Examine quiz questions
5. **quiz_assignments** - See how quizzes are assigned

## 🌐 Frontend Integration

### Admin Dashboard URLs
- **Login:** http://localhost:3000/auth
- **Dashboard:** http://localhost:3000/dashboard
- **Admin Panel:** http://localhost:3000/admin

### API Endpoints for Testing
- **Base URL:** http://localhost:5000/api
- **Admin Endpoints:** `/admin/quiz`, `/admin/quizzes`
- **Student Endpoints:** `/student/assignments`

## 🔧 Troubleshooting

### MongoDB Connection Issues

1. **Service not running:**
   ```cmd
   net start MongoDB
   ```

2. **Port already in use:**
   ```cmd
   netstat -ano | findstr :27017
   ```

3. **Data directory missing:**
   ```cmd
   mkdir C:\data\db
   ```

### Backend Issues

1. **Import errors:**
   ```cmd
   pip install -r requirements.txt
   ```

2. **CORS errors:**
   - Ensure both frontend (3000) and backend (5000) are running
   - Check browser console for specific errors

## 📈 Monitoring Quiz Activity

### Real-time Monitoring

1. **MongoDB Compass:**
   - Open the `attempts` collection
   - Watch for new quiz attempts
   - Monitor `result_logs` for activity

2. **Backend Console:**
   - Watch Flask logs for API calls
   - Monitor quiz creation and assignment logs

### Sample Queries for Compass

```javascript
// Find all admin users
db.users.find({"role": "ADMIN"})

// Get quizzes for specific course
db.quizzes.find({"courseId": "AWS-001"})

// View quiz attempts
db.attempts.find().sort({"startedAt": -1})

// Check quiz assignments
db.quiz_assignments.find({"isActive": true})
```

## 🎯 Next Steps

1. **Explore MongoDB Compass** - Browse all collections and documents
2. **Test Admin Features** - Create quizzes, add questions, assign to batches
3. **Test Student Flow** - Login as student and attempt quizzes
4. **Monitor Results** - Check attempt results and grading
5. **Customize Data** - Add your own courses, quizzes, and questions

## 📞 Support

If you encounter any issues:
1. Check MongoDB service is running
2. Verify Python environment has all dependencies
3. Ensure ports 3000 (frontend) and 5000 (backend) are available
4. Check console logs for specific error messages