"""
Scoring System for Quiz Application
Handles automated scoring for different question types and manual grading
"""

import re
from typing import Dict, List, Any, Tuple, Optional
from datetime import datetime
import pytz

tz_IST = pytz.timezone('Asia/Kolkata')

class ScoringEngine:
    """Main scoring engine for quiz attempts"""
    
    def __init__(self):
        self.question_scorers = {
            'single_choice': self._score_single_choice,
            'multiple_choice': self._score_multiple_choice,
            'numeric': self._score_numeric,
            'short_answer': self._score_short_answer
        }
    
    def score_attempt(self, questions: List[Dict], answers: List[Dict]) -> Dict:
        """
        Score an entire attempt
        
        Args:
            questions: List of question documents
            answers: List of student answers
            
        Returns:
            Dict with scoring results
        """
        total_score = 0
        max_score = 0
        scored_answers = []
        
        # Create answer lookup for efficiency
        answer_lookup = {ans['questionId']: ans for ans in answers}
        
        for question in questions:
            question_id = question['questionId']
            max_score += question['marks']
            
            if question_id in answer_lookup:
                student_answer = answer_lookup[question_id]
                score_result = self.score_question(question, student_answer['answer'])
                
                scored_answer = {
                    'questionId': question_id,
                    'answer': student_answer['answer'],
                    'answeredAt': student_answer.get('answeredAt'),
                    'marks': score_result['marks'],
                    'isCorrect': score_result['is_correct'],
                    'feedback': score_result.get('feedback', '')
                }
                
                total_score += score_result['marks']
                scored_answers.append(scored_answer)
            else:
                # Question not answered
                scored_answers.append({
                    'questionId': question_id,
                    'answer': None,
                    'answeredAt': None,
                    'marks': 0,
                    'isCorrect': False,
                    'feedback': 'Not answered'
                })
        
        percentage = (total_score / max_score * 100) if max_score > 0 else 0
        
        return {
            'total_score': total_score,
            'max_score': max_score,
            'percentage': round(percentage, 2),
            'scored_answers': scored_answers
        }
    
    def score_question(self, question: Dict, student_answer: Any) -> Dict:
        """
        Score a single question
        
        Args:
            question: Question document
            student_answer: Student's answer
            
        Returns:
            Dict with scoring result
        """
        question_type = question['type']
        scorer = self.question_scorers.get(question_type)
        
        if not scorer:
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': f'Unknown question type: {question_type}'
            }
        
        try:
            return scorer(question, student_answer)
        except Exception as e:
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': f'Error scoring question: {str(e)}'
            }
    
    def _score_single_choice(self, question: Dict, student_answer: Any) -> Dict:
        """Score single choice question"""
        if student_answer is None or student_answer == '':
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': 'No answer provided'
            }
        
        correct_answer = question['correctAnswer']
        is_correct = str(student_answer).strip() == str(correct_answer).strip()
        
        marks = question['marks'] if is_correct else 0
        feedback = question.get('explanation', '') if is_correct else 'Incorrect answer'
        
        return {
            'marks': marks,
            'is_correct': is_correct,
            'feedback': feedback
        }
    
    def _score_multiple_choice(self, question: Dict, student_answer: Any) -> Dict:
        """Score multiple choice question"""
        if student_answer is None or not isinstance(student_answer, list):
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': 'No valid answer provided'
            }
        
        correct_answers = set(question['correctAnswer'])
        student_answers = set(str(ans).strip() for ans in student_answer)
        
        # Calculate partial scoring
        correct_selected = len(correct_answers.intersection(student_answers))
        incorrect_selected = len(student_answers - correct_answers)
        total_correct = len(correct_answers)
        
        # Scoring logic: (correct_selected - incorrect_selected) / total_correct
        # Minimum score is 0
        score_ratio = max(0, (correct_selected - incorrect_selected) / total_correct)
        marks = round(question['marks'] * score_ratio, 2)
        
        is_correct = student_answers == correct_answers
        
        if is_correct:
            feedback = question.get('explanation', 'All correct answers selected')
        elif marks > 0:
            feedback = f'Partial credit: {correct_selected}/{total_correct} correct'
        else:
            feedback = 'Incorrect selection'
        
        return {
            'marks': marks,
            'is_correct': is_correct,
            'feedback': feedback
        }
    
    def _score_numeric(self, question: Dict, student_answer: Any) -> Dict:
        """Score numeric question with tolerance"""
        if student_answer is None or student_answer == '':
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': 'No answer provided'
            }
        
        try:
            student_value = float(student_answer)
            correct_value = float(question['correctAnswer'])
            
            # Default tolerance is 0.01 or can be specified in question
            tolerance = question.get('tolerance', 0.01)
            
            is_correct = abs(student_value - correct_value) <= tolerance
            marks = question['marks'] if is_correct else 0
            
            if is_correct:
                feedback = question.get('explanation', 'Correct numerical answer')
            else:
                feedback = f'Incorrect. Expected: {correct_value}'
            
            return {
                'marks': marks,
                'is_correct': is_correct,
                'feedback': feedback
            }
            
        except (ValueError, TypeError):
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': 'Invalid numerical answer format'
            }
    
    def _score_short_answer(self, question: Dict, student_answer: Any) -> Dict:
        """Score short answer question using keyword matching"""
        if student_answer is None or student_answer == '':
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': 'No answer provided',
                'requires_manual_grading': True
            }
        
        student_text = str(student_answer).strip().lower()
        
        # Get keywords for automatic scoring
        keywords = question.get('keywords', [])
        required_keywords = question.get('required_keywords', [])
        
        if not keywords and not required_keywords:
            # No keywords defined, requires manual grading
            return {
                'marks': 0,
                'is_correct': False,
                'feedback': 'Requires manual grading',
                'requires_manual_grading': True
            }
        
        # Check for required keywords
        missing_required = []
        for keyword in required_keywords:
            if keyword.lower() not in student_text:
                missing_required.append(keyword)
        
        # Count optional keywords found
        keywords_found = 0
        for keyword in keywords:
            if keyword.lower() in student_text:
                keywords_found += 1
        
        # Scoring logic
        if missing_required:
            # Missing required keywords = 0 marks
            marks = 0
            is_correct = False
            feedback = f'Missing required keywords: {", ".join(missing_required)}'
            keyword_ratio = 0
        else:
            # Score based on keyword coverage
            keyword_ratio = keywords_found / max(len(keywords), 1)
            marks = round(question['marks'] * keyword_ratio, 2)
            is_correct = keyword_ratio >= 0.7  # 70% keyword match threshold
            
            if is_correct:
                feedback = question.get('explanation', 'Good keyword coverage')
            else:
                feedback = f'Found {keywords_found}/{len(keywords)} expected keywords'
        
        return {
            'marks': marks,
            'is_correct': is_correct,
            'feedback': feedback,
            'requires_manual_grading': keyword_ratio < 1.0 and len(keywords) > 0
        }

