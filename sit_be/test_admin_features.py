#!/usr/bin/env python3
"""
Test Script for Admin Quiz Management
This script demonstrates the quiz creation and management features
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:5000/api"
ADMIN_EMAIL = "admin@sitcloud.in"
ADMIN_PASSWORD = "admin123"

def login_admin():
    """Login as admin and get JWT token"""
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/signin", json=login_data)
    if response.status_code == 200:
        data = response.json()
        return data.get('token')
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def create_sample_quiz(token):
    """Create a sample quiz"""
    headers = {"Authorization": f"Bearer {token}"}
    
    quiz_data = {
        "title": "AWS Solutions Architect Fundamentals Quiz",
        "description": "Test your knowledge of AWS core services and architecture principles",
        "courseId": "AWS-001",
        "duration": 30,  # 30 minutes
        "totalMarks": 100,
        "passingMarks": 70,
        "instructions": "Read each question carefully. You have 30 minutes to complete this quiz.",
        "settings": {
            "shuffleQuestions": True,
            "showResultsImmediately": True,
            "allowReview": True,
            "preventCheating": True
        }
    }
    
    response = requests.post(f"{BASE_URL}/admin/quiz", json=quiz_data, headers=headers)
    if response.status_code == 201:
        data = response.json()
        print(f"✅ Quiz created successfully: {data.get('quizId')}")
        return data.get('quizId')
    else:
        print(f"❌ Quiz creation failed: {response.text}")
        return None

def add_sample_questions(token, quiz_id):
    """Add sample questions to the quiz"""
    headers = {"Authorization": f"Bearer {token}"}
    
    questions = [
        {
            "type": "single_choice",
            "questionText": "What does EC2 stand for in AWS?",
            "marks": 10,
            "options": [
                "Elastic Compute Cloud",
                "Enhanced Computer Cluster", 
                "Elastic Container Cloud",
                "Extended Computing Center"
            ],
            "correctAnswer": "Elastic Compute Cloud",
            "explanation": "EC2 stands for Elastic Compute Cloud, AWS's web service for resizable compute capacity.",
            "order": 1
        },
        {
            "type": "multiple_choice",
            "questionText": "Which of the following are AWS storage services? (Select all that apply)",
            "marks": 15,
            "options": [
                "Amazon S3",
                "Amazon EBS", 
                "Amazon RDS",
                "Amazon EFS"
            ],
            "correctAnswer": ["Amazon S3", "Amazon EBS", "Amazon EFS"],
            "explanation": "S3, EBS, and EFS are storage services. RDS is a database service.",
            "order": 2
        },
        {
            "type": "single_choice",
            "questionText": "What is the default region for AWS CLI if not specified?",
            "marks": 10,
            "options": [
                "us-east-1",
                "us-west-2",
                "eu-west-1",
                "No default region"
            ],
            "correctAnswer": "us-east-1",
            "explanation": "us-east-1 (N. Virginia) is the default region for AWS CLI.",
            "order": 3
        },
        {
            "type": "short_answer",
            "questionText": "What is the maximum size of an S3 object?",
            "marks": 15,
            "correctAnswer": "5TB",
            "explanation": "The maximum size of a single S3 object is 5 terabytes.",
            "order": 4
        },
        {
            "type": "single_choice",
            "questionText": "Which AWS service provides a managed NoSQL database?",
            "marks": 10,
            "options": [
                "Amazon RDS",
                "Amazon DynamoDB",
                "Amazon RedShift",
                "Amazon Aurora"
            ],
            "correctAnswer": "Amazon DynamoDB",
            "explanation": "DynamoDB is AWS's managed NoSQL database service.",
            "order": 5
        }
    ]
    
    created_questions = []
    for question in questions:
        response = requests.post(f"{BASE_URL}/admin/quiz/{quiz_id}/question", 
                               json=question, headers=headers)
        if response.status_code == 201:
            data = response.json()
            created_questions.append(data.get('questionId'))
            print(f"✅ Question added: {question['questionText'][:50]}...")
        else:
            print(f"❌ Failed to add question: {response.text}")
    
    return created_questions

def assign_quiz_to_course(token, quiz_id):
    """Assign quiz to a course batch"""
    headers = {"Authorization": f"Bearer {token}"}
    
    assignment_data = {
        "quizId": quiz_id,
        "assignmentType": "batch",
        "assignedTo": {
            "batchIds": ["AWS001-B1", "AWS001-B2"]
        },
        "dueDate": "2025-12-31T23:59:59Z",
        "maxAttempts": 3,
        "instructions": "This quiz is mandatory for AWS certification track students."
    }
    
    response = requests.post(f"{BASE_URL}/admin/quiz/assign", 
                           json=assignment_data, headers=headers)
    if response.status_code == 201:
        data = response.json()
        print(f"✅ Quiz assigned to batches: {data.get('assignmentId')}")
        return data.get('assignmentId')
    else:
        print(f"❌ Quiz assignment failed: {response.text}")
        return None

def list_quizzes(token):
    """List all quizzes"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/admin/quizzes", headers=headers)
    if response.status_code == 200:
        data = response.json()
        quizzes = data.get('quizzes', [])
        print(f"\n📋 Total Quizzes: {len(quizzes)}")
        for quiz in quizzes:
            print(f"  - {quiz['title']} (ID: {quiz['quizId']})")
        return quizzes
    else:
        print(f"❌ Failed to list quizzes: {response.text}")
        return []

