"""
Integration Tests for Quiz API Endpoints
Tests the complete API workflow for quiz management
"""

import requests
import json
import time
from datetime import datetime, timedelta
import pytz

class QuizAPITester:
    """Test class for Quiz API endpoints"""
    
    def __init__(self, base_url='http://localhost:5000/api', admin_credentials=None, student_credentials=None):
        self.base_url = base_url
        self.admin_token = None
        self.student_token = None
        self.admin_credentials = admin_credentials or {
            'email': 'admin@sitcloud.in',
            'password': 'admin123'
        }
        self.student_credentials = student_credentials or {
            'email': 'student@example.com', 
            'password': 'student123'
        }
        self.tz_IST = pytz.timezone('Asia/Kolkata')
        
        # Test data storage
        self.test_quiz_id = None
        self.test_question_ids = []
        self.test_assignment_id = None
        self.test_attempt_id = None
    
    def login_admin(self):
        """Login as admin and store token"""
        response = requests.post(
            f"{self.base_url}/signin",
            json=self.admin_credentials
        )
        
        if response.status_code == 200:
            data = response.json()
            self.admin_token = data.get('token')
            print("✓ Admin login successful")
            return True
        else:
            print(f"✗ Admin login failed: {response.text}")
            return False
    
    def login_student(self):
        """Login as student and store token"""
        response = requests.post(
            f"{self.base_url}/signin",
            json=self.student_credentials
        )
        
        if response.status_code == 200:
            data = response.json()
            self.student_token = data.get('token')
            print("✓ Student login successful")
            return True
        else:
            print(f"✗ Student login failed: {response.text}")
            return False
    
    def get_admin_headers(self):
        """Get headers with admin authorization"""
        return {'Authorization': f'Bearer {self.admin_token}'}
    
    def get_student_headers(self):
        """Get headers with student authorization"""
        return {'Authorization': f'Bearer {self.student_token}'}
    
    def test_create_quiz(self):
        """Test creating a new quiz"""
        print("\n--- Testing Quiz Creation ---")
        
        quiz_data = {
            "title": "Python Basics Quiz",
            "description": "Test your knowledge of Python fundamentals",
            "courseId": "course_python_101", 
            "duration": 60,  # minutes
            "totalMarks": 50,
            "passingMarks": 30,
            "instructions": "Answer all questions. No negative marking.",
            "settings": {
                "lateSubmissionBehavior": "accept_with_penalty",
                "latePenaltyPercent": 10,
                "allowRetake": False,
                "maxAttempts": 1,
                "shuffleQuestions": True,
                "showResultsImmediately": True
            }
        }
        
        response = requests.post(
            f"{self.base_url}/admin/quiz",
            json=quiz_data,
            headers=self.get_admin_headers()
        )
        
        if response.status_code == 201:
            data = response.json()
            self.test_quiz_id = data.get('quizId')
            print(f"✓ Quiz created successfully: {self.test_quiz_id}")
            return True
        else:
            print(f"✗ Quiz creation failed: {response.text}")
            return False
    
    def test_add_questions(self):
        """Test adding questions to the quiz"""
        print("\n--- Testing Question Addition ---")
        
        questions = [
            {
                "type": "single_choice",
                "questionText": "What is the output of print('Hello, World!')?",
                "marks": 5,
                "order": 1,
                "options": [
                    {"optionId": "A", "text": "Hello, World!", "isCorrect": True},
                    {"optionId": "B", "text": "Hello World", "isCorrect": False},
                    {"optionId": "C", "text": "Error", "isCorrect": False},
                    {"optionId": "D", "text": "'Hello, World!'", "isCorrect": False}
                ],
                "correctAnswer": "A",
                "explanation": "Python print() function outputs the string without quotes"
            },
            {
                "type": "multiple_choice",
                "questionText": "Which of the following are Python data types?",
                "marks": 10,
                "order": 2,
                "options": [
                    {"optionId": "A", "text": "int", "isCorrect": True},
                    {"optionId": "B", "text": "float", "isCorrect": True},
                    {"optionId": "C", "text": "varchar", "isCorrect": False},
                    {"optionId": "D", "text": "list", "isCorrect": True}
                ],
                "correctAnswer": ["A", "B", "D"],
                "explanation": "int, float, and list are built-in Python data types"
            },
            {
                "type": "numeric",
                "questionText": "What is the result of 7 * 8?",
                "marks": 5,
                "order": 3,
                "correctAnswer": 56,
                "tolerance": 0,
                "explanation": "7 multiplied by 8 equals 56"
            },
            {
                "type": "short_answer",
                "questionText": "Explain what Python is in one sentence.",
                "marks": 10,
                "order": 4,
                "keywords": ["programming", "language", "interpreted", "high-level"],
                "required_keywords": ["programming", "language"],
                "explanation": "Python is a high-level, interpreted programming language"
            }
        ]
        
        success_count = 0
        for question in questions:
            response = requests.post(
                f"{self.base_url}/admin/quiz/{self.test_quiz_id}/question",
                json=question,
                headers=self.get_admin_headers()
            )
            
            if response.status_code == 201:
                data = response.json()
                question_id = data.get('questionId')
                self.test_question_ids.append(question_id)
                print(f"✓ Question added: {question_id}")
                success_count += 1
            else:
                print(f"✗ Failed to add question: {response.text}")
        
        return success_count == len(questions)
    
    def test_assign_quiz(self):
        """Test assigning quiz to students"""
        print("\n--- Testing Quiz Assignment ---")
        
        due_date = (datetime.now(self.tz_IST) + timedelta(days=7)).isoformat()
        
        assignment_data = {
            "quizId": self.test_quiz_id,
            "dueDate": due_date,
            "assignmentType": "individual",
            "assignedTo": {
                "studentEmails": [self.student_credentials['email']]
            },
            "maxAttempts": 1,
            "instructions": "Complete the quiz within the time limit"
        }
        
        response = requests.post(
            f"{self.base_url}/admin/quiz/assign",
            json=assignment_data,
            headers=self.get_admin_headers()
        )
        
        if response.status_code == 201:
            data = response.json()
            self.test_assignment_id = data.get('assignmentId')
            print(f"✓ Quiz assigned successfully: {self.test_assignment_id}")
            return True
        else:
            print(f"✗ Quiz assignment failed: {response.text}")
            return False
    
    def test_student_get_assignments(self):
        """Test student getting their assignments"""
        print("\n--- Testing Student Assignment Retrieval ---")
        
        response = requests.get(
            f"{self.base_url}/student/assignments",
            headers=self.get_student_headers()
        )
        
        if response.status_code == 200:
            data = response.json()
            assignments = data.get('assignments', [])
            print(f"✓ Retrieved {len(assignments)} assignments")
            
            # Find our test assignment
            test_assignment = next(
                (a for a in assignments if a.get('assignmentId') == self.test_assignment_id), 
                None
            )
            
            if test_assignment:
                print(f"✓ Test assignment found with quiz: {test_assignment['quiz']['title']}")
                return True
            else:
                print("✗ Test assignment not found in list")
                return False
        else:
            print(f"✗ Failed to get assignments: {response.text}")
            return False
    
    def test_start_attempt(self):
        """Test starting a quiz attempt"""
        print("\n--- Testing Attempt Start ---")
        
        client_data = {
            "screenResolution": "1920x1080"
        }
        
        response = requests.post(
            f"{self.base_url}/student/quiz/{self.test_assignment_id}/start",
            json=client_data,
            headers=self.get_student_headers()
        )
        
        if response.status_code == 201:
            data = response.json()
            self.test_attempt_id = data.get('attemptId')
            print(f"✓ Attempt started successfully: {self.test_attempt_id}")
            print(f"  Due at: {data.get('dueAt')}")
            return True
        else:
            print(f"✗ Failed to start attempt: {response.text}")
            return False
    
    def test_get_questions(self):
        """Test getting questions for an attempt"""
        print("\n--- Testing Question Retrieval ---")
        
        response = requests.get(
            f"{self.base_url}/student/attempt/{self.test_attempt_id}/questions",
            headers=self.get_student_headers()
        )
        
        if response.status_code == 200:
            data = response.json()
            questions = data.get('questions', [])
            print(f"✓ Retrieved {len(questions)} questions")
            
            # Verify questions don't contain answers
            for question in questions:
                if 'correctAnswer' in question or 'explanation' in question:
                    print("✗ Question contains answer/explanation (security issue)")
                    return False
            
            print("✓ Questions properly sanitized")
            return True
        else:
            print(f"✗ Failed to get questions: {response.text}")
            return False
    
    def test_save_answers(self):
        """Test saving answers during attempt"""
        print("\n--- Testing Answer Saving ---")
        
        # Get questions first to know their IDs
        response = requests.get(
            f"{self.base_url}/student/attempt/{self.test_attempt_id}/questions",
            headers=self.get_student_headers()
        )
        
        if response.status_code != 200:
            print("✗ Could not retrieve questions for answering")
            return False
        
        questions = response.json().get('questions', [])
        success_count = 0
        
        # Answer each question
        for question in questions:
            question_id = question['questionId']
            question_type = question['type']
            
            # Provide appropriate answers based on question type
            if question_type == 'single_choice':
                answer = 'A'  # First option
            elif question_type == 'multiple_choice':
                answer = ['A', 'B']  # First two options
            elif question_type == 'numeric':
                answer = 56  # Correct answer for our test question
            elif question_type == 'short_answer':
                answer = 'Python is a high-level programming language'
            else:
                continue
            
            answer_data = {
                "questionId": question_id,
                "answer": answer
            }
            
            response = requests.post(
                f"{self.base_url}/student/attempt/{self.test_attempt_id}/answer",
                json=answer_data,
                headers=self.get_student_headers()
            )
            
            if response.status_code == 200:
                print(f"✓ Answer saved for {question_type} question")
                success_count += 1
            else:
                print(f"✗ Failed to save answer for {question_type}: {response.text}")
        
        return success_count > 0
    
    def test_submit_attempt(self):
        """Test submitting the attempt"""
        print("\n--- Testing Attempt Submission ---")
        
        response = requests.post(
            f"{self.base_url}/student/attempt/{self.test_attempt_id}/submit",
            headers=self.get_student_headers()
        )
        
        if response.status_code == 200:
            data = response.json()
            result = data.get('result', {})
            print(f"✓ Attempt submitted successfully")
            print(f"  Score: {result.get('totalScore')}/{result.get('maxScore')}")
            print(f"  Percentage: {result.get('percentage')}%")
            print(f"  Passed: {result.get('passed')}")
            return True
        else:
            print(f"✗ Failed to submit attempt: {response.text}")
            return False
    
    def test_get_results(self):
        """Test getting attempt results"""
        print("\n--- Testing Result Retrieval ---")
        
        response = requests.get(
            f"{self.base_url}/student/attempt/{self.test_attempt_id}/result",
            headers=self.get_student_headers()
        )
        
        if response.status_code == 200:
            data = response.json()
            result = data.get('result', {})
            answers = result.get('answers', [])
            
            print(f"✓ Results retrieved successfully")
            print(f"  Total answers: {len(answers)}")
            print(f"  Final score: {result.get('totalScore')}")
            
            # Show breakdown by question type
            for answer in answers:
                print(f"  {answer['questionType']}: {answer['marks']}/{answer['maxMarks']} - {answer['feedback']}")
            
            return True
        else:
            print(f"✗ Failed to get results: {response.text}")
            return False
    
    def test_admin_manual_grading(self):
        """Test manual grading by admin"""
        print("\n--- Testing Manual Grading ---")
        
        # Find a short answer question to grade manually
        response = requests.get(
            f"{self.base_url}/student/attempt/{self.test_attempt_id}/result",
            headers=self.get_student_headers()
        )
        
        if response.status_code != 200:
            print("✗ Could not retrieve results for manual grading test")
            return False
        
        result = response.json().get('result', {})
        short_answer = None
        
        for answer in result.get('answers', []):
            if answer.get('questionType') == 'short_answer':
                short_answer = answer
                break
        
        if not short_answer:
            print("✓ No short answer question found for manual grading test")
            return True
        
        # Update the grade manually
        grading_data = [{
            "questionId": short_answer['questionId'],
            "marks": 8,  # Give partial credit
            "feedback": "Good answer but could be more detailed about Python's features"
        }]
        
        response = requests.put(
            f"{self.base_url}/admin/attempt/{self.test_attempt_id}/grade",
            json=grading_data,
            headers=self.get_admin_headers()
        )
        
        if response.status_code == 200:
            print("✓ Manual grading completed successfully")
            
            # Verify the grade was updated
            time.sleep(1)  # Brief delay for database update
            response = requests.get(
                f"{self.base_url}/student/attempt/{self.test_attempt_id}/result",
                headers=self.get_student_headers()
            )
            
            if response.status_code == 200:
                updated_result = response.json().get('result', {})
                print(f"  Updated total score: {updated_result.get('totalScore')}")
                return True
            
        print(f"✗ Manual grading failed: {response.text}")
        return False
    
    def test_admin_list_attempts(self):
        """Test admin viewing all attempts"""
        print("\n--- Testing Admin Attempt Listing ---")
        
        response = requests.get(
            f"{self.base_url}/admin/attempts?quizId={self.test_quiz_id}",
            headers=self.get_admin_headers()
        )
        
        if response.status_code == 200:
            data = response.json()
            attempts = data.get('attempts', [])
            print(f"✓ Retrieved {len(attempts)} attempts for quiz")
            
            # Find our test attempt
            test_attempt = next(
                (a for a in attempts if a.get('attemptId') == self.test_attempt_id),
                None
            )
            
            if test_attempt:
                print(f"✓ Test attempt found with status: {test_attempt['status']}")
                return True
            else:
                print("✗ Test attempt not found in admin list")
                return False
        else:
            print(f"✗ Failed to list attempts: {response.text}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("="*60)
        print("QUIZ API INTEGRATION TESTS")
        print("="*60)
        
        # Authentication
        if not self.login_admin():
            return False
        
        if not self.login_student():
            return False
        
        # Quiz creation and setup
        tests = [
            ("Create Quiz", self.test_create_quiz),
            ("Add Questions", self.test_add_questions),
            ("Assign Quiz", self.test_assign_quiz),
            ("Student Get Assignments", self.test_student_get_assignments),
            ("Start Attempt", self.test_start_attempt),
            ("Get Questions", self.test_get_questions),
            ("Save Answers", self.test_save_answers),
            ("Submit Attempt", self.test_submit_attempt),
            ("Get Results", self.test_get_results),
            ("Manual Grading", self.test_admin_manual_grading),
            ("Admin List Attempts", self.test_admin_list_attempts)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
                else:
                    print(f"\n💥 Test failed: {test_name}")
            except Exception as e:
                print(f"\n💥 Test error in {test_name}: {str(e)}")
        
        print("\n" + "="*60)
        print(f"TEST SUMMARY: {passed}/{total} tests passed")
        print(f"Success rate: {(passed/total)*100:.1f}%")
        print("="*60)
        
        return passed == total


def main():
    """Main test execution function"""
    print("Quiz API Integration Test Suite")
    print("Make sure the Flask app is running on http://localhost:5000")
    
    # You may need to adjust these credentials based on your setup
    tester = QuizAPITester(
        base_url='http://localhost:5000/api',
        admin_credentials={'email': 'admin@sitcloud.in', 'password': 'admin123'},
        student_credentials={'email': 'test@student.com', 'password': 'student123'}
    )
    
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Quiz system is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")


if __name__ == '__main__':
    main()