class ManualGradingHelper:
    """Helper class for manual grading operations"""
    
    @staticmethod
    def update_question_score(attempt_id: str, question_id: str, new_marks: float, 
                            feedback: str, graded_by: str, mongo_db) -> bool:
        """
        Update manual score for a specific question in an attempt
        
        Args:
            attempt_id: ID of the attempt
            question_id: ID of the question  
            new_marks: New marks to assign
            feedback: Grading feedback
            graded_by: Email of grader
            mongo_db: MongoDB database instance
            
        Returns:
            bool: Success status
        """
        try:
            # Update the specific answer in the attempt
            result = mongo_db.attempts.update_one(
                {
                    "attemptId": attempt_id,
                    "answers.questionId": question_id
                },
                {
                    "$set": {
                        "answers.$.marks": new_marks,
                        "answers.$.feedback": feedback,
                        "updatedAt": datetime.now(tz_IST).isoformat()
                    }
                }
            )
            
            if result.modified_count > 0:
                # Recalculate total score
                ManualGradingHelper.recalculate_attempt_score(attempt_id, mongo_db)
                
                # Log the manual grading action
                log_entry = {
                    "logId": f"log_{attempt_id}_{question_id}_{int(datetime.now().timestamp())}",
                    "attemptId": attempt_id,
                    "quizId": "",  # Will be filled from attempt data
                    "studentEmail": "",  # Will be filled from attempt data
                    "actionType": "grade_updated",
                    "actionData": {
                        "questionId": question_id,
                        "newMarks": new_marks,
                        "feedback": feedback
                    },
                    "performedBy": graded_by,
                    "timestamp": datetime.now(tz_IST).isoformat()
                }
                
                # Get attempt data for quiz and student info
                attempt = mongo_db.attempts.find_one({"attemptId": attempt_id})
                if attempt:
                    log_entry["quizId"] = attempt["quizId"]
                    log_entry["studentEmail"] = attempt["studentEmail"]
                
                mongo_db.result_logs.insert_one(log_entry)
                return True
            
            return False
            
        except Exception as e:
            print(f"Error updating manual score: {e}")
            return False
    
    @staticmethod
    def recalculate_attempt_score(attempt_id: str, mongo_db) -> None:
        """Recalculate total score for an attempt after manual grading"""
        try:
            attempt = mongo_db.attempts.find_one({"attemptId": attempt_id})
            if not attempt:
                return
            
            total_score = sum(answer.get('marks', 0) for answer in attempt.get('answers', []))
            max_score = attempt.get('maxScore', 0)
            percentage = (total_score / max_score * 100) if max_score > 0 else 0
            
            # Update attempt with new totals
            mongo_db.attempts.update_one(
                {"attemptId": attempt_id},
                {
                    "$set": {
                        "totalScore": total_score,
                        "percentage": round(percentage, 2),
                        "passed": percentage >= 40,  # Assuming 40% passing grade
                        "updatedAt": datetime.now(tz_IST).isoformat()
                    }
                }
            )
            
        except Exception as e:
            print(f"Error recalculating attempt score: {e}")

