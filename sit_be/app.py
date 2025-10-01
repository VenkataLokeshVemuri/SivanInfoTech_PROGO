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
app.config["MONGO_URI"] = "mongodb://localhost:27017/sivaninfo_db"
# app.config["MONGO_URI"] = "mongodb://situser:sitadmin@localhost:27017/admin"
# app.config["MONGO_URI"] = "mongodb://situser:sitadmin@mongo:27017/admin"

# Try to connect to MongoDB, fall back to mock database if not available
MONGODB_AVAILABLE = False
try:
    mongo = PyMongo(app)
    # Test the connection
    mongo.db.list_collection_names()
    MONGODB_AVAILABLE = True
    print("MongoDB connected successfully")
    
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
            
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    print("Falling back to mock database for testing")
    from mock_db import mock_mongo
    mongo = mock_mongo

cors = CORS(app)


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
    
    # Disable email verification for testing with mock database
    if not MONGODB_AVAILABLE:
        verified = True
        print("Mock database mode: Email verification disabled for testing")
    else:
        verified = False
        sendverificationmail(request, app.config['VERIFICATION_SECRET_KEY'])
    
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
        return Response(json.dumps(
            {"Message": "Please Signup to login", "status": 401}),
                        status=401)
    if signin_user:
        if not signin_user['verified']:
            return Response(json.dumps({"Message": "User not yet verified, Please check your mail for verification link", "status": 401}), status=401)
        if bcrypt.checkpw(request.json['password'].encode('utf8'), signin_user["password"]):
            token = jwt.encode({
                'email': signin_user["email"],
                'firstName': signin_user["firstName"],
                'lastName': signin_user["lastName"],
                'exp': datetime.utcnow() + timedelta(minutes=30),
                'role': signin_user["role"],
                'verified': signin_user['verified']
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
            newtoken = jwt.encode({
                'email': signin_user["email"],
                'firstName': signin_user["firstName"],
                'lastName': signin_user["lastName"],
                'exp': datetime.utcnow() + timedelta(minutes=30),
                'role': signin_user["role"],
                'verified': signin_user['verified']
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
    
    # Disable email sending for testing with mock database
    if not MONGODB_AVAILABLE:
        print("Mock database mode: Email sending disabled for testing")
    else:
        sendenquirymail(request)
    
    return Response(json.dumps({"Message": "Enquiry submitted, Team will contact you soon", "status": 200}), status=200)


@app.route('/api/courseDetails', methods=['GET'])
@cross_origin()
def getCourseContent():
    courses = mongo.db.courses
    courseContent = courses.find_one({'courseid': request.args.get('courseid')}, {'_id': False})
    return Response(json.dumps({"Message": "Fetched content", "details": courseContent, "status": 200}), status=200)


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
    """List all quizzes"""
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "Access denied", "status": 403}), status=403)
    
    try:
        course_id = request.args.get('courseId')
        quizzes = mongo.db.quizzes
        
        query = {'isActive': True}
        if course_id:
            query['courseId'] = course_id
            
        quiz_list = list(quizzes.find(query, {'_id': False}))
        
        return Response(json.dumps({
            "Message": "Quizzes retrieved",
            "quizzes": quiz_list,
            "status": 200
        }), status=200)
        
    except Exception as e:
        return Response(json.dumps({"Message": f"Error listing quizzes: {str(e)}", "status": 500}), status=500)


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
