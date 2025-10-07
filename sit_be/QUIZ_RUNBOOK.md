# Quiz System Implementation Runbook

## Overview
This runbook provides comprehensive testing instructions for the newly implemented quiz management system in the Sivan Cloud Accelerator backend.

## System Components

### New Files Added
- `models.py` - MongoDB document schemas and helper functions
- `scoring.py` - Automated scoring engine and manual grading utilities  
- `test_quiz_system.py` - Unit tests for scoring logic
- `test_api_integration.py` - Integration tests for API endpoints

### Modified Files
- `app.py` - Added 20+ new quiz management endpoints

## Database Collections Created

The system uses the following MongoDB collections:

1. **quizzes** - Quiz definitions and settings
2. **questions** - Individual questions with answers and metadata
3. **quiz_assignments** - Quiz assignments to batches/students
4. **attempts** - Student quiz attempts and scores
5. **result_logs** - Audit trail of grading actions

## Prerequisites

1. **Environment Setup**
   ```bash
   # Navigate to backend directory
   cd sit_be
   
   # Ensure virtual environment is activated
   # Install any missing dependencies
   pip install -r requirements.txt
   ```

2. **Database Setup**
   - MongoDB should be running (existing setup)
   - No schema migration needed (MongoDB is schema-less)
   - Collections will be created automatically

## Testing Instructions

### Phase 1: Unit Tests

Run the scoring logic unit tests:

```bash
python test_quiz_system.py
```

**Expected Output:**
- All tests should pass
- Coverage for single/multiple choice, numeric, and short answer scoring
- Timer enforcement and manual grading helper tests

### Phase 2: Start the Application

```bash
python app.py
```

**Expected Output:**
```
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:5000
* Running on http://[your-ip]:5000
```

### Phase 3: API Integration Tests

In a new terminal, run the API integration tests:

```bash
python test_api_integration.py
```

**Prerequisites for API tests:**
- Flask app running on localhost:5000
- Admin user credentials in the database
- Student user credentials in the database

**Expected Flow:**
1. ✓ Admin login successful
2. ✓ Student login successful  
3. ✓ Quiz created successfully
4. ✓ 4 questions added (single choice, multiple choice, numeric, short answer)
5. ✓ Quiz assigned to student
6. ✓ Student can see assignment
7. ✓ Student starts attempt
8. ✓ Student gets questions (without answers)
9. ✓ Student saves answers
10. ✓ Student submits attempt
11. ✓ Student views results
12. ✓ Admin manually grades short answer
13. ✓ Admin lists all attempts

### Phase 4: Manual Testing with API Client

Use Postman, curl, or similar tools to test individual endpoints.

#### 4.1 Admin Authentication

```bash
curl -X POST http://localhost:5000/api/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitcloud.in",
    "password": "admin123"
  }'
```

Save the returned token for subsequent admin requests.

#### 4.2 Create a Quiz

```bash
curl -X POST http://localhost:5000/api/admin/quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Python Fundamentals Quiz",
    "description": "Test basic Python knowledge",
    "courseId": "python_101",
    "duration": 30,
    "totalMarks": 40,
    "passingMarks": 24,
    "settings": {
      "lateSubmissionBehavior": "accept_with_penalty",
      "latePenaltyPercent": 10,
      "maxAttempts": 1,
      "showResultsImmediately": true
    }
  }'
```

#### 4.3 Add Questions

```bash
# Single Choice Question
curl -X POST http://localhost:5000/api/admin/quiz/QUIZ_ID/question \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "type": "single_choice",
    "questionText": "What is Python?",
    "marks": 10,
    "order": 1,
    "options": [
      {"optionId": "A", "text": "A snake", "isCorrect": false},
      {"optionId": "B", "text": "A programming language", "isCorrect": true},
      {"optionId": "C", "text": "A database", "isCorrect": false}
    ],
    "correctAnswer": "B"
  }'

# Multiple Choice Question  
curl -X POST http://localhost:5000/api/admin/quiz/QUIZ_ID/question \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "type": "multiple_choice",
    "questionText": "Which are Python keywords?",
    "marks": 15,
    "order": 2,
    "options": [
      {"optionId": "A", "text": "def", "isCorrect": true},
      {"optionId": "B", "text": "class", "isCorrect": true},
      {"optionId": "C", "text": "function", "isCorrect": false}
    ],
    "correctAnswer": ["A", "B"]
  }'

# Numeric Question
curl -X POST http://localhost:5000/api/admin/quiz/QUIZ_ID/question \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "type": "numeric",
    "questionText": "What is 5 + 3?",
    "marks": 5,
    "order": 3,
    "correctAnswer": 8,
    "tolerance": 0
  }'

# Short Answer Question
curl -X POST http://localhost:5000/api/admin/quiz/QUIZ_ID/question \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "type": "short_answer", 
    "questionText": "Explain Python in one sentence",
    "marks": 10,
    "order": 4,
    "keywords": ["programming", "language", "interpreted"],
    "required_keywords": ["programming"]
  }'
```

#### 4.4 Assign Quiz