class TimerEnforcement:
    """Handle timer enforcement and late submission logic"""
    
    @staticmethod
    def is_submission_late(due_at: str, submitted_at: str = None) -> bool:
        """Check if submission is late"""
        if submitted_at is None:
            submitted_at = datetime.now(tz_IST).isoformat()
        
        due_time = datetime.fromisoformat(due_at.replace('Z', '+00:00'))
        submit_time = datetime.fromisoformat(submitted_at.replace('Z', '+00:00'))
        
        return submit_time > due_time
    
    @staticmethod
    def calculate_late_penalty(quiz_settings: Dict, minutes_late: int) -> float:
        """Calculate late penalty based on quiz settings"""
        behavior = quiz_settings.get('lateSubmissionBehavior', 'mark_late')
        penalty_percent = quiz_settings.get('latePenaltyPercent', 10)
        
        if behavior == 'reject':
            return 100  # Full penalty (0 marks)
        elif behavior == 'accept_with_penalty':
            # Calculate penalty based on time late
            # For example: 1% per minute late, up to maximum penalty
            penalty = min(minutes_late * 1, penalty_percent)
            return penalty
        else:  # mark_late
            return 0  # No penalty, just marked as late
    
    @staticmethod
    def handle_late_submission(attempt_id: str, quiz_settings: Dict, mongo_db) -> bool:
        """Handle late submission according to quiz settings"""
        try:
            attempt = mongo_db.attempts.find_one({"attemptId": attempt_id})
            if not attempt:
                return False
            
            due_at = attempt['dueAt']
            submitted_at = attempt.get('submittedAt') or datetime.now(tz_IST).isoformat()
            
            if not TimerEnforcement.is_submission_late(due_at, submitted_at):
                return True  # Not late, no action needed
            
            # Calculate how late the submission is
            due_time = datetime.fromisoformat(due_at.replace('Z', '+00:00'))
            submit_time = datetime.fromisoformat(submitted_at.replace('Z', '+00:00'))
            minutes_late = int((submit_time - due_time).total_seconds() / 60)
            
            penalty = TimerEnforcement.calculate_late_penalty(quiz_settings, minutes_late)
            
            behavior = quiz_settings.get('lateSubmissionBehavior', 'mark_late')
            
            if behavior == 'reject':
                # Reject submission, set score to 0
                mongo_db.attempts.update_one(
                    {"attemptId": attempt_id},
                    {
                        "$set": {
                            "status": "rejected",
                            "totalScore": 0,
                            "percentage": 0,
                            "passed": False,
                            "isLateSubmission": True,
                            "latePenaltyApplied": penalty,
                            "updatedAt": datetime.now(tz_IST).isoformat()
                        }
                    }
                )
            else:
                # Apply penalty to score
                current_score = attempt.get('totalScore', 0)
                penalized_score = current_score * (1 - penalty / 100)
                max_score = attempt.get('maxScore', 0)
                new_percentage = (penalized_score / max_score * 100) if max_score > 0 else 0
                
                mongo_db.attempts.update_one(
                    {"attemptId": attempt_id},
                    {
                        "$set": {
                            "totalScore": round(penalized_score, 2),
                            "percentage": round(new_percentage, 2),
                            "passed": new_percentage >= 40,  # Assuming 40% passing grade
                            "isLateSubmission": True,
                            "latePenaltyApplied": penalty,
                            "updatedAt": datetime.now(tz_IST).isoformat()
                        }
                    }
                )
            
            return True
            
        except Exception as e:
            print(f"Error handling late submission: {e}")
            return False