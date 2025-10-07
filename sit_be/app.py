import base64
import json
from io import BytesIO
from pydoc import html
import os
from flask import Flask, request, jsonify, Response, render_template, make_response, redirect
from flask_pymongo import PyMongo
import bcrypt
from functools import wraps
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin
from mail import sendverificationmail, sendenquirymail, sendcertmail
from datetime import date
import random
import jinja2
import requests
import pytz
from xhtml2pdf import pisa             # import python module
import time
import uuid
try:
    from phonepe.sdk.pg.env import Env
    from phonepe.sdk.pg.payments.v1.payment_client import PhonePePaymentClient
    from phonepe.sdk.pg.payments.v1.models.request.pg_pay_request import PgPayRequest
    PHONEPE_SDK_AVAILABLE = True
except ImportError:
    print("PhonePe SDK not available, payment features will be disabled")
    PhonePePaymentClient = None
    PgPayRequest = None
    Env = None
    PHONEPE_SDK_AVAILABLE = False

from models import (
    create_quiz_document, create_attempt_document, get_quiz_schema,
    get_question_schema, get_quiz_assignment_schema, get_attempt_schema,
    get_result_log_schema, QuestionType, QuizSettings, AttemptStatus
)
from scoring import ScoringEngine, ManualGradingHelper, TimerEnforcement

frontendURL = "https://sitcloud.in"
backendURL = "https://sitcloud.in/api/"
# import ironpdf

tz_NY = pytz.timezone('Asia/Kolkata')


def normalize_password_bytes(stored_pw):
    """Normalize various stored password representations to raw bytes for bcrypt.checkpw.

    Handles:
    - bytes / bytearray
    - bson.binary.Binary (bytes() works)
    - stringified bytes like "b'...'")
    - base64-encoded strings
    - plain UTF-8 strings
    """
    if stored_pw is None:
        return stored_pw
    # If already bytes-like
    if isinstance(stored_pw, (bytes, bytearray)):
        return bytes(stored_pw)
    # If it's a Python string
    if isinstance(stored_pw, str):
        s = stored_pw
        # stringified bytes literal: "b'...'(utf-8)"
        if (s.startswith("b'") and s.endswith("'")) or (s.startswith('b"') and s.endswith('"')):
            inner = s[2:-1]
            try:
                # latin1 preserves byte values
                return inner.encode('latin1')
            except Exception:
                return inner.encode('utf8')
        # try base64 decode
        try:
            import base64
            return base64.b64decode(s)
        except Exception:
            try:
                return s.encode('utf8')
            except Exception:
                return s
    # Fallback: try to construct bytes from the object (works for bson.binary.Binary)
    try:
        return bytes(stored_pw)
    except Exception:
        return stored_pw


# Phonepe SDK Keys
merchant_id = "M22UNOC34DDKV"  
salt_key = "9517e9ee-c009-4aad-9400-dd693ccd0ac1"  
salt_index = 1 

# PhonePe Environment setup
phonepe_client = None
if PHONEPE_SDK_AVAILABLE and PhonePePaymentClient:
    try:
        env = Env.PROD if hasattr(Env, 'PROD') else 'PROD'  # Change to Env.PROD when you go live
        phonepe_client = PhonePePaymentClient(merchant_id=merchant_id, salt_key=salt_key, salt_index=salt_index, env=env)
        print("PhonePe SDK initialized successfully")
    except Exception as e:
        print(f"PhonePe SDK initialization failed: {e}")
        phonepe_client = None
else:
    print("PhonePe SDK not available, payment features will be disabled")


# from weasyprint import HTML
try:
    import pdfkit
    PDFKIT_AVAILABLE = True
except ImportError:
    print("pdfkit not available, PDF generation features will be disabled")
    pdfkit = None
    PDFKIT_AVAILABLE = False
app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = "SIT_Secret_key"
app.config['VERIFICATION_SECRET_KEY'] = "VERIFICATION_Secret_KEY"

# Toggle to skip email verification during development/testing.
# Set environment variable SKIP_EMAIL_VERIFICATION=1 to allow sign-in without email verification.
SKIP_EMAIL_VERIFICATION = os.environ.get('SKIP_EMAIL_VERIFICATION', '0') == '1'
# app.config["MONGO_URI"] = "mongodb://localhost:27017/sivaninfo_db"
# app.config["MONGO_URI"] = "mongodb://situser:sitadmin@localhost:27017/admin"
# app.config["MONGO_URI"] = "mongodb://situser:sitadmin@mongo:27017/admin"

# Connect to MongoDB Atlas
import ssl
try:
    # Configure PyMongo with SSL options using tlsAllowInvalidCertificates
    app.config["MONGO_URI"] = "mongodb+srv://cyber:cyber@cluster0.lum1oou.mongodb.net/sivaninfo_db?retryWrites=true&w=majority&appName=Cluster0"
    mongo = PyMongo(app, tlsAllowInvalidCertificates=True)
    # Test the connection
    mongo.db.list_collection_names()
    print("MongoDB Atlas connected successfully")
    
    # Create an admin user for testing if it doesn't exist
    users = mongo.db.users
    admin_user = users.find_one({'email': 'admin@sitcloud.in'})
    if not admin_user:
        hashed_password = bcrypt.hashpw('admin123'.encode('utf8'), bcrypt.gensalt())
        admin_doc = {
            'firstName': 'Admin',
            'lastName': 'User',
            'password': hashed_password,
            'email': 'admin@sitcloud.in',
            'role': 'ADMIN',
            'phone': '9999999999',
            'verified': True,
            'isFromCollege': False,
            'collegeName': '',
            'registered_on': str(datetime.now(tz_NY)),
            'loginToken': ''
        }
        users.insert_one(admin_doc)
        print("Admin user created: admin@sitcloud.in / admin123")
    else:
        print("Admin user already exists: admin@sitcloud.in / admin123")
    
    # Create sample courses for testing
    courses = mongo.db.courses
    sample_courses = [
        {
            'courseid': 'AWS-001',
            'title': 'AWS Solutions Architect Associate',
            'description': 'Complete AWS certification training',
            'duration': '60 days',
            'price': 15000,
            'batches': [
                {
                    'batchId': 'AWS001-B1',
                    'startdate': '2025-11-01',
                    'enddate': '2025-12-30',
                    'timing': '10:00 AM - 12:00 PM',
                    'mode': 'Online'
                },
                {
                    'batchId': 'AWS001-B2', 
                    'startdate': '2025-11-15',
                    'enddate': '2026-01-15',
                    'timing': '2:00 PM - 4:00 PM',
                    'mode': 'Hybrid'
                }
            ]
        },
        {
            'courseid': 'AZURE-001',
            'title': 'Azure Fundamentals AZ-900',
            'description': 'Microsoft Azure fundamentals certification',
            'duration': '30 days',
            'price': 10000,
            'batches': [
                {
                    'batchId': 'AZ900-B1',
                    'startdate': '2025-11-10',
                    'enddate': '2025-12-10',
                    'timing': '6:00 PM - 8:00 PM',
                    'mode': 'Online'
                }
            ]
        }
    ]
    
    for course in sample_courses:
        existing_course = courses.find_one({'courseid': course['courseid']})
        if not existing_course:
            courses.insert_one(course)
            print(f"Sample course created: {course['title']}")
        else:
            print(f"Course already exists: {course['title']}")
    
    # Create sample quizzes for testing
    quizzes = mongo.db.quizzes
    sample_quizzes = [
        {
            'quizId': 'quiz_aws_001',
            'title': 'AWS Solutions Architect Associate Final Assessment',
            'courseId': 'AWS-001',
            'duration': 120,
            'totalMarks': 100,
            'passingMarks': 72,
            'description': 'Comprehensive assessment for AWS Solutions Architect certification',
            'instructions': 'Read each question carefully. You have 120 minutes to complete this assessment.',
            'difficulty': 'advanced',
            'status': 'active',
            'isActive': True,
            'createdBy': 'admin@sitcloud.in',
            'createdAt': datetime.now(tz_NY).isoformat(),
            'settings': {
                'shuffleQuestions': True,
                'shuffleOptions': True,
                'showResults': True,
                'allowReview': True
            },
            'questions': []
        },
        {
            'quizId': 'quiz_azure_001',
            'title': 'Azure Fundamentals - Module 1 Quiz',
            'courseId': 'AZURE-001',
            'duration': 30,
            'totalMarks': 50,
            'passingMarks': 35,
            'description': 'Assessment for Azure Fundamentals Module 1',
            'instructions': 'Basic assessment covering Azure cloud concepts.',
            'difficulty': 'beginner',
            'status': 'active',
            'isActive': True,
            'createdBy': 'admin@sitcloud.in',
            'createdAt': datetime.now(tz_NY).isoformat(),
            'settings': {
                'shuffleQuestions': False,
                'shuffleOptions': True,
                'showResults': True,
                'allowReview': False
            },
            'questions': []
        },
        {
            'quizId': 'quiz_gcp_001',
            'title': 'GCP Associate Cloud Engineer - Practice Test',
            'courseId': 'GCP-001',
            'duration': 90,
            'totalMarks': 75,
            'passingMarks': 56,
            'description': 'Practice test for GCP Associate Cloud Engineer certification',
            'instructions': 'Intermediate level practice test. Take your time and read carefully.',
            'difficulty': 'intermediate',
            'status': 'active',
            'isActive': True,
            'createdBy': 'admin@sitcloud.in',
            'createdAt': datetime.now(tz_NY).isoformat(),
            'settings': {
                'shuffleQuestions': True,
                'shuffleOptions': True,
                'showResults': False,
                'allowReview': True
            },
            'questions': []
        },
        {
            'quizId': 'quiz_aws_draft',
            'title': 'AWS Developer - CI/CD Pipeline Quiz',
            'courseId': 'AWS-001',
            'duration': 45,
            'totalMarks': 60,
            'passingMarks': 42,
            'description': 'Quiz on AWS Developer CI/CD concepts',
            'instructions': 'Draft quiz - under construction.',
            'difficulty': 'intermediate',
            'status': 'draft',
            'isActive': True,
            'createdBy': 'admin@sitcloud.in',
            'createdAt': datetime.now(tz_NY).isoformat(),
            'settings': {
                'shuffleQuestions': False,
                'shuffleOptions': False,
                'showResults': True,
                'allowReview': True
            },
            'questions': []
        }
    ]
    
    # for quiz in sample_quizzes:
    #     existing_quiz = quizzes.find_one({'quizId': quiz['quizId']})
    #     if not existing_quiz:
    #         quizzes.insert_one(quiz)
    #         print(f"Sample quiz created: {quiz['title']}")
    #     else:
    #         print(f"Quiz already exists: {quiz['title']}")
    
    # Create sample quiz attempts for realistic analytics
    # quiz_attempts = mongo.db.quiz_attempts
    # sample_attempts = [
    #     {
    #         'attemptId': 'attempt_001',
    #         'quizId': 'quiz_aws_001',
    #         'studentEmail': 'admin@sitcloud.in',
    #         'status': 'completed',
    #         'startedAt': (datetime.now(tz_NY) - timedelta(days=5)).isoformat(),
    #         'submittedAt': (datetime.now(tz_NY) - timedelta(days=5, hours=-2)).isoformat(),
    #         'finalScore': 85,
    #         'percentage': 85.0,
    #         'timeSpent': 118,
    #         'responses': []
    #     },
    #     {
    #         'attemptId': 'attempt_002',
    #         'quizId': 'quiz_aws_001',
    #         'studentEmail': 'student1@example.com',
    #         'status': 'completed',
    #         'startedAt': (datetime.now(tz_NY) - timedelta(days=3)).isoformat(),
    #         'submittedAt': (datetime.now(tz_NY) - timedelta(days=3, hours=-1.5)).isoformat(),
    #         'finalScore': 78,
    #         'percentage': 78.0,
    #         'timeSpent': 95,
    #         'responses': []
    #     },
    #     {
    #         'attemptId': 'attempt_003',
    #         'quizId': 'quiz_azure_001',
    #         'studentEmail': 'admin@sitcloud.in',
    #         'status': 'completed',
    #         'startedAt': (datetime.now(tz_NY) - timedelta(days=2)).isoformat(),
    #         'submittedAt': (datetime.now(tz_NY) - timedelta(days=2, minutes=-25)).isoformat(),
    #         'finalScore': 42,
    #         'percentage': 84.0,
    #         'timeSpent': 25,
    #         'responses': []
    #     },
    #     {
    #         'attemptId': 'attempt_004',
    #         'quizId': 'quiz_gcp_001',
    #         'studentEmail': 'student2@example.com',
    #         'status': 'completed',
    #         'startedAt': (datetime.now(tz_NY) - timedelta(days=1)).isoformat(),
    #         'submittedAt': (datetime.now(tz_NY) - timedelta(days=1, minutes=-75)).isoformat(),
    #         'finalScore': 68,
    #         'percentage': 90.7,
    #         'timeSpent': 75,
    #         'responses': []
    #     }
    # ]
    
    # for attempt in sample_attempts:
    #     existing_attempt = quiz_attempts.find_one({'attemptId': attempt['attemptId']})
    #     if not existing_attempt:
    #         quiz_attempts.insert_one(attempt)
    #         print(f"Sample quiz attempt created: {attempt['attemptId']}")
    #     else:
    #         print(f"Quiz attempt already exists: {attempt['attemptId']}")
            
