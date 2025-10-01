#!/usr/bin/env python3
"""
Test script to verify all backend endpoints without requiring MongoDB
"""

import requests
import json
import time
from datetime import datetime

# Base URL for the Flask backend
BASE_URL = "http://127.0.0.1:5000/api"

def test_endpoint(method, endpoint, data=None, headers=None, expected_status=None):
    """Test a single endpoint and return the response"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            print(f"❌ Unsupported method: {method}")
            return None
            
        status_code = response.status_code
        status_icon = "✅" if (expected_status is None or status_code == expected_status) else "❌"
        
        print(f"{status_icon} {method} {endpoint} - Status: {status_code}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            try:
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
            except:
                print(f"   Response: {response.text[:200]}...")
        else:
            print(f"   Response: {response.text[:200]}...")
            
        return response
        
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {endpoint} - CONNECTION ERROR: Backend not running")
        return None
    except Exception as e:
        print(f"❌ {method} {endpoint} - ERROR: {str(e)}")
        return None

def main():
    print("🚀 Testing Backend API Endpoints")
    print("=" * 50)
    
    # Test 1: Basic endpoints that don't require authentication or database
    print("\n📋 Testing Basic Endpoints (No Auth Required)")
    print("-" * 30)
    
    # These should work even without MongoDB if they have proper error handling
    test_endpoint("GET", "/getflashads", expected_status=500)  # Will fail due to MongoDB but should return error
    test_endpoint("POST", "/enquiry", {"name": "Test", "email": "test@example.com", "message": "Test"})
    test_endpoint("GET", "/getCourseAndBatchDetails")
    
    # Test 2: Authentication endpoints
    print("\n🔐 Testing Authentication Endpoints")
    print("-" * 30)
    
    # Test signup
    signup_data = {
        "firstName": "Test",
        "lastName": "User", 
        "email": "testuser@example.com",
        "password": "testpass123",
        "phone": "1234567890",
        "isfromcollege": False,
        "collagename": ""
    }
    signup_response = test_endpoint("POST", "/signup", signup_data)
    
    # Test signin (will fail since user doesn't exist in DB)
    signin_data = {
        "email": "testuser@example.com",
        "password": "testpass123"
    }
    signin_response = test_endpoint("POST", "/signin", signin_data)
    
    # Test 3: Course endpoints
    print("\n📚 Testing Course Endpoints")
    print("-" * 30)
    
    test_endpoint("GET", "/courseDetails?courseid=test")
    
    # Test 4: Certificate endpoints
    print("\n🏆 Testing Certificate Endpoints")
    print("-" * 30)
    
    cert_data = {
        "enrollmentID": "TEST123",
        "certificateID": "CERT123"
    }
    test_endpoint("POST", "/verifyCert", cert_data)
    
    # Test 5: Payment endpoints
    print("\n💰 Testing Payment Endpoints")
    print("-" * 30)
    
    payment_data = {
        "amount": 1000,
        "merchantTransactionId": "TEST123",
        "merchantUserId": "USER123"
    }
    test_endpoint("POST", "/initiate-payment", payment_data)
    
    # Test 6: Admin endpoints (will fail due to no auth token)
    print("\n👑 Testing Admin Endpoints (No Auth)")
    print("-" * 30)
    
    test_endpoint("GET", "/studentsList")
    test_endpoint("GET", "/courselist")
    test_endpoint("GET", "/admin/quizzes")
    
    print("\n" + "=" * 50)
    print("✅ Endpoint testing completed!")
    print("Note: Many endpoints will fail due to missing MongoDB connection.")
    print("This test verifies that the Flask server is running and endpoints are accessible.")

if __name__ == "__main__":
    main()