```bash
curl -X POST http://localhost:5000/api/admin/quiz/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "quizId": "YOUR_QUIZ_ID",
    "dueDate": "2025-10-01T23:59:59+05:30",
    "assignmentType": "individual",
    "assignedTo": {
      "studentEmails": ["student@example.com"]
    },
    "maxAttempts": 1,
    "instructions": "Complete within time limit"
  }'
```

#### 4.5 Student Workflow

```bash
# Student login
curl -X POST http://localhost:5000/api/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'

# Get assignments
curl -X GET http://localhost:5000/api/student/assignments \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"

# Start attempt
curl -X POST http://localhost:5000/api/student/quiz/ASSIGNMENT_ID/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -d '{
    "screenResolution": "1920x1080"
  }'

# Get questions
curl -X GET http://localhost:5000/api/student/attempt/ATTEMPT_ID/questions \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"

# Save answer
curl -X POST http://localhost:5000/api/student/attempt/ATTEMPT_ID/answer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -d '{
    "questionId": "QUESTION_ID",
    "answer": "B"
  }'

# Submit attempt
curl -X POST http://localhost:5000/api/student/attempt/ATTEMPT_ID/submit \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"

# Get results
curl -X GET http://localhost:5000/api/student/attempt/ATTEMPT_ID/result \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

## Key Features to Test

### 1. Scoring System
- **Single Choice**: Correct = full marks, incorrect = 0 marks
- **Multiple Choice**: Partial credit based on (correct - incorrect) / total
- **Numeric**: Tolerance-based matching (default ±0.01)
- **Short Answer**: Keyword matching with required/optional keywords

### 2. Timer Enforcement
- Server sets `started_at` and calculates `due_at`
- Late submissions handled per quiz settings:
  - `reject`: 0 marks
  - `accept_with_penalty`: Score reduction
  - `mark_late`: No penalty, just flagged

### 3. Manual Grading
- Admins can update individual question scores
- Automatic total score recalculation
- Audit logging of grading actions

### 4. Security Features
- Students never see correct answers/explanations during attempts
- JWT token authentication for all endpoints
- Role-based access control (ADMIN vs STUDENT)
- Attempt ownership validation

## Common Issues and Troubleshooting

### Issue: "PhonePe SDK not available"
**Solution**: This is expected if PhonePe SDK is not installed. Payment functionality will be disabled but quiz system works normally.

### Issue: MongoDB connection errors
**Solution**: 
- Check if MongoDB is running: `systemctl status mongodb`
- Verify connection string in `app.py`
- Default: `mongodb://situser:sitadmin@mongo:27017/admin`

### Issue: JWT token expired
**Solution**: 
- Tokens expire after 30 minutes
- Re-authenticate to get fresh token
- Or use the `/api/getToken` endpoint to refresh

### Issue: "Quiz not accessible" for student
**Solution**: 
- Verify quiz is assigned to the student
- Check assignment is still active (not past due date)
- For batch assignments, verify student enrollment

### Issue: Questions not scoring correctly
**Solution**:
- Check question type and format of `correctAnswer`
- For multiple choice, ensure `correctAnswer` is array
- For numeric, verify tolerance settings
- For short answer, check keyword configuration

## Database Verification

You can verify data is being created correctly:

```bash
# Connect to MongoDB
mongo mongodb://situser:sitadmin@localhost:27017/admin

# List collections
show collections

# Check quiz data
db.quizzes.find().pretty()

# Check questions  
db.questions.find().pretty()

# Check attempts
db.attempts.find().pretty()

# Check assignment logs
db.result_logs.find().pretty()
```

## Performance Considerations

- **Indexing**: Consider adding indexes on frequently queried fields:
  ```javascript
  db.quizzes.createIndex({courseId: 1, isActive: 1})
  db.questions.createIndex({quizId: 1, order: 1})
  db.attempts.createIndex({studentEmail: 1, status: 1})
  db.quiz_assignments.createIndex({assignedTo.studentEmails: 1, isActive: 1})
  ```

- **Memory**: Large quizzes with many questions may need pagination
- **Concurrency**: Multiple simultaneous attempts are supported

## Security Checklist

- [ ] Students cannot access other students' attempts
- [ ] Students cannot see correct answers before submission
- [ ] Admin endpoints require ADMIN role
- [ ] JWT tokens are validated on every request
- [ ] Attempt ownership is verified before allowing operations
- [ ] Late submission logic cannot be bypassed

## Success Criteria

The implementation is successful if:

1. ✅ All unit tests pass (scoring logic)
2. ✅ All integration tests pass (API workflow)
3. ✅ Admins can create/manage quizzes and questions
4. ✅ Admins can assign quizzes to students
5. ✅ Students can take quizzes with proper timing
6. ✅ Automated scoring works for all question types
7. ✅ Manual grading allows score adjustments
8. ✅ Timer enforcement handles late submissions correctly
9. ✅ Results are properly calculated and displayed
10. ✅ Audit logging captures all grading actions

## Next Steps

After successful testing, consider:

1. **Frontend Integration**: Update Angular frontend to use new quiz endpoints
2. **Batch Management**: Implement proper batch-student relationships
3. **Question Bank**: Create reusable question library
4. **Analytics**: Add quiz performance analytics
5. **Export**: Implement result export functionality
6. **Notifications**: Add email notifications for assignments/results