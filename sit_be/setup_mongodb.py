#!/usr/bin/env python3
"""
MongoDB Setup Script for SivanInfoTech Backend
This script sets up the local MongoDB database with sample data for testing
"""

import pymongo
from datetime import datetime
import bcrypt
import pytz

# MongoDB connection
try:
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client.sivaninfo_db
    print("Connected to MongoDB successfully!")
    
    # Test connection
    db.list_collection_names()
    
    tz_NY = pytz.timezone('Asia/Kolkata')
    
    # Create admin user
    users = db.users
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
        print("✅ Admin user created: admin@sitcloud.in / admin123")
    else:
        print("✅ Admin user already exists")
    
    # Create sample student user
    student_user = users.find_one({'email': 'student@test.com'})
    if not student_user:
        hashed_password = bcrypt.hashpw('student123'.encode('utf8'), bcrypt.gensalt())
        student_doc = {
            'firstName': 'Test',
            'lastName': 'Student',
            'password': hashed_password,
            'email': 'student@test.com',
            'role': 'STUDENT',
            'phone': '8888888888',
            'verified': True,
            'isFromCollege': True,
            'collegeName': 'Test University',
            'registered_on': str(datetime.now(tz_NY)),
            'loginToken': '',
            'enrollments': []
        }
        users.insert_one(student_doc)
        print("✅ Test student created: student@test.com / student123")
    else:
        print("✅ Test student already exists")
    
    # Create sample courses
    courses = db.courses
    sample_courses = [
        {
            'courseid': 'AWS-001',
            'title': 'AWS Solutions Architect Associate',
            'description': 'Complete AWS certification training with hands-on labs',
            'duration': '60 days',
            'price': 15000,
            'category': 'Cloud Computing',
            'level': 'Intermediate',
            'batches': [
                {
                    'batchId': 'AWS001-B1',
                    'startdate': '2025-11-01',
                    'enddate': '2025-12-30',
                    'timing': '10:00 AM - 12:00 PM',
                    'mode': 'Online',
                    'instructor': 'AWS Expert',
                    'capacity': 30,
                    'enrolled': 0
                },
                {
                    'batchId': 'AWS001-B2',
                    'startdate': '2025-11-15',
                    'enddate': '2026-01-15',
                    'timing': '2:00 PM - 4:00 PM',
                    'mode': 'Hybrid',
                    'instructor': 'Cloud Architect',
                    'capacity': 25,
                    'enrolled': 0
                }
            ]
        },
        {
            'courseid': 'AZURE-001',
            'title': 'Azure Fundamentals AZ-900',
            'description': 'Microsoft Azure fundamentals certification preparation',
            'duration': '30 days',
            'price': 10000,
            'category': 'Cloud Computing',
            'level': 'Beginner',
            'batches': [
                {
                    'batchId': 'AZ900-B1',
                    'startdate': '2025-11-10',
                    'enddate': '2025-12-10',
                    'timing': '6:00 PM - 8:00 PM',
                    'mode': 'Online',
                    'instructor': 'Azure Specialist',
                    'capacity': 40,
                    'enrolled': 0
                }
            ]
        },
        {
            'courseid': 'GCP-001',
            'title': 'Google Cloud Platform Fundamentals',
            'description': 'GCP core services and architecture training',
            'duration': '45 days',
            'price': 12000,
            'category': 'Cloud Computing',
            'level': 'Intermediate',
            'batches': [
                {
                    'batchId': 'GCP001-B1',
                    'startdate': '2025-12-01',
                    'enddate': '2026-01-15',
                    'timing': '4:00 PM - 6:00 PM',
                    'mode': 'Online',
                    'instructor': 'GCP Expert',
                    'capacity': 35,
                    'enrolled': 0
                }
            ]
        },
        {
            'courseid': 'DEVOPS-001',
            'title': 'DevOps Engineering Bootcamp',
            'description': 'Complete DevOps pipeline with Docker, Kubernetes, Jenkins',
            'duration': '90 days',
            'price': 20000,
            'category': 'DevOps',
            'level': 'Advanced',
            'batches': [
                {
                    'batchId': 'DEVOPS001-B1',
                    'startdate': '2025-11-20',
                    'enddate': '2026-02-20',
                    'timing': '7:00 PM - 9:00 PM',
                    'mode': 'Hybrid',
                    'instructor': 'DevOps Engineer',
                    'capacity': 20,
                    'enrolled': 0
                }
            ]
        }
    ]
    
    for course in sample_courses:
        existing_course = courses.find_one({'courseid': course['courseid']})
        if not existing_course:
            courses.insert_one(course)
            print(f"✅ Course created: {course['title']}")
        else:
            print(f"✅ Course already exists: {course['title']}")
    
    # Create sample ads
    ads = db.ads
    sample_ad = ads.find_one({"adsType": "flashadd"})
    if not sample_ad:
        ad_doc = {
            "flashadslist": [
                "🚀 New AWS Batch Starting Nov 1st - Early Bird Discount!",
                "🎓 Azure Fundamentals - Weekend Batch Available",
                "💼 100% Placement Assistance for All Courses",
                "⭐ 4.9/5 Rating - Join 5000+ Successful Students"
            ],
            "adsType": "flashadd",
            "uploaded_on": str(datetime.now(tz_NY))
        }
        ads.insert_one(ad_doc)
        print("✅ Sample flash ads created")
    else:
        print("✅ Flash ads already exist")
    
    print("\n🎉 MongoDB setup completed successfully!")
    print("\n📊 Database Summary:")
    print(f"- Users: {users.count_documents({})}")
    print(f"- Courses: {courses.count_documents({})}")
    print(f"- Ads: {ads.count_documents({})}")
    
    print("\n🔑 Login Credentials:")
    print("Admin: admin@sitcloud.in / admin123")
    print("Student: student@test.com / student123")
    
    print("\n🌐 Connect to MongoDB Compass:")
    print("Connection String: mongodb://localhost:27017/")
    print("Database Name: sivaninfo_db")
    
except Exception as e:
    print(f"❌ MongoDB setup failed: {e}")
    print("Please ensure MongoDB is running on localhost:27017")