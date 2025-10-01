"""
Unit Tests for Quiz Scoring System
Tests for automated scoring logic and manual grading functionality
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add the parent directory to the path to import our modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scoring import ScoringEngine, ManualGradingHelper, TimerEnforcement
from datetime import datetime, timedelta
import pytz

class TestScoringEngine(unittest.TestCase):
    """Test cases for the ScoringEngine class"""
    
    def setUp(self):
        self.engine = ScoringEngine()
        self.tz_IST = pytz.timezone('Asia/Kolkata')
    
    def test_score_single_choice_correct(self):
        """Test single choice question with correct answer"""
        question = {
            'questionId': 'q1',
            'type': 'single_choice',
            'marks': 5,
            'correctAnswer': 'B',
            'explanation': 'This is the correct answer'
        }
        
        result = self.engine.score_question(question, 'B')
        
        self.assertEqual(result['marks'], 5)
        self.assertTrue(result['is_correct'])
        self.assertEqual(result['feedback'], 'This is the correct answer')
    
    def test_score_single_choice_incorrect(self):
        """Test single choice question with incorrect answer"""
        question = {
            'questionId': 'q1',
            'type': 'single_choice',
            'marks': 5,
            'correctAnswer': 'B'
        }
        
        result = self.engine.score_question(question, 'A')
        
        self.assertEqual(result['marks'], 0)
        self.assertFalse(result['is_correct'])
        self.assertEqual(result['feedback'], 'Incorrect answer')
    
    def test_score_single_choice_no_answer(self):
        """Test single choice question with no answer"""
        question = {
            'questionId': 'q1',
            'type': 'single_choice',
            'marks': 5,
            'correctAnswer': 'B'
        }
        
        result = self.engine.score_question(question, None)
        
        self.assertEqual(result['marks'], 0)
        self.assertFalse(result['is_correct'])
        self.assertEqual(result['feedback'], 'No answer provided')
    
    def test_score_multiple_choice_all_correct(self):
        """Test multiple choice question with all correct answers"""
        question = {
            'questionId': 'q2',
            'type': 'multiple_choice',
            'marks': 10,
            'correctAnswer': ['A', 'C', 'D']
        }
        
        result = self.engine.score_question(question, ['A', 'C', 'D'])
        
        self.assertEqual(result['marks'], 10)
        self.assertTrue(result['is_correct'])
        self.assertIn('correct answers selected', result['feedback'])
    
    def test_score_multiple_choice_partial(self):
        """Test multiple choice question with partial correct answers"""
        question = {
            'questionId': 'q2',
            'type': 'multiple_choice',
            'marks': 10,
            'correctAnswer': ['A', 'C', 'D']
        }
        
        result = self.engine.score_question(question, ['A', 'C'])  # 2 out of 3 correct
        
        # Should get (2 - 0) / 3 * 10 = 6.67 marks
        self.assertAlmostEqual(result['marks'], 6.67, places=2)
        self.assertFalse(result['is_correct'])
        self.assertIn('Partial credit: 2/3', result['feedback'])
    
    def test_score_multiple_choice_with_incorrect(self):
        """Test multiple choice question with correct and incorrect selections"""
        question = {
            'questionId': 'q2',
            'type': 'multiple_choice',
            'marks': 10,
            'correctAnswer': ['A', 'C', 'D']
        }
        
        result = self.engine.score_question(question, ['A', 'B', 'C'])  # 2 correct, 1 incorrect
        
        # Should get (2 - 1) / 3 * 10 = 3.33 marks
        self.assertAlmostEqual(result['marks'], 3.33, places=2)
        self.assertFalse(result['is_correct'])
    
    def test_score_multiple_choice_no_answer(self):
        """Test multiple choice question with no answer"""
        question = {
            'questionId': 'q2',
            'type': 'multiple_choice',
            'marks': 10,
            'correctAnswer': ['A', 'C', 'D']
        }
        
        result = self.engine.score_question(question, None)
        
        self.assertEqual(result['marks'], 0)
        self.assertFalse(result['is_correct'])
        self.assertEqual(result['feedback'], 'No valid answer provided')
    
    def test_score_numeric_correct(self):
        """Test numeric question with correct answer"""
        question = {
            'questionId': 'q3',
            'type': 'numeric',
            'marks': 8,
            'correctAnswer': 42.5,
            'tolerance': 0.1
        }
        
        result = self.engine.score_question(question, 42.45)
        
        self.assertEqual(result['marks'], 8)
        self.assertTrue(result['is_correct'])
    
    def test_score_numeric_within_tolerance(self):
        """Test numeric question within tolerance"""
        question = {
            'questionId': 'q3',
            'type': 'numeric',
            'marks': 8,
            'correctAnswer': 42.5
        }
        
        result = self.engine.score_question(question, 42.505)  # Within default tolerance 0.01
        
        self.assertEqual(result['marks'], 8)  # Should get full marks
        self.assertTrue(result['is_correct'])
    
    def test_score_numeric_outside_tolerance(self):
        """Test numeric question outside tolerance"""
        question = {
            'questionId': 'q3',
            'type': 'numeric',
            'marks': 8,
            'correctAnswer': 42.5,
            'tolerance': 0.1
        }
        
        result = self.engine.score_question(question, 43.0)
        
        self.assertEqual(result['marks'], 0)
        self.assertFalse(result['is_correct'])
        self.assertIn('Expected: 42.5', result['feedback'])
    
    def test_score_numeric_invalid_format(self):
        """Test numeric question with invalid answer format"""
        question = {
            'questionId': 'q3',
            'type': 'numeric',
            'marks': 8,
            'correctAnswer': 42.5
        }
        
        result = self.engine.score_question(question, 'not_a_number')
        
        self.assertEqual(result['marks'], 0)
        self.assertFalse(result['is_correct'])
        self.assertEqual(result['feedback'], 'Invalid numerical answer format')
    
    def test_score_short_answer_with_keywords(self):
        """Test short answer with keyword matching"""
        question = {
            'questionId': 'q4',
            'type': 'short_answer',
            'marks': 6,
            'keywords': ['python', 'programming', 'language'],
            'required_keywords': ['python']
        }
        
        result = self.engine.score_question(question, 'Python is a programming language')
        
        self.assertEqual(result['marks'], 6)
        self.assertTrue(result['is_correct'])
    
    def test_score_short_answer_missing_required(self):
        """Test short answer missing required keywords"""
        question = {
            'questionId': 'q4',
            'type': 'short_answer',
            'marks': 6,
            'keywords': ['python', 'programming', 'language'],
            'required_keywords': ['python', 'object-oriented']
        }
        
        result = self.engine.score_question(question, 'This is a programming language')
        
        self.assertEqual(result['marks'], 0)
        self.assertFalse(result['is_correct'])
        self.assertIn('Missing required keywords', result['feedback'])
    
    def test_score_short_answer_no_keywords(self):
        """Test short answer with no keywords defined (requires manual grading)"""
        question = {
            'questionId': 'q4',
            'type': 'short_answer',
            'marks': 6
        }
        
        result = self.engine.score_question(question, 'Some answer')
        
        self.assertEqual(result['marks'], 0)
        self.assertFalse(result['is_correct'])
        self.assertEqual(result['feedback'], 'Requires manual grading')
        self.assertTrue(result.get('requires_manual_grading', False))
    
    def test_score_attempt_complete(self):
        """Test scoring a complete attempt"""
        questions = [
            {
                'questionId': 'q1',
                'type': 'single_choice',
                'marks': 5,
                'correctAnswer': 'B'
            },
            {
                'questionId': 'q2',
                'type': 'multiple_choice',
                'marks': 10,
                'correctAnswer': ['A', 'C']
            },
            {
                'questionId': 'q3',
                'type': 'numeric',
                'marks': 5,
                'correctAnswer': 100
            }
        ]
        
        answers = [
            {'questionId': 'q1', 'answer': 'B'},
            {'questionId': 'q2', 'answer': ['A', 'C']},
            {'questionId': 'q3', 'answer': 95}  # Wrong answer
        ]
        
        result = self.engine.score_attempt(questions, answers)
        
        self.assertEqual(result['total_score'], 15)  # 5 + 10 + 0
        self.assertEqual(result['max_score'], 20)
        self.assertEqual(result['percentage'], 75.0)
        self.assertEqual(len(result['scored_answers']), 3)
    
    def test_score_attempt_with_missing_answers(self):
        """Test scoring an attempt with some questions not answered"""
        questions = [
            {
                'questionId': 'q1',
                'type': 'single_choice',
                'marks': 5,
                'correctAnswer': 'B'
            },
            {
                'questionId': 'q2',
                'type': 'multiple_choice',
                'marks': 10,
                'correctAnswer': ['A', 'C']
            }
        ]
        
        answers = [
            {'questionId': 'q1', 'answer': 'B'}
            # q2 not answered
        ]
        
        result = self.engine.score_attempt(questions, answers)
        
        self.assertEqual(result['total_score'], 5)
        self.assertEqual(result['max_score'], 15)
        self.assertEqual(result['percentage'], 33.33)
        
        # Check that unanswered question is included with 0 marks
        q2_result = next(ans for ans in result['scored_answers'] if ans['questionId'] == 'q2')
        self.assertEqual(q2_result['marks'], 0)
        self.assertFalse(q2_result['isCorrect'])
        self.assertEqual(q2_result['feedback'], 'Not answered')


class TestTimerEnforcement(unittest.TestCase):
    """Test cases for timer enforcement functionality"""
    
    def setUp(self):
        self.tz_IST = pytz.timezone('Asia/Kolkata')
    
    def test_is_submission_late_on_time(self):
        """Test on-time submission"""
        due_at = datetime.now(self.tz_IST)
        submitted_at = (due_at - timedelta(minutes=5))
        
        is_late = TimerEnforcement.is_submission_late(
            due_at.isoformat(),
            submitted_at.isoformat()
        )
        
        self.assertFalse(is_late)
    
    def test_is_submission_late_overdue(self):
        """Test late submission"""
        due_at = datetime.now(self.tz_IST)
        submitted_at = (due_at + timedelta(minutes=10))
        
        is_late = TimerEnforcement.is_submission_late(
            due_at.isoformat(),
            submitted_at.isoformat()
        )
        
        self.assertTrue(is_late)
    
    def test_calculate_late_penalty_reject(self):
        """Test penalty calculation for reject behavior"""
        settings = {
            'lateSubmissionBehavior': 'reject',
            'latePenaltyPercent': 10
        }
        
        penalty = TimerEnforcement.calculate_late_penalty(settings, 5)
        
        self.assertEqual(penalty, 100)  # Full penalty
    
    def test_calculate_late_penalty_with_penalty(self):
        """Test penalty calculation for accept with penalty behavior"""
        settings = {
            'lateSubmissionBehavior': 'accept_with_penalty',
            'latePenaltyPercent': 20
        }
        
        penalty = TimerEnforcement.calculate_late_penalty(settings, 10)
        
        self.assertEqual(penalty, 10)  # 1% per minute, up to 10 minutes
    
    def test_calculate_late_penalty_mark_late(self):
        """Test penalty calculation for mark late behavior"""
        settings = {
            'lateSubmissionBehavior': 'mark_late',
            'latePenaltyPercent': 10
        }
        
        penalty = TimerEnforcement.calculate_late_penalty(settings, 30)
        
        self.assertEqual(penalty, 0)  # No penalty, just marked as late


class TestManualGradingHelper(unittest.TestCase):
    """Test cases for manual grading functionality"""
    
    def setUp(self):
        self.mock_db = Mock()
        self.mock_attempts = Mock()
        self.mock_result_logs = Mock()
        self.mock_db.attempts = self.mock_attempts
        self.mock_db.result_logs = self.mock_result_logs
    
    def test_update_question_score_success(self):
        """Test successful manual score update"""
        # Mock successful update
        self.mock_attempts.update_one.return_value.modified_count = 1
        self.mock_attempts.find_one.return_value = {
            'attemptId': 'attempt1',
            'quizId': 'quiz1',
            'studentEmail': 'student@example.com',
            'answers': [
                {'questionId': 'q1', 'marks': 5},
                {'questionId': 'q2', 'marks': 3}
            ],
            'maxScore': 20
        }
        
        result = ManualGradingHelper.update_question_score(
            'attempt1', 'q1', 8, 'Good answer!', 'admin@example.com', self.mock_db
        )
        
        self.assertTrue(result)
        self.mock_attempts.update_one.assert_called()
        self.mock_result_logs.insert_one.assert_called()
    
    def test_update_question_score_not_found(self):
        """Test manual score update when question not found"""
        # Mock no update (question not found)
        self.mock_attempts.update_one.return_value.modified_count = 0
        
        result = ManualGradingHelper.update_question_score(
            'attempt1', 'q1', 8, 'Good answer!', 'admin@example.com', self.mock_db
        )
        
        self.assertFalse(result)
    
    def test_recalculate_attempt_score(self):
        """Test attempt score recalculation"""
        # Mock attempt data
        self.mock_attempts.find_one.return_value = {
            'attemptId': 'attempt1',
            'answers': [
                {'marks': 8},
                {'marks': 6},
                {'marks': 0}
            ],
            'maxScore': 20
        }
        
        ManualGradingHelper.recalculate_attempt_score('attempt1', self.mock_db)
        
        # Verify update was called with correct totals
        update_call = self.mock_attempts.update_one.call_args
        update_data = update_call[0][1]['$set']
        
        self.assertEqual(update_data['totalScore'], 14)  # 8 + 6 + 0
        self.assertEqual(update_data['percentage'], 70.0)  # 14/20 * 100
        self.assertTrue(update_data['passed'])  # >= 40%


class TestIntegrationAttemptLifecycle(unittest.TestCase):
    """Integration tests for the complete attempt lifecycle"""
    
    def setUp(self):
        self.engine = ScoringEngine()
        self.mock_db = Mock()
        self.mock_attempts = Mock()
        self.mock_result_logs = Mock()
        self.mock_db.attempts = self.mock_attempts
        self.mock_db.result_logs = self.mock_result_logs
    
    def test_complete_attempt_lifecycle(self):
        """Test the complete lifecycle from start to graded result"""
        # Sample quiz data
        questions = [
            {
                'questionId': 'q1',
                'type': 'single_choice',
                'marks': 5,
                'correctAnswer': 'B'
            },
            {
                'questionId': 'q2',
                'type': 'short_answer',
                'marks': 10,
                'keywords': ['python', 'object-oriented'],
                'required_keywords': ['python']
            }
        ]
        
        student_answers = [
            {'questionId': 'q1', 'answer': 'B'},
            {'questionId': 'q2', 'answer': 'Python is object-oriented'}
        ]
        
        # 1. Score the initial attempt
        initial_result = self.engine.score_attempt(questions, student_answers)
        
        # Should get full marks for both questions
        self.assertEqual(initial_result['total_score'], 15)
        self.assertEqual(initial_result['percentage'], 100.0)
        
        # 2. Simulate manual grading adjustment for the short answer
        self.mock_attempts.update_one.return_value.modified_count = 1
        self.mock_attempts.find_one.return_value = {
            'attemptId': 'attempt1',
            'quizId': 'quiz1',
            'studentEmail': 'student@example.com',
            'answers': initial_result['scored_answers'],
            'maxScore': 15
        }
        
        # Admin gives partial credit for short answer
        success = ManualGradingHelper.update_question_score(
            'attempt1', 'q2', 7, 'Good but incomplete', 'admin@example.com', self.mock_db
        )
        
        self.assertTrue(success)
        
        # 3. Verify logging occurred
        self.mock_result_logs.insert_one.assert_called()
        log_call_args = self.mock_result_logs.insert_one.call_args[0][0]
        self.assertEqual(log_call_args['actionType'], 'grade_updated')
        self.assertEqual(log_call_args['actionData']['questionId'], 'q2')
        self.assertEqual(log_call_args['actionData']['newMarks'], 7)


if __name__ == '__main__':
    # Create a test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test cases
    suite.addTests(loader.loadTestsFromTestCase(TestScoringEngine))
    suite.addTests(loader.loadTestsFromTestCase(TestTimerEnforcement))
    suite.addTests(loader.loadTestsFromTestCase(TestManualGradingHelper))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegrationAttemptLifecycle))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print(f"\n{'='*50}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    print(f"{'='*50}")