except Exception as e:
    print(f"MongoDB Atlas connection failed: {e}")
    print("Please check your MongoDB Atlas connection string and network connectivity")
    raise e

# Configure CORS to allow the frontend dev servers and API preflight requests.
# Allow specific local origins used by the Next dev server (3000/3001) and localhost/ip variants.
# Enable credentials support if frontend sends cookies or Authorization headers.
cors = CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]}}, supports_credentials=True)


# Ensure CORS headers are added to every response (including error responses and OPTIONS preflight)
@app.after_request
def add_cors_headers(response):
    allowed_origins = {
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    }
    origin = request.headers.get('Origin')
    if origin in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'

    # If this is an OPTIONS preflight, return OK immediately
    if request.method == 'OPTIONS':
        response.status_code = 200
    return response


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            bearer = request.headers.get('Authorization')
            token = bearer.split()[1]
        # return 401 if token is not passed
        if not token:
            return Response(json.dumps({"Message": "Missing token !!!", "status": 400}), status=400)

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            users = mongo.db.users
            current_user = users.find_one({'email': data['email']}, {'_id': False, 'password': False})
            if token == current_user["loginToken"]:
                current_user['currenttoken'] = token
                # print(current_user)
            else:
                return Response(json.dumps({"Message": "Authorization failed. Please, try to login again", "status": 401}), status=401)
        except Exception as e:
            print(e)
            return Response(json.dumps({"Message": "Authorization failed. Please, try to login again", "status": 401}), status=401)
        return f(current_user, *args, **kwargs)

    return decorated


@app.route("/api/signup", methods=['POST'])
@cross_origin()
def signup():
    print(request.json)
    users = mongo.db.users
    user = users.find_one({'email': request.json['email'].lower()})
    if user:
        return Response(json.dumps({"Message": "EmailID/User already exists, Please try to login", "status": 409}),
                        status=409)

    hashed = bcrypt.hashpw(request.json['password'].encode('utf8'), bcrypt.gensalt())
    
    # Determine verification state. In testing mode we may skip email verification.
    if SKIP_EMAIL_VERIFICATION:
        verified = True
    else:
        # Send email verification (best-effort). If email fails, continue signup but log the error.
        verified = False
        try:
            sendverificationmail(request, app.config['VERIFICATION_SECRET_KEY'])
        except Exception as e:
            print('Warning: sendverificationmail failed during signup:', e)
    
    # Handle both frontend formats - new format (name) and old format (firstName/lastName)
    if 'name' in request.json:
        # New frontend format - split name into first and last
        full_name = request.json['name'].strip()
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
    else:
        # Old format for backward compatibility
        first_name = request.json.get('firstName', '')
        last_name = request.json.get('lastName', '')
    
    users.insert_one({'firstName': first_name,
                      'lastName': last_name,
                      'password': hashed,
                      'email': request.json['email'],
                      'role': 'STUDENT',
                      'phone': request.json['phone'],
                      'verified': verified,
                      'isFromCollege': request.json.get('isfromcollege', False),
                      'collegeName': request.json.get('collagename', ''),
                      "registered_on": str(datetime.now(tz_NY))})

    if verified:
        return Response(json.dumps({"Message": "Account created successfully (test mode)", "status": 200}), status=200)
    else:
        return Response(json.dumps({"Message": "Please check your mail for Verification link", "status": 200}), status=200)


@app.route('/api/signin', methods=['POST'])
@cross_origin()
def signin():
    print(request.json)
    users = mongo.db.users
    signin_user = users.find_one({'email': request.json['email'].lower()}, {'_id': False})
    if not signin_user:
        return Response(json.dumps({"Message": "Please Signup to login", "status": 401}), status=401)
    if signin_user:
        # Allow login for unverified users when SKIP_EMAIL_VERIFICATION is enabled (testing/dev).
        if not signin_user.get('verified', False) and not SKIP_EMAIL_VERIFICATION:
            return Response(json.dumps({"Message": "User not yet verified, Please check your mail for verification link", "status": 401}), status=401)
        stored_pw = signin_user.get("password")
        stored_pw_bytes = normalize_password_bytes(stored_pw)

        # Now perform bcrypt check (ensure we have bytes for stored password)
        try:
            password_ok = False
            if isinstance(stored_pw_bytes, (bytes, bytearray)):
                password_ok = bcrypt.checkpw(request.json['password'].encode('utf8'), stored_pw_bytes)
            else:
                # stored_pw couldn't be normalized to bytes; fail gracefully
                print(f"signin: stored password could not be normalized to bytes (type={type(stored_pw)})")
                password_ok = False
        except Exception as e:
            print(f"Error during bcrypt.checkpw: {e}")
            password_ok = False

        if password_ok:
            # If skipping verification in dev, reflect that in the token so frontend behaves as expected
            token_verified_flag = True if SKIP_EMAIL_VERIFICATION else signin_user.get('verified', False)
            token = jwt.encode({
                'email': signin_user["email"],
                'firstName': signin_user["firstName"],
                'lastName': signin_user["lastName"],
                'exp': datetime.utcnow() + timedelta(minutes=30),
                'role': signin_user["role"],
                'verified': token_verified_flag
            }, app.config['SECRET_KEY'])

            users.update_one({'email': signin_user['email']},  {"$set": {'loginToken': token}})
            return Response(json.dumps({"Message": "Logged in successfully", "token": token, "status": 200}),
                            status=200)

        return Response(json.dumps({"Message": "Password is wrong, Please try again", "status": 400}), status=400)
    return Response(json.dumps({"Message": "User not exits", "status": 400}), status=400)


@app.route('/api/studentsList', methods=['GET'])
@cross_origin()
@token_required
def studentsList(currentuser):
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "User is not Authorized to get this data", "status": 401}), status=401)

    users = mongo.db.users
    users = users.find({'role': 'STUDENT'}, {'_id': False, 'password': False, 'registered_on': False})
    res = list(users)
    return Response(json.dumps({"Message": "Users fetched", 'user': res, "status": 200}), status=200)

