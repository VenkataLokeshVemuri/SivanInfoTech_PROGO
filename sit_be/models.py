"""
MongoDB Models for Quiz System
Using PyMongo with structured document schemas for validation
"""
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any
import pytz

# Timezone configuration
tz_IST = pytz.timezone('Asia/Kolkata')

class QuestionType:
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice" 
    NUMERIC = "numeric"
    SHORT_ANSWER = "short_answer"

class QuizSettings:
    ACCEPT_WITH_PENALTY = "accept_with_penalty"
    REJECT = "reject"
    MARK_LATE = "mark_late"

class AttemptStatus:
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    AUTO_SUBMITTED = "auto_submitted"
    TIMED_OUT = "timed_out"

# MongoDB Document Schemas for validation

def get_user_schema():
    """User document schema - extends existing user collection"""
    return {
        "email": {"type": "string", "required": True},
        "firstName": {"type": "string", "required": True},
        "lastName": {"type": "string", "required": True},
        "password": {"type": "string", "required": True},
        "role": {"type": "string", "enum": ["ADMIN", "STUDENT"], "required": True},
        "phone": {"type": "string"},
        "verified": {"type": "boolean", "default": False},
        "isFromCollege": {"type": "boolean"},
        "collegeName": {"type": "string"},
        "registered_on": {"type": "string"},
        "loginToken": {"type": "string"},
        "enrollments": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "enrollmentID": {"type": "string"},
                    "courseID": {"type": "string"},
                    "courseShortForm": {"type": "string"},
                    "courseTitle": {"type": "string"},
                    "enrolledDate": {"type": "string"},
                    "enrollmentStatus": {"type": "string"},
                    "certificationID": {"type": "string"},
                    "batchDetails": {"type": "object"}
                }
            }
        }
    }

def get_batch_schema():
    """Batch document schema"""
    return {
        "batchId": {"type": "string", "required": True},
        "courseId": {"type": "string", "required": True},
        "batchName": {"type": "string", "required": True},
        "startDate": {"type": "string", "required": True},
        "endDate": {"type": "string", "required": True},
        "instructor": {"type": "string"},
        "maxStudents": {"type": "integer"},
        "enrolledStudents": {
            "type": "array",
            "items": {"type": "string"}  # student email IDs
        },
        "createdAt": {"type": "string"},
        "updatedAt": {"type": "string"},
        "status": {"type": "string", "enum": ["active", "inactive", "completed"], "default": "active"}
    }

def get_student_batch_schema():
    """StudentBatch junction document schema"""
    return {
        "studentEmail": {"type": "string", "required": True},
        "batchId": {"type": "string", "required": True},
        "enrolledAt": {"type": "string", "required": True},
        "status": {"type": "string", "enum": ["enrolled", "withdrawn", "completed"], "default": "enrolled"},
        "completionDate": {"type": "string"},
        "grade": {"type": "string"}
    }

def get_quiz_schema():
    """Quiz document schema"""
    return {
        "quizId": {"type": "string", "required": True},
        "title": {"type": "string", "required": True},
        "description": {"type": "string"},
        "courseId": {"type": "string", "required": True},
        "duration": {"type": "integer", "required": True},  # in minutes
        "totalMarks": {"type": "integer", "required": True},
        "passingMarks": {"type": "integer", "required": True},
        "instructions": {"type": "string"},
        "settings": {
            "type": "object",
            "properties": {
                "lateSubmissionBehavior": {
                    "type": "string",
                    "enum": ["accept_with_penalty", "reject", "mark_late"],
                    "default": "mark_late"
                },
                "latePenaltyPercent": {"type": "number", "default": 10},
                "allowRetake": {"type": "boolean", "default": False},
                "maxAttempts": {"type": "integer", "default": 1},
                "shuffleQuestions": {"type": "boolean", "default": False},
                "showResultsImmediately": {"type": "boolean", "default": True},
                "requireProctoring": {"type": "boolean", "default": False}
            }
        },
        "questionIds": {
            "type": "array",
            "items": {"type": "string"}
        },
        "isActive": {"type": "boolean", "default": True},
        "createdBy": {"type": "string", "required": True},
        "createdAt": {"type": "string", "required": True},
        "updatedAt": {"type": "string"}
    }

def get_question_schema():
    """Question document schema"""
    return {
        "questionId": {"type": "string", "required": True},
        "quizId": {"type": "string", "required": True},
        "type": {
            "type": "string",
            "enum": ["single_choice", "multiple_choice", "numeric", "short_answer"],
            "required": True
        },
        "questionText": {"type": "string", "required": True},
        "marks": {"type": "integer", "required": True},
        "order": {"type": "integer", "required": True},
        "options": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "optionId": {"type": "string"},
                    "text": {"type": "string"},
                    "isCorrect": {"type": "boolean"}
                }
            }
        },
        "correctAnswer": {
            "anyOf": [
                {"type": "string"},
                {"type": "number"},
                {"type": "array", "items": {"type": "string"}}
            ]
        },
        "explanation": {"type": "string"},
        "tags": {
            "type": "array",
            "items": {"type": "string"}
        },
        "difficulty": {"type": "string", "enum": ["easy", "medium", "hard"]},
        "createdAt": {"type": "string"},
        "updatedAt": {"type": "string"}
    }