def get_course_list(token):
    """Get list of courses"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/courselist", headers=headers)
    if response.status_code == 200:
        data = response.json()
        courses = data.get('courses', [])
        print(f"\n📚 Available Courses: {len(courses)}")
        for course in courses:
            print(f"  - {course['title']} (ID: {course['courseid']})")
            if 'batches' in course:
                for batch in course['batches']:
                    print(f"    └─ Batch: {batch['batchId']} ({batch['startdate']} to {batch['enddate']})")
        return courses
    else:
        print(f"❌ Failed to get courses: {response.text}")
        return []

def main():
    print("🚀 SivanInfoTech Admin Dashboard Demo")
    print("=" * 50)
    
    # Login as admin
    print("\n1. Logging in as admin...")
    token = login_admin()
    if not token:
        return
    print("✅ Admin login successful!")
    
    # Get course list
    print("\n2. Fetching available courses...")
    courses = get_course_list(token)
    
    # List existing quizzes
    print("\n3. Listing existing quizzes...")
    existing_quizzes = list_quizzes(token)
    
    # Create a new quiz
    print("\n4. Creating sample quiz...")
    quiz_id = create_sample_quiz(token)
    if not quiz_id:
        return
    
    # Add questions to the quiz
    print("\n5. Adding sample questions...")
    questions = add_sample_questions(token, quiz_id)
    
    # Assign quiz to course batches
    print("\n6. Assigning quiz to course batches...")
    assignment_id = assign_quiz_to_course(token, quiz_id)
    
    # List updated quizzes
    print("\n7. Updated quiz list...")
    updated_quizzes = list_quizzes(token)
    
    print("\n" + "=" * 50)
    print("🎉 Admin Dashboard Demo Completed!")
    print("\n📊 Summary:")
    print(f"  - Courses Available: {len(courses)}")
    print(f"  - Total Quizzes: {len(updated_quizzes)}")
    print(f"  - New Quiz ID: {quiz_id}")
    print(f"  - Questions Added: {len(questions)}")
    print(f"  - Assignment ID: {assignment_id}")
    
    print("\n🌐 Test in MongoDB Compass:")
    print("  - Connection: mongodb://localhost:27017/")
    print("  - Database: sivaninfo_db")
    print("  - Collections: users, courses, quizzes, questions, quiz_assignments")
    
    print("\n🔧 Next Steps:")
    print("  1. Open MongoDB Compass and connect to the database")
    print("  2. Browse the created collections and documents")
    print("  3. Test the frontend login with admin credentials")
    print("  4. Access the admin dashboard to manage quizzes")

if __name__ == "__main__":
    main()