@app.route('/api/admin/users/<user_email>', methods=['DELETE'])
@cross_origin()
@token_required
def delete_user(currentuser, user_email):
    """Delete a user"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        users = mongo.db.users
        enrollments = mongo.db.enrollments
        
        # Check if user exists
        user = users.find_one({'email': user_email})
        if not user:
            return Response(json.dumps({"Message": "User not found", "status": 404}), status=404)
        
        # Check if user has active enrollments
        enrolled_count = enrollments.count_documents({'email': user_email})
        if enrolled_count > 0:
            return Response(json.dumps({"Message": f"Cannot delete user. User has {enrolled_count} active enrollments.", "status": 400}), status=400)
        
        # Delete user
        result = users.delete_one({'email': user_email})
        
        if result.deleted_count == 0:
            return Response(json.dumps({"Message": "User not found", "status": 404}), status=404)
        
        return Response(json.dumps({"Message": "User deleted successfully", "status": 200}), status=200)
    except Exception as e:
        return Response(json.dumps({"Message": f"Error deleting user: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/users/export', methods=['GET'])
@cross_origin()
@token_required
def export_users(currentuser):
    """Export all users data to CSV format"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        users = mongo.db.users
        enrollments = mongo.db.enrollments
        
        # Get all users with their enrollment data
        all_users = []
        for user in users.find({'role': 'STUDENT'}, {'password': False}):
            # Get user's enrollments
            user_enrollments = list(enrollments.find({'email': user['email']}))
            
            user_data = {
                'email': user['email'],
                'firstName': user.get('firstName', ''),
                'lastName': user.get('lastName', ''),
                'phone': user.get('phone', ''),
                'role': user['role'],
                'verified': user.get('verified', False),
                'registered_on': user.get('registered_on', ''),
                'total_enrollments': len(user_enrollments),
                'courses': ', '.join([e.get('courseDetails', {}).get('title', '') for e in user_enrollments])
            }
            all_users.append(user_data)
        
        return Response(json.dumps({
            "Message": "Users data exported successfully", 
            "users": all_users, 
            "status": 200
        }), status=200, mimetype='application/json')
    except Exception as e:
        return Response(json.dumps({"Message": f"Error exporting users: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/users', methods=['POST'])
@cross_origin()
@token_required  
def create_user(currentuser):
    """Create a new user"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        user_data = request.json
        users = mongo.db.users
        
        # Check if user already exists
        existing_user = users.find_one({'email': user_data['email']})
        if existing_user:
            return Response(json.dumps({"Message": "User with this email already exists", "status": 400}), status=400)
        
        # Hash password
        hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create new user
        new_user = {
            'email': user_data['email'].lower(),
            'firstName': user_data['firstName'],
            'lastName': user_data['lastName'],
            'phone': user_data.get('phone', ''),
            'password': hashed_password,
            'role': user_data.get('role', 'STUDENT'),
            'verified': user_data.get('verified', False),
            'registered_on': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        result = users.insert_one(new_user)
        
        if result.inserted_id:
            return Response(json.dumps({"Message": "User created successfully", "status": 200}), status=200)
        else:
            return Response(json.dumps({"Message": "Failed to create user", "status": 500}), status=500)
            
    except Exception as e:
        return Response(json.dumps({"Message": f"Error creating user: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/users/<user_email>', methods=['PUT'])
@cross_origin()
@token_required
def update_user(currentuser, user_email):
    """Update user information"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        user_data = request.json
        users = mongo.db.users
        
        # Check if user exists
        existing_user = users.find_one({'email': user_email})
        if not existing_user:
            return Response(json.dumps({"Message": "User not found", "status": 404}), status=404)
        
        # Prepare update data
        update_data = {}
        if 'firstName' in user_data:
            update_data['firstName'] = user_data['firstName']
        if 'lastName' in user_data:
            update_data['lastName'] = user_data['lastName']
        if 'phone' in user_data:
            update_data['phone'] = user_data['phone']
        if 'verified' in user_data:
            update_data['verified'] = user_data['verified']
        if 'role' in user_data:
            update_data['role'] = user_data['role']
        
        # Hash new password if provided
        if 'password' in user_data and user_data['password']:
            update_data['password'] = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Update user
        result = users.update_one({'email': user_email}, {'$set': update_data})
        
        if result.matched_count > 0:
            return Response(json.dumps({"Message": "User updated successfully", "status": 200}), status=200)
        else:
            return Response(json.dumps({"Message": "User not found", "status": 404}), status=404)
            
    except Exception as e:
        return Response(json.dumps({"Message": f"Error updating user: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/users/<user_email>/certificates', methods=['GET'])
@cross_origin()
@token_required
def get_user_certificates(currentuser, user_email):
    """Get user's certificates"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        enrollments = mongo.db.enrollments
        
        # Get user's completed enrollments (these would have certificates)
        user_enrollments = list(enrollments.find({
            'email': user_email,
            'enrollmentStatus': 'completed'
        }))
        
        certificates = []
        for enrollment in user_enrollments:
            cert_data = {
                'courseTitle': enrollment.get('courseDetails', {}).get('title', 'Unknown Course'),
                'batchId': enrollment.get('batchDetails', {}).get('batchId', ''),
                'completionDate': enrollment.get('completionDate', ''),
                'grade': enrollment.get('finalGrade', 'N/A'),
                'certificateId': enrollment.get('certificateId', ''),
                'enrollmentId': enrollment.get('enrollmentID', '')
            }
            certificates.append(cert_data)
        
        return Response(json.dumps({
            "Message": "Certificates fetched successfully", 
            "certificates": certificates, 
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error fetching certificates: {str(e)}", "status": 500}), status=500)


@app.route('/api/verify', methods=['GET'])
@cross_origin()
def verify_email():
    print(request.args["token"])
    data = jwt.decode(request.args["token"], app.config["VERIFICATION_SECRET_KEY"], algorithms=['HS256'])

    users = mongo.db.users
    user = users.find_one({'email': data["email"]}, {'_id': False})
    if not user:
        return Response(json.dumps({"Message": "User not exits", "status": 400}), status=400)
    print(user)
    user = users.update_one({'email': data["email"]}, {"$set": {"verified": True}})
    return Response("Verified, Please try to login", status=200)


@app.route('/api/getToken', methods=['GET'])
@cross_origin()
@token_required
def getToken(currentuser):
    users = mongo.db.users
    signin_user = users.find_one({'email': currentuser['email']}, {'_id': False, 'password': False})
    print(signin_user)
    if signin_user:
        if currentuser['currenttoken'] == signin_user["loginToken"]:
            token_verified_flag = True if SKIP_EMAIL_VERIFICATION else signin_user.get('verified', False)
            newtoken = jwt.encode({
                'email': signin_user["email"],
                'firstName': signin_user["firstName"],
                'lastName': signin_user["lastName"],
                'exp': datetime.utcnow() + timedelta(minutes=30),
                'role': signin_user["role"],
                'verified': token_verified_flag
            }, app.config['SECRET_KEY'])
            users.update_one({'email': signin_user['email']},  {"$set": {'loginToken': newtoken}})
            res = {"Message": "token generated in successfully", "token": newtoken,  "status": 200}
            print(res)
            return Response(json.dumps(res),
                            status=200)

        return Response(json.dumps({"Message": "Authorization failed. Please, try to login again", "status": 400}), status=400)
    return Response(json.dumps({"Message": "User not exits", "status": 400}), status=400)


@app.route('/api/logOut', methods=['GET'])
@cross_origin()
@token_required
def logout(currentuser):
    users = mongo.db.users
    signin_user = users.find_one({'email': currentuser['email']}, {'_id': False, 'password': False})
    users.update_one({'email': signin_user['email']}, {"$set": {'loginToken': ''}})
    return Response(json.dumps({"Message": "Logged out successfully", "status": 200}), status=200)


@app.route('/api/enroll', methods=['POST'])
@cross_origin()
@token_required
def enroll(currentuser):
    courseid = request.json['courseid']
    courseshortform = request.json['courseshortform']
    coursetitle = request.json['coursetitle']
    batchdetails = request.json['batchtoenroll']
    uid = ''.join(random.choice('0123456789ABCDEF') for i in range(5))
    enrollmentID = 'EID' + date.today().strftime('%Y%m%d')+uid
    enrollment = {
        'enrollmentID': enrollmentID,
        'courseID': courseid,
        'courseShortForm': courseshortform,
        'courseTitle': coursetitle,
        'enrolledDate': str(datetime.utcnow()),
        'enrollmentStatus': 'Waiting for Approval',
        'certificationID': None,
        'batchDetails': batchdetails
    }
    users = mongo.db.users
    signin_user = users.find_one({'email': currentuser['email']}, {'_id': False, 'password': False})
    users.update_one({'email': signin_user['email']}, {'$push': {'enrollments': enrollment}})
    return Response(json.dumps({"Message": "Enrolled successfully", 'EnrollmentID': enrollmentID, "status": 200}), status=200)


@app.route('/api/enroll-with-payment', methods=['POST'])
@cross_origin()
def enroll_with_payment():
    """
    Enhanced enrollment endpoint that creates enrollment record and initiates payment
    """
    try:
        data = request.json
        
        # Extract enrollment data
        course_id = data.get('course_id')
        user_details = data.get('user_details', {})
        payment_method = data.get('payment_method')
        amount = data.get('amount')
        
        if not all([course_id, user_details, amount]):
            return Response(json.dumps({
                "success": False,
                "message": "Missing required fields: course_id, user_details, amount",
                "status": 400
            }), status=400)
        
        # Get course details
        courses = mongo.db.courses
        course = courses.find_one({'courseid': course_id}, {'_id': False})
        
        if not course:
            return Response(json.dumps({
                "success": False,
                "message": "Course not found",
                "status": 404
            }), status=404)
        
        # Generate enrollment ID
        uid = ''.join(random.choice('0123456789ABCDEF') for i in range(5))
        enrollment_id = 'EID' + date.today().strftime('%Y%m%d') + uid
        
        # Create enrollment record (pending payment)
        enrollment_data = {
            'enrollmentID': enrollment_id,
            'courseID': course_id,
            'courseTitle': course.get('coursename', 'Course'),
            'enrolledDate': str(datetime.utcnow()),
            'enrollmentStatus': 'Pending Payment',
            'userDetails': {
                'name': user_details.get('name'),
                'email': user_details.get('email'),
                'phone': user_details.get('phone')
            },
            'paymentDetails': {
                'amount': amount,
                'method': payment_method,
                'status': 'pending'
            },
            'batchDetails': course.get('nextBatch', {}),
            'createdAt': datetime.utcnow()
        }
        
        # Store enrollment in database
        enrollments = mongo.db.enrollments
        enrollments.insert_one(enrollment_data)
        
        # If payment integration is available, initiate payment
        if phonepe_client and PgPayRequest:
            try:
                unique_transaction_id = str(uuid.uuid4())[:-2]
                ui_redirect_url = f"{frontendURL}/payment-status?transactionId={unique_transaction_id}&enrollmentId={enrollment_id}"
                s2s_callback_url = f"{frontendURL}/payment-status"
                
                # Store transaction mapping
                payment_transactions = mongo.db.payment_transactions
                payment_transactions.insert_one({
                    'transaction_id': unique_transaction_id,
                    'enrollment_id': enrollment_id,
                    'amount': amount,
                    'status': 'initiated',
                    'created_at': datetime.utcnow()
                })
                
                pay_page_request = PgPayRequest.pay_page_pay_request_builder(
                    merchant_transaction_id=unique_transaction_id,
                    amount=amount * 100,  # Convert to paise
                    merchant_user_id=user_details.get('email', 'guest_user'),
                    callback_url=s2s_callback_url,
                    redirect_url=ui_redirect_url
                )
                
                pay_page_response = phonepe_client.pay(pay_page_request)
                pay_page_url = pay_page_response.data.instrument_response.redirect_info.url
                
                return Response(json.dumps({
                    "success": True,
                    "message": "Enrollment created and payment initiated",
                    "data": {
                        "enrollment_id": enrollment_id,
                        "payment_url": pay_page_url,
                        "transaction_id": unique_transaction_id
                    },
                    "status": 200
                }), status=200)
                
            except Exception as payment_error:
                # If payment fails, update enrollment status
                enrollments.update_one(
                    {'enrollmentID': enrollment_id},
                    {'$set': {'enrollmentStatus': 'Payment Failed', 'paymentError': str(payment_error)}}
                )
                
                return Response(json.dumps({
                    "success": False,
                    "message": "Enrollment created but payment initiation failed",
                    "error": str(payment_error),
                    "enrollment_id": enrollment_id,
                    "status": 500
                }), status=500)
        else:
            # If no payment integration, mark as manual payment required
            enrollments.update_one(
                {'enrollmentID': enrollment_id},
                {'$set': {'enrollmentStatus': 'Manual Payment Required'}}
            )
            
            return Response(json.dumps({
                "success": True,
                "message": "Enrollment created - manual payment required",
                "data": {
                    "enrollment_id": enrollment_id,
                    "payment_required": True
                },
                "status": 200
            }), status=200)
            
    except Exception as e:
        return Response(json.dumps({
            "success": False,
            "message": f"Enrollment failed: {str(e)}",
            "status": 500
        }), status=500)


@app.route('/api/enrollmentsList', methods=['GET'])
@cross_origin()
@token_required
def enrollments(currentuser):
    userid = request.args.get('userid')
    if not userid:
        userid = currentuser['email']
    if userid != currentuser['email'] and currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    users = mongo.db.users
    userdata = users.find_one({'email': userid}, {'_id': False, 'password': False})
    return Response(json.dumps({"Message": "Fetched enrollments successfully", 'user': userdata, "status": 200}), status=200)


@app.route('/api/updateEnrollment', methods=['POST'])
@cross_origin()
@token_required
def updateEnrollment(currentuser):
    enrollmentID = request.json['enrollmentID']

    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    users = mongo.db.users
    if request.json['status'] == 'Certified':
        courseShortForm = request.json['courseShortForm']
        uid = ''.join(random.choice('0123456789ABCDEF') for i in range(5))
        certificationID = 'SIT' + date.today().strftime('%Y%m%d') + uid + courseShortForm
        update = {'$set': {"enrollments.$.enrollmentStatus": request.json['status'],
                           "enrollments.$.certificationID": certificationID,
                           "enrollments.$.certifiedOn": str(datetime.now(tz_NY))}}
    else:
        update = {'$set': {"enrollments.$.enrollmentStatus": request.json['status']}}
    userdata = users.update_one({
        'email': request.json['userid'],
        'enrollments': {
            '$elemMatch': {
                'enrollmentID': enrollmentID
            }
        }}, update)
    return Response(json.dumps({"Message": "Enrollment updated successfully", "status": 200}), status=200)


@app.route('/api/enquiry', methods=['POST'])
@cross_origin()
def submitEnquiry():
    print(request.json)
    
    # Send enquiry email
    sendenquirymail(request)
    
    return Response(json.dumps({"Message": "Enquiry submitted, Team will contact you soon", "status": 200}), status=200)


@app.route('/api/courseDetails', methods=['GET'])
@cross_origin()
def getCourseContent():
    courses = mongo.db.courses
    courseContent = courses.find_one({'courseid': request.args.get('courseid')}, {'_id': False})
    return Response(json.dumps({"Message": "Fetched content", "details": courseContent, "status": 200}), status=200)


@app.route('/api/course-details/<course_id>', methods=['GET'])
@cross_origin()
def getDetailedCourseInfo(course_id):
    """
    Enhanced endpoint for detailed course information
    Returns comprehensive course data including curriculum, instructor, pricing, etc.
    """
    try:
        courses = mongo.db.courses
        # Find course by course_id (which maps to courseid in the database)
        course = courses.find_one({'courseid': course_id}, {'_id': False})
        
        if not course:
            return Response(json.dumps({
                "success": False,
                "message": "Course not found",
                "status": 404
            }), status=404)
        
        # Enhanced course details structure
        detailed_course = {
            "id": course.get('courseid', course_id),
            "title": course.get('coursename', 'Course Title'),
            "description": course.get('description', 'Course description'),
            "longDescription": course.get('longDescription', course.get('description', 'Detailed course description')),
            "duration": course.get('duration', '8 weeks'),
            "level": course.get('level', 'Beginner'),
            "price": course.get('price', 15000),
            "originalPrice": course.get('originalPrice', course.get('price', 15000) * 1.5),
            "students": course.get('enrolledStudents', '0') + '+',
            "instructor": {
                "name": course.get('instructor', {}).get('name', 'Expert Instructor'),
                "experience": course.get('instructor', {}).get('experience', '5+ years'),
                "rating": course.get('instructor', {}).get('rating', 4.5),
                "bio": course.get('instructor', {}).get('bio', 'Experienced professional instructor'),
                "image": course.get('instructor', {}).get('image', '/placeholder.svg')
            },
            "curriculum": course.get('curriculum', [
                {
                    "module": "Introduction",
                    "topics": ["Basic concepts", "Getting started"],
                    "duration": "1 week"
                }
            ]),
            "features": course.get('features', [
                "Hands-on Labs",
                "Real-world Projects",
                "Industry Mentorship",
                "Job Placement Support",
                "24/7 Support"
            ]),
            "prerequisites": course.get('prerequisites', [
                "Basic Computer Knowledge",
                "Understanding of Internet Concepts"
            ]),
            "certification": course.get('certification', 'Course Completion Certificate'),
            "nextBatch": {
                "startDate": course.get('nextBatch', {}).get('startDate', '2024-02-15'),
                "schedule": course.get('nextBatch', {}).get('schedule', 'Mon, Wed, Fri - 7:00 PM to 9:00 PM'),
                "mode": course.get('nextBatch', {}).get('mode', 'Online'),
                "seats": course.get('nextBatch', {}).get('seats', 20)
            },
            "highlights": course.get('highlights', [
                "Industry-recognized certification",
                "Hands-on practical experience",
                "Job placement assistance",
                "Lifetime course access"
            ]),
            "image": course.get('image', '/placeholder.svg')
        }
        
        return Response(json.dumps({
            "success": True,
            "message": "Course details fetched successfully",
            "data": detailed_course,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({
            "success": False,
            "message": f"Error fetching course details: {str(e)}",
            "status": 500
        }), status=500)


@app.route('/api/courselist', methods=['GET'])
@cross_origin()
@token_required
def getCourseList(currentuser):
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    courses = mongo.db.courses
    courselist = courses.find({}, {'_id': False})
    res = list(courselist)
    return Response(json.dumps({"Message": "Fetched content", "courses": res, "status": 200}), status=200)


@app.route('/api/getcourseDoc', methods=['GET'])
@cross_origin()
@token_required
def getCourseDocument(currentuser):
    studentdownload = False
    print(request.args)
    courseid = request.args.get('courseid')
    for enroll in currentuser['enrollments']:
        if enroll['courseID'] == courseid and enroll['enrollmentStatus'] == "Approved" or enroll['enrollmentStatus'] == "Certified":
            studentdownload = True
        else:
            studentdownload = False
    if currentuser['role'] != 'ADMIN' and not studentdownload:
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)

    coursedoc = mongo.db.coursedoc
    courseContent = coursedoc.find_one({'courseid': request.args.get('courseid')}, {'_id': False})
    print(type(courseContent['syllabus']))
    image = base64.b64encode(courseContent['syllabus'])
    return Response(json.dumps({
        "Message": "Fetched course document",
        "details": image.decode(),
        "courseid": courseContent['courseid'],
        "status": 200}), status=200)


@app.route('/api/uploadcourseDoc', methods=['POST'])
@cross_origin()
@token_required
def uploadCourseDocument(currentuser):
    coursedoc = mongo.db.coursedoc
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    input_file = request.files["syllabus"].read()

    course = coursedoc.find_one({'courseid': request.form['courseid']}, {'_id': False, 'syllabus': False})
    if course:
        coursedoc.update_one({
            'courseid': request.form['courseid']},
            {"$set": {'syllabus': input_file, "uploaded_on": str(datetime.now(tz_NY))}}
        )
    else:
        coursedoc.insert_one({"courseid": request.form['courseid'], 'syllabus': input_file, "uploaded_on": str(datetime.now(tz_NY))})
    return Response(json.dumps({"Message": "Course document Uploaded", "status": 200}), status=200)


@app.route('/api/saveads', methods=['POST'])
@cross_origin()
@token_required
def saveFlashAds(currentuser):
    ads = mongo.db.ads
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    obj = {"flashadslist": request.json['flashadslist'],
                    "adsType": request.json['adsType'],  # Banner or Flash add
                    "uploaded_on": str(datetime.now(tz_NY))}
    dbflashad = ads.find_one({"adsType": "flashadd"}, {})
    if not dbflashad:
        ads.insert_one(obj)
    else:
        ads.update_one({"adsType": "flashadd"}, {"$set": obj})
    return Response(json.dumps({"Message": "Ads Saved Successfully", "status": 200}), status=200)


@app.route('/api/getflashads', methods=['GET'])
@cross_origin()
def getFlashAds():
    ads = mongo.db.ads
    data = ads.find({"adsType": "flashadd"}, {'_id': False})
    res = list(data)
    return Response(json.dumps({"Message": "Fetched content", "details": res[0], "status": 200}), status=200)


@app.route('/api/verifyCert', methods=['POST'])
@cross_origin()
def verifyCert():
    print(request)
    users = mongo.db.users
    userdata = users.find_one({
        'enrollments': {
            '$elemMatch': {
                'enrollmentID': request.json['enrollmentID'],
                'certificationID': request.json['certificateID']
            }
        }})
    enrollData = None
    if userdata and userdata['enrollments']:
        for enrollment in userdata['enrollments']:
            if enrollment['enrollmentID'] == request.json['enrollmentID'] and\
                    enrollment['certificationID'] == request.json['certificateID']:
                enrollData = enrollment

    if enrollData:
        res = {
            "Message": "Verification Successful", "status": 200,
            'userName': userdata['firstName'] + userdata['lastName'],
            'enrollmentDetails': enrollData
        }
    else:
        res = {
            "Message": "Verification Failed !!! Please recheck the Enrollment & Certificate details", "status": 400,
        }
    return Response(json.dumps(res), status=res['status'])


@app.route('/api/downloadCertificate', methods=['GET'])
@cross_origin()
# @token_required
def downloadCertificate():
    print(f"Download Cert triggered")

    print(request)
    certificationID = request.args["certificationID"]
    email = request.args["userid"]
    certdata = None
    users = mongo.db.users
    userdata = users.find_one({'email': email}, {'_id': False})

    for enrollment in userdata['enrollments']:
        print(enrollment['certificationID'])
        if enrollment['certificationID'] == certificationID:
            certdata = enrollment
    cr_year = certdata['certifiedOn'][0:4]
    cr_month = certdata['certifiedOn'][5:7]
    cr_date = certdata['certifiedOn'][8:10]
    certdate = str(cr_month) + '/' + str(cr_date) + '/'+str(cr_year)
    print(certdate)
    cert_duration_startdate = certdata['batchDetails']['startdate']
    cert_duration_enddate = certdata['batchDetails']['enddate']
    template_loader = jinja2.FileSystemLoader(searchpath="./templates")
    template_env = jinja2.Environment(loader=template_loader)
    template_file = ''
    collegeName = ''
    if userdata['isFromCollege'] is True or userdata['isFromCollege'] == "true":
        print(f"User is from College")
        template_file = "CollegeCert.html"
        collegeName = userdata['collegeName']
    elif userdata['isFromCollege'] is False or userdata['isFromCollege'] == 'false':
        print(f"User is an Intern")
        template_file = "InternCert.html"
    template = template_env.get_template(template_file)
    output_text = template.render(
        name=userdata['firstName']+userdata['lastName'],
        date=certdate,
        certificationID=certificationID,
        courseTitle=certdata['courseTitle'],
        enrollmentID=certdata['enrollmentID'],
        isFromCollege=userdata['isFromCollege'],
        collegeName=collegeName,
        durationStartdate=cert_duration_startdate,
        durationEnddate=cert_duration_enddate
    )

    html_path = f'templates/finalCert.html'
    html_file = open(html_path, 'w')
    html_file.write(output_text)
    html_file.close()
    print(f"Now converting index2 ... ")
    return render_template("finalCert.html")


@app.route('/api/emailCert', methods=['POST'])
@cross_origin()
def emailCert():
    if not PDFKIT_AVAILABLE:
        return Response(json.dumps({"Message": "PDF generation service not available", "status": 503}), status=503)
    
    try:
        certificationID = request.json["certificationID"]
        email = request.json["userid"]
        
        # response = requests.get("http://127.0.0.1:5000/downloadCertificate", params={
        #     'userid': email, 'certificationID': certificationID
        # })
        # time.sleep(5)
        output_filename = 'templates/test.pdf'
        # with open('templates/finalCert.html', 'r', encoding='utf-8') as file:
        #     fdata = file.readlines()
        # cssd = open("static/styles/CollegeCert.css", 'r')
        # data = cssd.read()
        # cssd.close()
        #
        # fdata[3] = '<style type="text/css">' + data + "</style>"
        #
        # with open('templates/tempCert.html', 'w', encoding='utf-8') as file:
        #     file.writelines(fdata)
        # time.sleep(5)
        # result_file = open(output_filename, "w+b")
        # emailcert = open("templates/tempCert.html", 'r')
        # emailcertdata = emailcert.read()
        # emailcert.close()
        # time.sleep(5)
        # pisa_status = pisa.CreatePDF(
        #     emailcertdata,  # the HTML to convert
        #     dest=result_file)  # file handle to recieve result
        #
        # # close output file
        # result_file.close()  # close output file
        # pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
        #config = pdfkit.configuration(wkhtmltopdf="/usr/bin/wkhtmltopdf")
        #print(email,certificationID)
        # pdfkit.from_url("https://service.sitcloud.in/downloadCertificate?userid=" + email + "&certificationID=" + certificationID, 'templates/test.pdf', configuration=config)
        config = pdfkit.configuration(wkhtmltopdf="/usr/bin/wkhtmltopdf") 
        response = requests.get("https://sitcloud.in/api/downloadCertificate", params={'userid': email, 'certificationID': certificationID})
        html_path = f'templates/tempCert.html'
        html_file = open(html_path, 'w')
        html_file.write(response.text)
        html_file.close()
        cssd = open("static/styles/CollegeCert.css", 'r')
        cssdata = cssd.read()
        cssd.close()
        time.sleep(5)
        with open('templates/tempCert.html', 'r', encoding='utf-8') as file:
            certemaildata = file.readlines()
        certemaildata[3] = '<style type="text/css">' + cssdata + "</style>"
        with open('templates/tempCert.html', 'w', encoding='utf-8') as file:
            file.writelines(certemaildata)
        emailcert = open("templates/tempCert.html", 'r')
        emailcertdata = emailcert.read()
        pdfkit.from_string(emailcertdata, 'templates/test.pdf', configuration=config)
        #sendcertmail(request)
        time.sleep(5)
        sendcertmail(request)
        return Response(json.dumps({"Message": "Certificate emailed successfully", "status": 200}), status=200)
        
    except Exception as e:
        print(f"Email certificate error: {e}")
        return Response(json.dumps({"Message": "Certificate email failed", "error": str(e), "status": 500}), status=500)


@app.route('/api/getCourseAndBatchDetails', methods=['GET'])
@cross_origin()
def getCourseAndBatchDetails():
    courses = mongo.db.courses
    data = courses.find({}, {'_id': False, 'courseid': True, 'batches': True})
    res = list(data)
    return Response(json.dumps({"Message": "Data fetched", 'details': res, "status": 200}), status=200)

@app.route('/api/admin/batches', methods=['GET'])
@cross_origin()
@token_required
def get_all_batches(currentuser):
    """Get all batches for admin dashboard"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        courses = mongo.db.courses
        enrollments = mongo.db.enrollments
        
        all_batches = []
        for course in courses.find():
            for batch in course.get('batches', []):
                # Count enrolled students for this batch
                student_count = enrollments.count_documents({'batchDetails.batchId': batch['batchId']})
                
                batch_info = {
                    'id': batch['batchId'],
                    'name': f"{course['title']} - {batch['batchId']}",
                    'code': batch['batchId'],
                    'courseId': course['courseid'],
                    'courseTitle': course['title'],
                    'startDate': batch['startdate'],
                    'endDate': batch['enddate'],
                    'timing': batch['timing'],
                    'mode': batch['mode'],
                    'studentsCount': student_count,
                    'status': 'ongoing' if batch['startdate'] <= str(date.today()) <= batch['enddate'] else 'upcoming'
                }
                all_batches.append(batch_info)
        
        return Response(json.dumps({"Message": "Batches fetched successfully", "batches": all_batches, "status": 200}), status=200)
    except Exception as e:
        return Response(json.dumps({"Message": f"Error fetching batches: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches', methods=['POST'])
@cross_origin()
@token_required
def create_batch(currentuser):
    """Create a new batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        batch_data = request.json
        courses = mongo.db.courses
        
        # Find the course to add batch to
        course = courses.find_one({'courseid': batch_data['courseId']})
        if not course:
            return Response(json.dumps({"Message": "Course not found", "status": 404}), status=404)
        
        # Create new batch
        new_batch = {
            'batchId': batch_data['batchId'],
            'startdate': batch_data['startDate'],
            'enddate': batch_data['endDate'],
            'timing': batch_data['timing'],
            'mode': batch_data['mode']
        }
        
        # Add batch to course
        courses.update_one(
            {'courseid': batch_data['courseId']},
            {'$push': {'batches': new_batch}}
        )
        
        return Response(json.dumps({"Message": "Batch created successfully", "status": 200}), status=200)
    except Exception as e:
        return Response(json.dumps({"Message": f"Error creating batch: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>', methods=['PUT'])
@cross_origin()
@token_required
def update_batch(currentuser, batch_id):
    """Update a batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        batch_data = request.json
        courses = mongo.db.courses
        
        # Find and update the batch
        result = courses.update_one(
            {'batches.batchId': batch_id},
            {'$set': {
                'batches.$.startdate': batch_data['startDate'],
                'batches.$.enddate': batch_data['endDate'],
                'batches.$.timing': batch_data['timing'],
                'batches.$.mode': batch_data['mode']
            }}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Batch not found", "status": 404}), status=404)
        
        return Response(json.dumps({"Message": "Batch updated successfully", "status": 200}), status=200)
    except Exception as e:
        return Response(json.dumps({"Message": f"Error updating batch: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>', methods=['DELETE'])
@cross_origin()
@token_required
def delete_batch(currentuser, batch_id):
    """Delete a batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        courses = mongo.db.courses
        enrollments = mongo.db.enrollments
        
        # Check if any students are enrolled in this batch
        enrolled_count = enrollments.count_documents({'batchDetails.batchId': batch_id})
        if enrolled_count > 0:
            return Response(json.dumps({"Message": f"Cannot delete batch. {enrolled_count} students are enrolled.", "status": 400}), status=400)
        
        # Remove batch from course
        result = courses.update_one(
            {'batches.batchId': batch_id},
            {'$pull': {'batches': {'batchId': batch_id}}}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Batch not found", "status": 404}), status=404)
        
        return Response(json.dumps({"Message": "Batch deleted successfully", "status": 200}), status=200)
    except Exception as e:
        return Response(json.dumps({"Message": f"Error deleting batch: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/analysis', methods=['GET'])
@cross_origin()
@token_required
def get_batch_analysis(currentuser, batch_id):
    """Get comprehensive batch analysis with statistics"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        courses = mongo.db.courses
        enrollments = mongo.db.enrollments
        users = mongo.db.users
        
        # Find batch details
        batch_course = courses.find_one({'batches.batchId': batch_id})
        if not batch_course:
            return Response(json.dumps({"Message": "Batch not found", "status": 404}), status=404)
        
        batch_details = None
        for batch in batch_course['batches']:
            if batch['batchId'] == batch_id:
                batch_details = batch
                break
        
        # Get enrolled students
        enrolled_students = list(enrollments.find({'batchDetails.batchId': batch_id}))
        student_emails = [enrollment['email'] for enrollment in enrolled_students]
        
        # Get student details
        students_data = list(users.find(
            {'email': {'$in': student_emails}},
            {'_id': False, 'password': False, 'loginToken': False}
        ))
        
        # Calculate statistics
        total_students = len(enrolled_students)
        active_students = len([s for s in enrolled_students if s.get('enrollmentStatus') == 'Approved'])
        completed_students = len([s for s in enrolled_students if s.get('enrollmentStatus') == 'Certified'])
        pending_students = len([s for s in enrolled_students if s.get('enrollmentStatus') == 'Waiting for Approval'])
        
        # Attendance analysis (mock data - you can implement actual attendance tracking)
        attendance_rate = 85.5  # This would come from actual attendance records
        
        # Performance analysis
        average_progress = sum([s.get('progress', 0) for s in enrolled_students]) / max(total_students, 1)
        
        # Revenue analysis
        course_price = batch_course.get('price', 0)
        total_revenue = active_students * course_price
        potential_revenue = total_students * course_price
        
        analysis_data = {
            'batchInfo': {
                'batchId': batch_id,
                'courseTitle': batch_course['title'],
                'courseid': batch_course['courseid'],
                'startDate': batch_details['startdate'],
                'endDate': batch_details['enddate'],
                'timing': batch_details['timing'],
                'mode': batch_details['mode']
            },
            'statistics': {
                'totalStudents': total_students,
                'activeStudents': active_students,
                'completedStudents': completed_students,
                'pendingStudents': pending_students,
                'attendanceRate': attendance_rate,
                'averageProgress': round(average_progress, 2)
            },
            'revenue': {
                'totalRevenue': total_revenue,
                'potentialRevenue': potential_revenue,
                'coursePrice': course_price
            },
            'students': students_data,
            'enrollments': enrolled_students
        }
        
        return Response(json.dumps({
            "Message": "Batch analysis retrieved successfully", 
            "analysis": analysis_data, 
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error getting batch analysis: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/students', methods=['GET'])
@cross_origin()
@token_required
def get_batch_students(currentuser, batch_id):
    """Get all students enrolled in a specific batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        enrollments = mongo.db.enrollments
        users = mongo.db.users
        
        # Get enrolled students
        enrolled_students = list(enrollments.find({'batchDetails.batchId': batch_id}))
        
        if not enrolled_students:
            return Response(json.dumps({
                "Message": "No students found in this batch", 
                "students": [], 
                "status": 200
            }), status=200)
        
        student_emails = [enrollment['email'] for enrollment in enrolled_students]
        
        # Get detailed student information
        students_details = []
        for email in student_emails:
            student = users.find_one(
                {'email': email},
                {'_id': False, 'password': False, 'loginToken': False}
            )
            
            # Find enrollment details for this student
            enrollment = next((e for e in enrolled_students if e['email'] == email), None)
            
            if student and enrollment:
                student_info = {
                    'email': student['email'],
                    'firstName': student.get('firstName', ''),
                    'lastName': student.get('lastName', ''),
                    'phone': student.get('phone', ''),
                    'enrollmentStatus': enrollment.get('enrollmentStatus', 'Unknown'),
                    'enrolledDate': enrollment.get('enrolledDate', ''),
                    'progress': enrollment.get('progress', 0),
                    'lastActivity': enrollment.get('lastActivity', 'No activity'),
                    'enrollmentId': enrollment.get('enrollmentID', ''),
                    'certificationId': enrollment.get('certificationID', ''),
                    'certifiedOn': enrollment.get('certifiedOn', '')
                }
                students_details.append(student_info)
        
        return Response(json.dumps({
            "Message": "Batch students retrieved successfully", 
            "students": students_details, 
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving batch students: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/modules', methods=['GET'])
@cross_origin()
@token_required
def get_batch_modules(currentuser, batch_id):
    """Get all modules for a specific batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        modules = mongo.db.modules
        
        # Get modules for this batch
        batch_modules = list(modules.find({'batchId': batch_id}, {'_id': False}))
        
        return Response(json.dumps({
            "Message": "Batch modules retrieved successfully", 
            "modules": batch_modules, 
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving batch modules: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/modules', methods=['POST'])
@cross_origin()
@token_required
def create_batch_module(currentuser, batch_id):
    """Create a new module for a batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        module_data = request.json
        modules = mongo.db.modules
        
        # Generate module ID
        module_id = f"mod_{batch_id}_{int(datetime.now().timestamp())}"
        
        new_module = {
            'moduleId': module_id,
            'batchId': batch_id,
            'title': module_data['title'],
            'description': module_data.get('description', ''),
            'duration': module_data.get('duration', ''),
            'order': module_data.get('order', 1),
            'topics': module_data.get('topics', []),
            'resources': module_data.get('resources', []),
            'assignments': module_data.get('assignments', []),
            'isActive': True,
            'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'createdBy': currentuser['email']
        }
        
        modules.insert_one(new_module)
        
        return Response(json.dumps({
            "Message": "Module created successfully", 
            "moduleId": module_id,
            "status": 201
        }), status=201)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error creating module: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/modules/<module_id>', methods=['PUT'])
@cross_origin()
@token_required
def update_module(currentuser, module_id):
    """Update a module"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        update_data = request.json
        modules = mongo.db.modules
        
        update_data['updatedAt'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        update_data['updatedBy'] = currentuser['email']
        
        result = modules.update_one(
            {'moduleId': module_id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Module not found", "status": 404}), status=404)
        
        return Response(json.dumps({"Message": "Module updated successfully", "status": 200}), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error updating module: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/modules/<module_id>', methods=['DELETE'])
@cross_origin()
@token_required
def delete_module(currentuser, module_id):
    """Delete a module"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        modules = mongo.db.modules
        
        result = modules.update_one(
            {'moduleId': module_id},
            {'$set': {'isActive': False, 'deletedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Module not found", "status": 404}), status=404)
        
        return Response(json.dumps({"Message": "Module deleted successfully", "status": 200}), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error deleting module: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/schedule', methods=['GET'])
@cross_origin()
@token_required
def get_batch_schedule(currentuser, batch_id):
    """Get class schedule for a batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        schedules = mongo.db.class_schedules
        
        # Get schedule for this batch
        batch_schedule = list(schedules.find({'batchId': batch_id}, {'_id': False}).sort('dateTime', 1))
        
        return Response(json.dumps({
            "Message": "Batch schedule retrieved successfully", 
            "schedule": batch_schedule, 
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving batch schedule: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/schedule', methods=['POST'])
@cross_origin()
@token_required
def schedule_class(currentuser, batch_id):
    """Schedule a new class for a batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        schedule_data = request.json
        schedules = mongo.db.class_schedules
        
        # Generate schedule ID
        schedule_id = f"sch_{batch_id}_{int(datetime.now().timestamp())}"
        
        new_schedule = {
            'scheduleId': schedule_id,
            'batchId': batch_id,
            'moduleId': schedule_data.get('moduleId', ''),
            'topic': schedule_data['topic'],
            'description': schedule_data.get('description', ''),
            'dateTime': schedule_data['dateTime'],
            'duration': schedule_data.get('duration', 60),  # minutes
            'instructor': schedule_data.get('instructor', currentuser['email']),
            'meetingLink': schedule_data.get('meetingLink', ''),
            'resources': schedule_data.get('resources', []),
            'type': schedule_data.get('type', 'lecture'),  # lecture, lab, assignment, exam
            'status': 'scheduled',  # scheduled, ongoing, completed, cancelled
            'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'createdBy': currentuser['email']
        }
        
        schedules.insert_one(new_schedule)
        
        return Response(json.dumps({
            "Message": "Class scheduled successfully", 
            "scheduleId": schedule_id,
            "status": 201
        }), status=201)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error scheduling class: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/schedule/<schedule_id>', methods=['PUT'])
@cross_origin()
@token_required
def update_schedule(currentuser, schedule_id):
    """Update a scheduled class"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        update_data = request.json
        schedules = mongo.db.class_schedules
        
        update_data['updatedAt'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        update_data['updatedBy'] = currentuser['email']
        
        result = schedules.update_one(
            {'scheduleId': schedule_id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Schedule not found", "status": 404}), status=404)
        
        return Response(json.dumps({"Message": "Schedule updated successfully", "status": 200}), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error updating schedule: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/schedule/<schedule_id>', methods=['DELETE'])
@cross_origin()
@token_required
def cancel_schedule(currentuser, schedule_id):
    """Cancel a scheduled class"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        schedules = mongo.db.class_schedules
        
        result = schedules.update_one(
            {'scheduleId': schedule_id},
            {'$set': {
                'status': 'cancelled',
                'cancelledAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'cancelledBy': currentuser['email']
            }}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Schedule not found", "status": 404}), status=404)
        
        return Response(json.dumps({"Message": "Class cancelled successfully", "status": 200}), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error cancelling schedule: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/attendance', methods=['GET'])
@cross_origin()
@token_required
def get_batch_attendance(currentuser, batch_id):
    """Get attendance records for a batch"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        attendance = mongo.db.attendance
        
        # Get attendance records for this batch
        attendance_records = list(attendance.find({'batchId': batch_id}, {'_id': False}))
        
        return Response(json.dumps({
            "Message": "Attendance records retrieved successfully", 
            "attendance": attendance_records, 
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving attendance: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/batches/<batch_id>/attendance', methods=['POST'])
@cross_origin()
@token_required
def mark_attendance(currentuser, batch_id):
    """Mark attendance for a class"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        attendance_data = request.json
        attendance = mongo.db.attendance
        
        # Generate attendance ID
        attendance_id = f"att_{batch_id}_{int(datetime.now().timestamp())}"
        
        new_attendance = {
            'attendanceId': attendance_id,
            'batchId': batch_id,
            'scheduleId': attendance_data.get('scheduleId', ''),
            'date': attendance_data['date'],
            'studentAttendance': attendance_data['studentAttendance'],  # [{"email": "...", "status": "present/absent"}]
            'totalStudents': len(attendance_data['studentAttendance']),
            'presentStudents': len([s for s in attendance_data['studentAttendance'] if s['status'] == 'present']),
            'markedBy': currentuser['email'],
            'markedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        attendance.insert_one(new_attendance)
        
        return Response(json.dumps({
            "Message": "Attendance marked successfully", 
            "attendanceId": attendance_id,
            "status": 201
        }), status=201)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error marking attendance: {str(e)}", "status": 500}), status=500)

@app.route('/api/admin/quiz', methods=['POST'])
@cross_origin()
@token_required
def create_quiz(currentuser):
    """Create a new quiz"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        quiz_data = request.json
        
        # Generate quiz ID
        quiz_id = f"quiz_{int(datetime.now().timestamp())}_{random.randint(1000, 9999)}"
        quiz_data['quizId'] = quiz_id
        quiz_data['createdBy'] = currentuser['email']
        
        # Validate required fields
        required_fields = ['title', 'courseId', 'duration', 'totalMarks', 'passingMarks']
        for field in required_fields:
            if field not in quiz_data:
                return Response(json.dumps({"Message": f"Missing required field: {field}", "status": 400}), status=400)
        
        # Create quiz document
        quiz_doc = create_quiz_document(quiz_data)
        
        # Insert into database
        quizzes = mongo.db.quizzes
        quizzes.insert_one(quiz_doc)
        
        return Response(json.dumps({
            "Message": "Quiz created successfully", 
            "quizId": quiz_id,
            "status": 201
        }), status=201)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error creating quiz: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/<quiz_id>', methods=['GET'])
@cross_origin()
@token_required
def get_quiz(currentuser, quiz_id):
    """Get quiz details"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        quizzes = mongo.db.quizzes
        quiz = quizzes.find_one({'quizId': quiz_id}, {'_id': False})
        
        if not quiz:
            return Response(json.dumps({"Message": "Quiz not found", "status": 404}), status=404)
        
        # MongoDB with our model stores dates as ISO strings, so no conversion needed
        return Response(json.dumps({
            "Message": "Quiz retrieved", 
            "quiz": quiz,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving quiz: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/<quiz_id>', methods=['PUT'])
@cross_origin()
@token_required
def update_quiz(currentuser, quiz_id):
    """Update quiz details"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        update_data = request.json
        update_data['updatedAt'] = datetime.now(tz_NY).isoformat()
        
        quizzes = mongo.db.quizzes
        result = quizzes.update_one(
            {'quizId': quiz_id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Quiz not found", "status": 404}), status=404)
        
        return Response(json.dumps({
            "Message": "Quiz updated successfully",
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error updating quiz: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/<quiz_id>', methods=['DELETE'])
@cross_origin()
@token_required
def delete_quiz(currentuser, quiz_id):
    """Delete a quiz"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        quizzes = mongo.db.quizzes
        result = quizzes.update_one(
            {'quizId': quiz_id},
            {'$set': {'isActive': False, 'updatedAt': datetime.now(tz_NY).isoformat()}}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Quiz not found", "status": 404}), status=404)
        
        return Response(json.dumps({
            "Message": "Quiz deleted successfully",
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error deleting quiz: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quizzes', methods=['GET'])
@cross_origin()
@token_required
def list_quizzes(currentuser):
    """List all quizzes with performance statistics"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        course_id = request.args.get('courseId')
        quizzes = mongo.db.quizzes
        attempts = mongo.db.quiz_attempts
        
        query = {'isActive': True}
        if course_id:
            query['courseId'] = course_id
            
        quiz_list = list(quizzes.find(query, {'_id': False}))
        
        # Enhance each quiz with statistics
        for quiz in quiz_list:
            quiz_id = quiz.get('quizId')
            
            # Get attempts for this quiz
            quiz_attempts = list(attempts.find({'quizId': quiz_id}))
            
            # Calculate statistics
            total_attempts = len(quiz_attempts)
            completed_attempts = [a for a in quiz_attempts if a.get('status') == 'completed']
            
            if completed_attempts:
                scores = [a.get('finalScore', 0) for a in completed_attempts if a.get('finalScore') is not None]
                avg_score = sum(scores) / len(scores) if scores else 0
            else:
                avg_score = 0
            
            # Add calculated fields to match frontend expectations
            quiz['attempts'] = total_attempts
            quiz['avgScore'] = round(avg_score, 1)
            quiz['code'] = quiz.get('quizId', '')[:10].upper()  # Short code for display
            quiz['id'] = quiz.get('quizId')
            quiz['createdDate'] = quiz.get('createdAt', '')
            quiz['questionCount'] = len(quiz.get('questions', []))
            quiz['passScore'] = quiz.get('passingMarks', 0)
            quiz['status'] = quiz.get('status', 'active').lower()
            quiz['difficulty'] = quiz.get('difficulty', 'intermediate')
            
            # Get course title if available
            if quiz.get('courseId'):
                courses = mongo.db.courses
                course = courses.find_one({'courseid': quiz['courseId']})
                quiz['course'] = course.get('title', 'Unknown Course') if course else 'Unknown Course'
            else:
                quiz['course'] = 'No Course Assigned'
        
        return Response(json.dumps({
            "Message": "Quizzes retrieved successfully",
            "data": {"quizzes": quiz_list},
            "success": True,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error listing quizzes: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/<quiz_id>/analytics', methods=['GET'])
@cross_origin()
@token_required
def get_quiz_analytics(currentuser, quiz_id):
    """Get detailed analytics for a specific quiz"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        quizzes = mongo.db.quizzes
        attempts = mongo.db.quiz_attempts
        
        # Get quiz details
        quiz = quizzes.find_one({'quizId': quiz_id}, {'_id': False})
        if not quiz:
            return Response(json.dumps({"Message": "Quiz not found", "status": 404}), status=404)
        
        # Get all attempts for this quiz
        quiz_attempts = list(attempts.find({'quizId': quiz_id}))
        
        # Calculate detailed analytics
        total_attempts = len(quiz_attempts)
        completed_attempts = [a for a in quiz_attempts if a.get('status') == 'completed']
        in_progress_attempts = [a for a in quiz_attempts if a.get('status') == 'in_progress']
        
        if completed_attempts:
            scores = [a.get('finalScore', 0) for a in completed_attempts if a.get('finalScore') is not None]
            avg_score = sum(scores) / len(scores) if scores else 0
            max_score = max(scores) if scores else 0
            min_score = min(scores) if scores else 0
            
            # Pass/fail statistics
            passing_score = quiz.get('passingMarks', 0)
            passed_attempts = [s for s in scores if s >= passing_score]
            pass_rate = (len(passed_attempts) / len(scores)) * 100 if scores else 0
        else:
            avg_score = max_score = min_score = pass_rate = 0
        
        # Time-based analytics
        completion_times = []
        for attempt in completed_attempts:
            if attempt.get('startedAt') and attempt.get('submittedAt'):
                try:
                    start_time = datetime.fromisoformat(attempt['startedAt'].replace('Z', '+00:00'))
                    end_time = datetime.fromisoformat(attempt['submittedAt'].replace('Z', '+00:00'))
                    completion_time = (end_time - start_time).total_seconds() / 60  # minutes
                    completion_times.append(completion_time)
                except:
                    pass
        
        avg_completion_time = sum(completion_times) / len(completion_times) if completion_times else 0
        
        analytics = {
            'quiz': quiz,
            'statistics': {
                'totalAttempts': total_attempts,
                'completedAttempts': len(completed_attempts),
                'inProgressAttempts': len(in_progress_attempts),
                'averageScore': round(avg_score, 1),
                'maxScore': max_score,
                'minScore': min_score,
                'passRate': round(pass_rate, 1),
                'averageCompletionTime': round(avg_completion_time, 1)
            },
            'recentAttempts': quiz_attempts[-10:] if quiz_attempts else []  # Last 10 attempts
        }
        
        return Response(json.dumps({
            "Message": "Quiz analytics retrieved successfully",
            "data": analytics,
            "success": True,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error getting quiz analytics: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/<quiz_id>/export', methods=['GET'])
@cross_origin()
@token_required
def export_quiz_results(currentuser, quiz_id):
    """Export quiz results and performance data"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        quizzes = mongo.db.quizzes
        attempts = mongo.db.quiz_attempts
        users = mongo.db.users
        
        # Get quiz details
        quiz = quizzes.find_one({'quizId': quiz_id}, {'_id': False})
        if not quiz:
            return Response(json.dumps({"Message": "Quiz not found", "status": 404}), status=404)
        
        # Get all completed attempts for this quiz
        quiz_attempts = list(attempts.find({'quizId': quiz_id, 'status': 'completed'}))
        
        export_data = []
        for attempt in quiz_attempts:
            # Get student details
            student = users.find_one({'email': attempt.get('studentEmail')}, {'password': False, '_id': False})
            
            attempt_data = {
                'attemptId': attempt.get('attemptId'),
                'studentName': f"{student.get('firstName', '')} {student.get('lastName', '')}" if student else 'Unknown',
                'studentEmail': attempt.get('studentEmail'),
                'startedAt': attempt.get('startedAt'),
                'submittedAt': attempt.get('submittedAt'),
                'finalScore': attempt.get('finalScore', 0),
                'percentage': attempt.get('percentage', 0),
                'totalQuestions': len(attempt.get('responses', [])),
                'correctAnswers': len([r for r in attempt.get('responses', []) if r.get('isCorrect')]),
                'timeSpent': attempt.get('timeSpent', 0),
                'status': attempt.get('status'),
                'grade': 'Pass' if attempt.get('finalScore', 0) >= quiz.get('passingMarks', 0) else 'Fail'
            }
            export_data.append(attempt_data)
        
        return Response(json.dumps({
            "Message": "Quiz results exported successfully",
            "data": {
                "quiz": quiz,
                "results": export_data,
                "summary": {
                    "totalAttempts": len(export_data),
                    "averageScore": sum([r['finalScore'] for r in export_data]) / len(export_data) if export_data else 0,
                    "passRate": (len([r for r in export_data if r['grade'] == 'Pass']) / len(export_data)) * 100 if export_data else 0
                }
            },
            "success": True,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error exporting quiz results: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/<quiz_id>/preview', methods=['GET'])
@cross_origin()
@token_required
def preview_quiz(currentuser, quiz_id):
    """Preview quiz as student would see it"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        quizzes = mongo.db.quizzes
        questions = mongo.db.quiz_questions
        
        # Get quiz details
        quiz = quizzes.find_one({'quizId': quiz_id}, {'_id': False})
        if not quiz:
            return Response(json.dumps({"Message": "Quiz not found", "status": 404}), status=404)
        
        # Get quiz questions
        quiz_questions = list(questions.find({'quizId': quiz_id}, {'_id': False}))
        
        # Format questions for preview (hide correct answers)
        preview_questions = []
        for question in quiz_questions:
            preview_question = {
                'questionId': question.get('questionId'),
                'type': question.get('type'),
                'questionText': question.get('questionText'),
                'marks': question.get('marks'),
                'options': question.get('options', []),
                'explanation': question.get('explanation', ''),
                'orderIndex': question.get('orderIndex', 0)
            }
            # Don't include correct answer in preview
            preview_questions.append(preview_question)
        
        # Sort questions by order
        preview_questions.sort(key=lambda x: x.get('orderIndex', 0))
        
        quiz_preview = {
            'quiz': quiz,
            'questions': preview_questions,
            'totalQuestions': len(preview_questions),
            'totalMarks': sum([q.get('marks', 0) for q in preview_questions])
        }
        
        return Response(json.dumps({
            "Message": "Quiz preview generated successfully",
            "data": quiz_preview,
            "success": True,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error generating quiz preview: {str(e)}", "status": 500}), status=500)


# ---- Question Management ----

@app.route('/api/admin/quiz/<quiz_id>/question', methods=['POST'])
@cross_origin()
@token_required
def add_question(currentuser, quiz_id):
    """Add a question to a quiz"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        question_data = request.json
        
        # Generate question ID
        question_id = f"q_{quiz_id}_{int(datetime.now().timestamp())}_{random.randint(100, 999)}"
        question_data['questionId'] = question_id
        question_data['quizId'] = quiz_id
        question_data['createdAt'] = datetime.now(tz_NY).isoformat()
        
        # Validate required fields
        required_fields = ['type', 'questionText', 'marks', 'correctAnswer']
        for field in required_fields:
            if field not in question_data:
                return Response(json.dumps({"Message": f"Missing required field: {field}", "status": 400}), status=400)
        
        # Validate question type
        if question_data['type'] not in [QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE, 
                                       QuestionType.NUMERIC, QuestionType.SHORT_ANSWER]:
            return Response(json.dumps({"Message": "Invalid question type", "status": 400}), status=400)
        
        # Insert question
        questions = mongo.db.questions
        questions.insert_one(question_data)
        
        # Add question ID to quiz
        quizzes = mongo.db.quizzes
        quizzes.update_one(
            {'quizId': quiz_id},
            {'$push': {'questionIds': question_id}, '$set': {'updatedAt': datetime.now(tz_NY).isoformat()}}
        )
        
        return Response(json.dumps({
            "Message": "Question added successfully",
            "questionId": question_id,
            "status": 201
        }), status=201)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error adding question: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/question/<question_id>', methods=['PUT'])
@cross_origin()
@token_required
def update_question(currentuser, question_id):
    """Update a question"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        update_data = request.json
        update_data['updatedAt'] = datetime.now(tz_NY).isoformat()
        
        questions = mongo.db.questions
        result = questions.update_one(
            {'questionId': question_id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return Response(json.dumps({"Message": "Question not found", "status": 404}), status=404)
        
        return Response(json.dumps({
            "Message": "Question updated successfully",
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error updating question: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/question/<question_id>', methods=['DELETE'])
@cross_origin()
@token_required
def delete_question(currentuser, question_id):
    """Delete a question"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        # Get question to find quiz ID
        questions = mongo.db.questions
        question = questions.find_one({'questionId': question_id})
        
        if not question:
            return Response(json.dumps({"Message": "Question not found", "status": 404}), status=404)
        
        quiz_id = question['quizId']
        
        # Remove question
        questions.delete_one({'questionId': question_id})
        
        # Remove question ID from quiz
        quizzes = mongo.db.quizzes
        quizzes.update_one(
            {'quizId': quiz_id},
            {'$pull': {'questionIds': question_id}, '$set': {'updatedAt': datetime.now(tz_NY).isoformat()}}
        )
        
        return Response(json.dumps({
            "Message": "Question deleted successfully",
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error deleting question: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/<quiz_id>/questions', methods=['GET'])
@cross_origin()
@token_required
def get_quiz_questions(currentuser, quiz_id):
    """Get all questions for a quiz"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        questions = mongo.db.questions
        question_list = list(questions.find({'quizId': quiz_id}, {'_id': False}).sort('order', 1))
        
        return Response(json.dumps({
            "Message": "Questions retrieved",
            "questions": question_list,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving questions: {str(e)}", "status": 500}), status=500)


# ---- Quiz Assignment Management ----

@app.route('/api/admin/quiz/assign', methods=['POST'])
@cross_origin()
@token_required
def assign_quiz(currentuser):
    """Assign a quiz to batches or individual students"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        assignment_data = request.json
        
        # Generate assignment ID
        assignment_id = f"assign_{int(datetime.now().timestamp())}_{random.randint(1000, 9999)}"
        
        assignment_doc = {
            "assignmentId": assignment_id,
            "quizId": assignment_data['quizId'],
            "assignedBy": currentuser['email'],
            "assignedAt": datetime.now(tz_NY).isoformat(),
            "dueDate": assignment_data['dueDate'],
            "assignmentType": assignment_data['assignmentType'],  # 'batch' or 'individual'
            "assignedTo": assignment_data['assignedTo'],
            "maxAttempts": assignment_data.get('maxAttempts', 1),
            "instructions": assignment_data.get('instructions', ''),
            "isActive": True,
            "createdAt": datetime.now(tz_NY).isoformat(),
            "updatedAt": datetime.now(tz_NY).isoformat()
        }
        
        # Validate assignment
        if assignment_data['assignmentType'] == 'batch':
            if 'batchIds' not in assignment_data['assignedTo']:
                return Response(json.dumps({"Message": "batchIds required for batch assignment", "status": 400}), status=400)
        elif assignment_data['assignmentType'] == 'individual':
            if 'studentEmails' not in assignment_data['assignedTo']:
                return Response(json.dumps({"Message": "studentEmails required for individual assignment", "status": 400}), status=400)
        
        # Insert assignment
        assignments = mongo.db.quiz_assignments
        assignments.insert_one(assignment_doc)
        
        return Response(json.dumps({
            "Message": "Quiz assigned successfully",
            "assignmentId": assignment_id,
            "status": 201
        }), status=201)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error assigning quiz: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/quiz/assignments', methods=['GET'])
@cross_origin()
@token_required
def list_assignments(currentuser):
    """List all quiz assignments"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        assignments = mongo.db.quiz_assignments
        assignment_list = list(assignments.find({'isActive': True}, {'_id': False}))
        
        return Response(json.dumps({
            "Message": "Assignments retrieved",
            "assignments": assignment_list,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error listing assignments: {str(e)}", "status": 500}), status=500)


# ---- Manual Grading ----

@app.route('/api/admin/attempt/<attempt_id>/grade', methods=['PUT'])
@cross_origin()
@token_required
def grade_attempt_manually(currentuser, attempt_id):
    """Manually grade specific questions in an attempt"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        grading_data = request.json  # Expected: [{"questionId": "...", "marks": 5, "feedback": "..."}]
        
        for grade in grading_data:
            success = ManualGradingHelper.update_question_score(
                attempt_id,
                grade['questionId'],
                grade['marks'],
                grade.get('feedback', ''),
                currentuser['email'],
                mongo.db
            )
            
            if not success:
                return Response(json.dumps({
                    "Message": f"Failed to update grade for question {grade['questionId']}", 
                    "status": 500
                }), status=500)
        
        return Response(json.dumps({
            "Message": "Grades updated successfully",
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error grading attempt: {str(e)}", "status": 500}), status=500)


@app.route('/api/admin/attempts', methods=['GET'])
@cross_origin()
@token_required
def list_attempts(currentuser):
    """List all attempts for admin review"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        quiz_id = request.args.get('quizId')
        status = request.args.get('status')
        
        query = {}
        if quiz_id:
            query['quizId'] = quiz_id
        if status:
            query['status'] = status
            
        attempts = mongo.db.attempts
        attempt_list = list(attempts.find(query, {'_id': False}).sort('startedAt', -1))
        
        return Response(json.dumps({
            "Message": "Attempts retrieved",
            "attempts": attempt_list,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error listing attempts: {str(e)}", "status": 500}), status=500)


# ---- Student Quiz Endpoints ----

@app.route('/api/student/assignments', methods=['GET'])
@cross_origin()
@token_required
def get_student_assignments(currentuser):
    """Get quiz assignments for the current student"""
    if currentuser['role'] != 'STUDENT':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        student_email = currentuser['email']
        
        # Find assignments for this student (direct or via batch)
        assignments = mongo.db.quiz_assignments
        
        # Direct assignments
        direct_assignments = list(assignments.find({
            'isActive': True,
            'assignmentType': 'individual',
            'assignedTo.studentEmails': student_email
        }, {'_id': False}))
        
        # Batch assignments - need to check student's enrolled batches
        # For now, we'll check if student is enrolled in any courses
        enrolled_course_ids = []
        if 'enrollments' in currentuser:
            for enrollment in currentuser['enrollments']:
                if enrollment['enrollmentStatus'] in ['Approved', 'Certified']:
                    enrolled_course_ids.append(enrollment['courseID'])
        
        batch_assignments = []
        if enrolled_course_ids:
            # This is a simplified approach - in production you'd have proper batch management
            batch_assignments = list(assignments.find({
                'isActive': True,
                'assignmentType': 'batch'
            }, {'_id': False}))
            
            # Filter by course enrollment
            filtered_batch_assignments = []
            for assignment in batch_assignments:
                quiz_id = assignment['quizId']
                quizzes = mongo.db.quizzes
                quiz = quizzes.find_one({'quizId': quiz_id})
                if quiz and quiz['courseId'] in enrolled_course_ids:
                    filtered_batch_assignments.append(assignment)
            batch_assignments = filtered_batch_assignments
        
        all_assignments = direct_assignments + batch_assignments
        
        # Add quiz details and attempt status
        for assignment in all_assignments:
            quiz_id = assignment['quizId']
            
            # Get quiz details
            quizzes = mongo.db.quizzes
            quiz = quizzes.find_one({'quizId': quiz_id}, {'_id': False, 'questionIds': False})
            assignment['quiz'] = quiz
            
            # Get attempt status
            attempts = mongo.db.attempts
            student_attempts = list(attempts.find({
                'assignmentId': assignment['assignmentId'],
                'studentEmail': student_email
            }, {'_id': False}).sort('attemptNumber', -1))
            
            assignment['attempts'] = student_attempts
            assignment['attemptCount'] = len(student_attempts)
            assignment['canAttempt'] = len(student_attempts) < assignment['maxAttempts']
            
            # Check if due date has passed
            due_date = datetime.fromisoformat(assignment['dueDate'].replace('Z', '+00:00'))
            assignment['isOverdue'] = datetime.now(tz_NY) > due_date
        
        return Response(json.dumps({
            "Message": "Assignments retrieved",
            "assignments": all_assignments,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving assignments: {str(e)}", "status": 500}), status=500)


@app.route('/api/student/quiz/<quiz_id>/metadata', methods=['GET'])
@cross_origin()
@token_required
def get_quiz_metadata(currentuser, quiz_id):
    """Get quiz metadata for student (without questions)"""
    if currentuser['role'] != 'STUDENT':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        # Verify student has access to this quiz
        assignments = mongo.db.quiz_assignments
        student_email = currentuser['email']
        
        assignment = assignments.find_one({
            'quizId': quiz_id,
            'isActive': True,
            '$or': [
                {'assignmentType': 'individual', 'assignedTo.studentEmails': student_email},
                {'assignmentType': 'batch'}  # Simplified - would check actual batch membership
            ]
        })
        
        if not assignment:
            return Response(json.dumps({"Message": "Quiz not accessible", "status": 403}), status=403)
        
        # Get quiz metadata
        quizzes = mongo.db.quizzes
        quiz = quizzes.find_one({'quizId': quiz_id}, {
            '_id': False,
            'questionIds': False,  # Don't expose question IDs to students
            'createdBy': False
        })
        
        if not quiz:
            return Response(json.dumps({"Message": "Quiz not found", "status": 404}), status=404)
        
        # Get question count
        questions = mongo.db.questions
        question_count = questions.count_documents({'quizId': quiz_id})
        quiz['questionCount'] = question_count
        
        return Response(json.dumps({
            "Message": "Quiz metadata retrieved",
            "quiz": quiz,
            "assignment": assignment,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving quiz metadata: {str(e)}", "status": 500}), status=500)


@app.route('/api/student/quiz/<assignment_id>/start', methods=['POST'])
@cross_origin()
@token_required
def start_quiz_attempt(currentuser, assignment_id):
    """Start a new quiz attempt"""
    if currentuser['role'] != 'STUDENT':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        student_email = currentuser['email']
        
        # Get assignment details
        assignments = mongo.db.quiz_assignments
        assignment = assignments.find_one({'assignmentId': assignment_id, 'isActive': True})
        
        if not assignment:
            return Response(json.dumps({"Message": "Assignment not found", "status": 404}), status=404)
        
        # Verify student has access
        has_access = False
        if assignment['assignmentType'] == 'individual':
            has_access = student_email in assignment['assignedTo'].get('studentEmails', [])
        elif assignment['assignmentType'] == 'batch':
            # Simplified check - in production would verify actual batch membership
            has_access = True  # For now, allow all enrolled students
        
        if not has_access:
            return Response(json.dumps({"Message": "Access denied to this assignment", "status": 403}), status=403)
        
        # Check if student can attempt (not exceeded max attempts)
        attempts = mongo.db.attempts
        existing_attempts = attempts.count_documents({
            'assignmentId': assignment_id,
            'studentEmail': student_email
        })
        
        if existing_attempts >= assignment['maxAttempts']:
            return Response(json.dumps({"Message": "Maximum attempts exceeded", "status": 400}), status=400)
        
        # Check if assignment is still active (not past due date)
        due_date = datetime.fromisoformat(assignment['dueDate'].replace('Z', '+00:00'))
        if datetime.now(tz_NY) > due_date:
            return Response(json.dumps({"Message": "Assignment deadline has passed", "status": 400}), status=400)
        
        # Get quiz details
        quiz_id = assignment['quizId']
        quizzes = mongo.db.quizzes
        quiz = quizzes.find_one({'quizId': quiz_id})
        
        if not quiz or not quiz['isActive']:
            return Response(json.dumps({"Message": "Quiz not available", "status": 400}), status=400)
        
        # Create new attempt
        attempt_id = f"attempt_{student_email}_{assignment_id}_{int(datetime.now().timestamp())}"
        
        attempt_data = {
            'attemptId': attempt_id,
            'quizId': quiz_id,
            'assignmentId': assignment_id,
            'studentEmail': student_email,
            'attemptNumber': existing_attempts + 1,
            'duration': quiz['duration'],
            'maxScore': quiz['totalMarks'],
            'clientInfo': {
                'userAgent': request.headers.get('User-Agent', ''),
                'ipAddress': request.remote_addr,
                'screenResolution': request.json.get('screenResolution', '') if request.json else ''
            }
        }
        
        attempt_doc = create_attempt_document(attempt_data)
        
        # Insert attempt
        attempts.insert_one(attempt_doc)
        
        # Log attempt start
        result_logs = mongo.db.result_logs
        log_entry = {
            "logId": f"log_{attempt_id}_start",
            "attemptId": attempt_id,
            "quizId": quiz_id,
            "studentEmail": student_email,
            "actionType": "attempt_started",
            "actionData": {"attemptNumber": existing_attempts + 1},
            "performedBy": student_email,
            "timestamp": datetime.now(tz_NY).isoformat()
        }
        result_logs.insert_one(log_entry)
        
        return Response(json.dumps({
            "Message": "Attempt started successfully",
            "attemptId": attempt_id,
            "dueAt": attempt_doc['dueAt'],
            "duration": quiz['duration'],
            "status": 201
        }), status=201)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error starting attempt: {str(e)}", "status": 500}), status=500)


@app.route('/api/student/attempt/<attempt_id>/questions', methods=['GET'])
@cross_origin()
@token_required
def get_attempt_questions(currentuser, attempt_id):
    """Get questions for an active attempt"""
    if currentuser['role'] != 'STUDENT':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        student_email = currentuser['email']
        
        # Verify attempt belongs to student and is active
        attempts = mongo.db.attempts
        attempt = attempts.find_one({
            'attemptId': attempt_id,
            'studentEmail': student_email,
            'status': 'in_progress'
        })
        
        if not attempt:
            return Response(json.dumps({"Message": "Active attempt not found", "status": 404}), status=404)
        
        # Check if attempt is still within time limit
        due_at = datetime.fromisoformat(attempt['dueAt'].replace('Z', '+00:00'))
        if datetime.now(tz_NY) > due_at:
            # Auto-submit expired attempt
            TimerEnforcement.handle_late_submission(attempt_id, {}, mongo.db)
            attempts.update_one(
                {'attemptId': attempt_id},
                {'$set': {'status': 'timed_out', 'submittedAt': datetime.now(tz_NY).isoformat()}}
            )
            return Response(json.dumps({"Message": "Attempt has expired", "status": 400}), status=400)
        
        # Get questions for the quiz (excluding correct answers and explanations)
        quiz_id = attempt['quizId']
        questions = mongo.db.questions
        question_list = list(questions.find(
            {'quizId': quiz_id},
            {
                '_id': False,
                'correctAnswer': False,
                'explanation': False
            }
        ).sort('order', 1))
        
        return Response(json.dumps({
            "Message": "Questions retrieved",
            "questions": question_list,
            "attempt": {
                "attemptId": attempt_id,
                "dueAt": attempt['dueAt'],
                "timeRemaining": int((due_at - datetime.now(tz_NY)).total_seconds())
            },
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving questions: {str(e)}", "status": 500}), status=500)


@app.route('/api/student/attempt/<attempt_id>/answer', methods=['POST'])
@cross_origin()
@token_required
def save_answer(currentuser, attempt_id):
    """Save an answer during an attempt"""
    if currentuser['role'] != 'STUDENT':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        student_email = currentuser['email']
        answer_data = request.json
        
        # Verify attempt belongs to student and is active
        attempts = mongo.db.attempts
        attempt = attempts.find_one({
            'attemptId': attempt_id,
            'studentEmail': student_email,
            'status': 'in_progress'
        })
        
        if not attempt:
            return Response(json.dumps({"Message": "Active attempt not found", "status": 404}), status=404)
        
        # Check if attempt is still within time limit
        due_at = datetime.fromisoformat(attempt['dueAt'].replace('Z', '+00:00'))
        if datetime.now(tz_NY) > due_at:
            return Response(json.dumps({"Message": "Attempt has expired", "status": 400}), status=400)
        
        question_id = answer_data['questionId']
        answer = answer_data['answer']
        
        # Update or insert answer
        result = attempts.update_one(
            {
                'attemptId': attempt_id,
                'answers.questionId': question_id
            },
            {
                '$set': {
                    'answers.$.answer': answer,
                    'answers.$.answeredAt': datetime.now(tz_NY).isoformat(),
                    'updatedAt': datetime.now(tz_NY).isoformat()
                }
            }
        )
        
        if result.matched_count == 0:
            # Answer doesn't exist, add it
            attempts.update_one(
                {'attemptId': attempt_id},
                {
                    '$push': {
                        'answers': {
                            'questionId': question_id,
                            'answer': answer,
                            'answeredAt': datetime.now(tz_NY).isoformat()
                        }
                    },
                    '$set': {'updatedAt': datetime.now(tz_NY).isoformat()}
                }
            )
        
        # Log answer save
        result_logs = mongo.db.result_logs
        log_entry = {
            "logId": f"log_{attempt_id}_{question_id}_{int(datetime.now().timestamp())}",
            "attemptId": attempt_id,
            "quizId": attempt['quizId'],
            "studentEmail": student_email,
            "actionType": "answer_saved",
            "actionData": {
                "questionId": question_id,
                "answer": answer
            },
            "performedBy": student_email,
            "timestamp": datetime.now(tz_NY).isoformat()
        }
        result_logs.insert_one(log_entry)
        
        return Response(json.dumps({
            "Message": "Answer saved successfully",
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error saving answer: {str(e)}", "status": 500}), status=500)


@app.route('/api/student/attempt/<attempt_id>/submit', methods=['POST'])
@cross_origin()
@token_required
def submit_attempt(currentuser, attempt_id):
    """Submit a quiz attempt"""
    if currentuser['role'] != 'STUDENT':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        student_email = currentuser['email']
        
        # Get attempt
        attempts = mongo.db.attempts
        attempt = attempts.find_one({
            'attemptId': attempt_id,
            'studentEmail': student_email,
            'status': 'in_progress'
        })
        
        if not attempt:
            return Response(json.dumps({"Message": "Active attempt not found", "status": 404}), status=404)
        
        # Get quiz and questions for scoring
        quiz_id = attempt['quizId']
        quizzes = mongo.db.quizzes
        quiz = quizzes.find_one({'quizId': quiz_id})
        
        questions = mongo.db.questions
        question_list = list(questions.find({'quizId': quiz_id}))
        
        # Score the attempt
        scoring_engine = ScoringEngine()
        score_result = scoring_engine.score_attempt(question_list, attempt.get('answers', []))
        
        # Calculate time spent
        started_at = datetime.fromisoformat(attempt['startedAt'].replace('Z', '+00:00'))
        submitted_at = datetime.now(tz_NY)
        time_spent = int((submitted_at - started_at).total_seconds())
        
        # Check if late submission
        due_at = datetime.fromisoformat(attempt['dueAt'].replace('Z', '+00:00'))
        is_late = submitted_at > due_at
        
        # Determine pass/fail
        passing_percentage = (quiz['passingMarks'] / quiz['totalMarks']) * 100
        passed = score_result['percentage'] >= passing_percentage
        
        # Update attempt with results
        update_data = {
            'status': 'submitted',
            'submittedAt': submitted_at.isoformat(),
            'answers': score_result['scored_answers'],
            'totalScore': score_result['total_score'],
            'percentage': score_result['percentage'],
            'passed': passed,
            'isLateSubmission': is_late,
            'timeSpent': time_spent,
            'updatedAt': submitted_at.isoformat()
        }
        
        # Handle late submission penalty
        if is_late:
            TimerEnforcement.handle_late_submission(attempt_id, quiz.get('settings', {}), mongo.db)
            # Get updated attempt data after penalty calculation
            updated_attempt = attempts.find_one({'attemptId': attempt_id})
            update_data['totalScore'] = updated_attempt.get('totalScore', score_result['total_score'])
            update_data['percentage'] = updated_attempt.get('percentage', score_result['percentage'])
            update_data['passed'] = updated_attempt.get('passed', passed)
            update_data['latePenaltyApplied'] = updated_attempt.get('latePenaltyApplied', 0)
        
        attempts.update_one({'attemptId': attempt_id}, {'$set': update_data})
        
        # Log submission
        result_logs = mongo.db.result_logs
        log_entry = {
            "logId": f"log_{attempt_id}_submit",
            "attemptId": attempt_id,
            "quizId": quiz_id,
            "studentEmail": student_email,
            "actionType": "attempt_submitted",
            "actionData": {
                "totalScore": update_data['totalScore'],
                "percentage": update_data['percentage'],
                "passed": update_data['passed'],
                "isLateSubmission": is_late
            },
            "performedBy": student_email,
            "timestamp": submitted_at.isoformat()
        }
        result_logs.insert_one(log_entry)
        
        return Response(json.dumps({
            "Message": "Attempt submitted successfully",
            "result": {
                "totalScore": update_data['totalScore'],
                "maxScore": score_result['max_score'],
                "percentage": update_data['percentage'],
                "passed": update_data['passed'],
                "isLateSubmission": is_late
            },
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error submitting attempt: {str(e)}", "status": 500}), status=500)


@app.route('/api/student/attempt/<attempt_id>/result', methods=['GET'])
@cross_origin()
@token_required
def get_attempt_result(currentuser, attempt_id):
    """Get detailed results for a completed attempt"""
    if currentuser['role'] != 'STUDENT':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        student_email = currentuser['email']
        
        # Get attempt
        attempts = mongo.db.attempts
        attempt = attempts.find_one({
            'attemptId': attempt_id,
            'studentEmail': student_email
        }, {'_id': False})
        
        if not attempt:
            return Response(json.dumps({"Message": "Attempt not found", "status": 404}), status=404)
        
        if attempt['status'] == 'in_progress':
            return Response(json.dumps({"Message": "Attempt not yet completed", "status": 400}), status=400)
        
        # Get quiz details to check if results should be shown immediately
        quiz_id = attempt['quizId']
        quizzes = mongo.db.quizzes
        quiz = quizzes.find_one({'quizId': quiz_id})
        
        if not quiz['settings'].get('showResultsImmediately', True):
            # Only show basic info if results are not to be shown immediately
            return Response(json.dumps({
                "Message": "Results retrieved",
                "result": {
                    "status": attempt['status'],
                    "submittedAt": attempt.get('submittedAt'),
                    "message": "Results will be available after review"
                },
                "status": 200
            }), status=200)
        
        # Get questions for additional context
        questions = mongo.db.questions
        question_lookup = {q['questionId']: q for q in questions.find({'quizId': quiz_id})}
        
        # Enhance answers with question details
        enhanced_answers = []
        for answer in attempt.get('answers', []):
            question = question_lookup.get(answer['questionId'])
            if question:
                enhanced_answer = {
                    **answer,
                    'questionText': question['questionText'],
                    'questionType': question['type'],
                    'maxMarks': question['marks']
                }
                enhanced_answers.append(enhanced_answer)
        
        result = {
            "attemptId": attempt_id,
            "status": attempt['status'],
            "startedAt": attempt['startedAt'],
            "submittedAt": attempt.get('submittedAt'),
            "totalScore": attempt.get('totalScore'),
            "maxScore": attempt.get('maxScore'),
            "percentage": attempt.get('percentage'),
            "passed": attempt.get('passed'),
            "isLateSubmission": attempt.get('isLateSubmission', False),
            "latePenaltyApplied": attempt.get('latePenaltyApplied', 0),
            "timeSpent": attempt.get('timeSpent'),
            "answers": enhanced_answers,
            "quiz": {
                "title": quiz['title'],
                "totalMarks": quiz['totalMarks'],
                "passingMarks": quiz['passingMarks']
            }
        }
        
        return Response(json.dumps({
            "Message": "Results retrieved",
            "result": result,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error retrieving results: {str(e)}", "status": 500}), status=500)


# Phonepe Payment Intergration

@app.route('/api/initiate-payment', methods=['POST'])
@cross_origin()
def initiate_payment_get():
    if not phonepe_client or not PgPayRequest:
        return Response(json.dumps({"Message": "Payment service not available", "status": 503}), status=503)
    
    try:
        unique_transaction_id = str(uuid.uuid4())[:-2]
        ui_redirect_url = f"https://{backendURL}/frontendredirect/{unique_transaction_id}"  
        s2s_callback_url = f"https://{frontendURL}/paymentstatus"
        amount = request.json.get('amount')  
        user_id = request.json.get('user_id')

        pay_page_request = PgPayRequest.pay_page_pay_request_builder(
            merchant_transaction_id=unique_transaction_id, 
            amount=amount*100,
            merchant_user_id=user_id,
            callback_url=s2s_callback_url,
            redirect_url=ui_redirect_url
        )  
        
        pay_page_response = phonepe_client.pay(pay_page_request)  
        pay_page_url = pay_page_response.data.instrument_response.redirect_info.url 
        
        return Response(json.dumps({
            "Message": "Payment initiated successfully", 
            "pay_page_url": pay_page_url,
            "transaction_id": unique_transaction_id,
            "status": 200
        }), status=200)
        
    except Exception as e:
        print(f"Payment initiation error: {e}")
        return Response(json.dumps({"Message": "Payment initiation failed", "error": str(e), "status": 500}), status=500)

    
@app.route('/api/callback/<transaction_id>', methods=['GET'])
@cross_origin()
def check_payment_status(transaction_id):
    if not phonepe_client:
        return Response(json.dumps({"Message": "Payment service not available", "status": 503}), status=503)
    
    try:
        pay_page_response = phonepe_client.check_status(transaction_id)
        print(f"Payment Status Response: {pay_page_response}")
        print("Success:", pay_page_response.success)
        print("Code:", pay_page_response.code)
        print("Message:", pay_page_response.message)
        
        return Response(json.dumps({
            "Message": "Payment status retrieved",
            "success": pay_page_response.success,
            "code": pay_page_response.code,
            "payment_status": pay_page_response.message,
            "transaction_id": transaction_id,
            "status": 200
        }), status=200)
        
    except Exception as e:
        print(f"Payment status check error: {e}")
        return Response(json.dumps({"Message": "Payment status check failed", "error": str(e), "status": 500}), status=500)


@app.route('/api/frontendredirect/<transaction_id>', methods=['GET'])
@cross_origin()
def redirecturl(transaction_id):
    try:
        # Redirect to frontend with transaction status
        frontend_redirect_url = f"{frontendURL}/payment-status?transaction_id={transaction_id}"
        return redirect(frontend_redirect_url)
    except Exception as e:
        print(f"Redirect error: {e}")
        return Response(json.dumps({"Message": "Redirect failed", "error": str(e), "status": 500}), status=500)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