def get_quiz_assignment_schema():
    """QuizAssignment document schema"""
    return {
        "assignmentId": {"type": "string", "required": True},
        "quizId": {"type": "string", "required": True},
        "assignedBy": {"type": "string", "required": True},
        "assignedAt": {"type": "string", "required": True},
        "dueDate": {"type": "string", "required": True},
        "assignmentType": {"type": "string", "enum": ["batch", "individual"], "required": True},
        "assignedTo": {
            "type": "object",
            "properties": {
                "batchIds": {"type": "array", "items": {"type": "string"}},
                "studentEmails": {"type": "array", "items": {"type": "string"}}
            }
        },
        "maxAttempts": {"type": "integer", "default": 1},
        "instructions": {"type": "string"},
        "isActive": {"type": "boolean", "default": True},
        "createdAt": {"type": "string"},
        "updatedAt": {"type": "string"}
    }

def get_attempt_schema():
    """Attempt document schema"""
    return {
        "attemptId": {"type": "string", "required": True},
        "quizId": {"type": "string", "required": True},
        "assignmentId": {"type": "string", "required": True},
        "studentEmail": {"type": "string", "required": True},
        "attemptNumber": {"type": "integer", "required": True},
        "startedAt": {"type": "string", "required": True},
        "submittedAt": {"type": "string"},
        "dueAt": {"type": "string", "required": True},
        "status": {
            "type": "string",
            "enum": ["in_progress", "submitted", "auto_submitted", "timed_out"],
            "default": "in_progress"
        },
        "answers": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "questionId": {"type": "string"},
                    "answer": {
                        "anyOf": [
                            {"type": "string"},
                            {"type": "number"},
                            {"type": "array", "items": {"type": "string"}}
                        ]
                    },
                    "answeredAt": {"type": "string"},
                    "marks": {"type": "number"},
                    "isCorrect": {"type": "boolean"},
                    "feedback": {"type": "string"}
                }
            }
        },
        "totalScore": {"type": "number"},
        "maxScore": {"type": "number"},
        "percentage": {"type": "number"},
        "passed": {"type": "boolean"},
        "isLateSubmission": {"type": "boolean", "default": False},
        "latePenaltyApplied": {"type": "number", "default": 0},
        "timeSpent": {"type": "integer"},  # in seconds
        "clientInfo": {
            "type": "object",
            "properties": {
                "userAgent": {"type": "string"},
                "ipAddress": {"type": "string"},
                "screenResolution": {"type": "string"}
            }
        },
        "createdAt": {"type": "string"},
        "updatedAt": {"type": "string"}
    }

def get_result_log_schema():
    """ResultLog document schema"""
    return {
        "logId": {"type": "string", "required": True},
        "attemptId": {"type": "string", "required": True},
        "quizId": {"type": "string", "required": True},
        "studentEmail": {"type": "string", "required": True},
        "actionType": {
            "type": "string",
            "enum": ["attempt_started", "answer_saved", "attempt_submitted", "grade_updated", "feedback_added"],
            "required": True
        },
        "actionData": {"type": "object"},  # flexible data based on action type
        "performedBy": {"type": "string"},  # email of admin/student who performed action
        "timestamp": {"type": "string", "required": True},
        "metadata": {
            "type": "object",
            "properties": {
                "oldValue": {"type": "string"},
                "newValue": {"type": "string"},
                "reason": {"type": "string"}
            }
        }
    }

# Helper functions for document creation
def create_quiz_document(quiz_data: Dict) -> Dict:
    """Create a quiz document with default values"""
    now = datetime.now(tz_IST).isoformat()
    
    quiz = {
        "quizId": quiz_data.get("quizId"),
        "title": quiz_data.get("title"),
        "description": quiz_data.get("description", ""),
        "courseId": quiz_data.get("courseId"),
        "duration": quiz_data.get("duration"),
        "totalMarks": quiz_data.get("totalMarks", 0),
        "passingMarks": quiz_data.get("passingMarks", 0),
        "instructions": quiz_data.get("instructions", ""),
        "settings": {
            "lateSubmissionBehavior": quiz_data.get("settings", {}).get("lateSubmissionBehavior", "mark_late"),
            "latePenaltyPercent": quiz_data.get("settings", {}).get("latePenaltyPercent", 10),
            "allowRetake": quiz_data.get("settings", {}).get("allowRetake", False),
            "maxAttempts": quiz_data.get("settings", {}).get("maxAttempts", 1),
            "shuffleQuestions": quiz_data.get("settings", {}).get("shuffleQuestions", False),
            "showResultsImmediately": quiz_data.get("settings", {}).get("showResultsImmediately", True),
            "requireProctoring": quiz_data.get("settings", {}).get("requireProctoring", False)
        },
        "questionIds": quiz_data.get("questionIds", []),
        "isActive": quiz_data.get("isActive", True),
        "createdBy": quiz_data.get("createdBy"),
        "createdAt": now,
        "updatedAt": now
    }
    
    return quiz

def create_attempt_document(attempt_data: Dict) -> Dict:
    """Create an attempt document with calculated due time"""
    started_at = datetime.now(tz_IST)
    duration_minutes = attempt_data.get("duration", 60)
    due_at = started_at + timedelta(minutes=duration_minutes)
    
    attempt = {
        "attemptId": attempt_data.get("attemptId"),
        "quizId": attempt_data.get("quizId"),
        "assignmentId": attempt_data.get("assignmentId"),
        "studentEmail": attempt_data.get("studentEmail"),
        "attemptNumber": attempt_data.get("attemptNumber", 1),
        "startedAt": started_at.isoformat(),
        "submittedAt": None,
        "dueAt": due_at.isoformat(),
        "status": "in_progress",
        "answers": [],
        "totalScore": None,
        "maxScore": attempt_data.get("maxScore"),
        "percentage": None,
        "passed": None,
        "isLateSubmission": False,
        "latePenaltyApplied": 0,
        "timeSpent": 0,
        "clientInfo": attempt_data.get("clientInfo", {}),
        "createdAt": started_at.isoformat(),
        "updatedAt": started_at.isoformat()
    }
    
    return attempt