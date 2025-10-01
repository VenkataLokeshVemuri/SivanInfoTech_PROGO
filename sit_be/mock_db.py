# Mock database implementation for testing
import json
from datetime import datetime
import uuid

# Try to import bcrypt for password hashing, use simple hash if not available
try:
    import bcrypt
    BCRYPT_AVAILABLE = True
except ImportError:
    BCRYPT_AVAILABLE = False
    import hashlib

class MockObjectId:
    def __init__(self):
        self.id = str(uuid.uuid4())
    
    def __str__(self):
        return self.id
    
    def __repr__(self):
        return f"ObjectId('{self.id}')"
    
    def __dict__(self):
        return self.id
    
    def __json__(self):
        return self.id

class MockDB:
    def __init__(self):
        self.data = {
            'users': [],
            'courses': [],
            'ads': [],
            'quiz': [],
            'quiz_results': [],
            'enrollments': [],
            'certificates': []
        }
        self._init_sample_data()
    
    def _init_sample_data(self):
        # Sample course data
        self.data['courses'] = [
            {
                '_id': str(MockObjectId()),
                'courseid': 'aws-basics',
                'title': 'AWS Fundamentals',
                'description': 'Learn AWS cloud computing basics',
                'technology': 'Cloud Computing',
                'duration': '4 weeks',
                'price': 2999,
                'syllabus': [
                    {'module': 'Introduction to AWS', 'duration': '1 week'},
                    {'module': 'EC2 and Storage', 'duration': '1 week'},
                    {'module': 'Networking and Security', 'duration': '1 week'},
                    {'module': 'Advanced Services', 'duration': '1 week'}
                ],
                'batches': [
                    {'batchid': 'aws-001', 'startDate': '2024-02-01', 'timing': '6 PM - 8 PM'},
                    {'batchid': 'aws-002', 'startDate': '2024-03-01', 'timing': '10 AM - 12 PM'}
                ]
            },
            {
                '_id': str(MockObjectId()),
                'courseid': 'python-fullstack',
                'title': 'Python Full Stack Development',
                'description': 'Complete Python web development course',
                'technology': 'Python',
                'duration': '6 weeks',
                'price': 4999,
                'syllabus': [
                    {'module': 'Python Basics', 'duration': '1 week'},
                    {'module': 'Django Framework', 'duration': '2 weeks'},
                    {'module': 'Frontend Integration', 'duration': '2 weeks'},
                    {'module': 'Deployment', 'duration': '1 week'}
                ],
                'batches': [
                    {'batchid': 'py-001', 'startDate': '2024-02-15', 'timing': '7 PM - 9 PM'}
                ]
            }
        ]
        
        # Sample users data (for testing)
        if BCRYPT_AVAILABLE:
            admin_password = bcrypt.hashpw("admin123".encode('utf8'), bcrypt.gensalt())
        else:
            # Fallback hash for testing
            admin_password = hashlib.sha256("admin123".encode('utf8')).hexdigest().encode('utf8')
        
        self.data['users'] = [
            {
                '_id': str(MockObjectId()),
                'firstName': 'Admin',
                'lastName': 'User',
                'email': 'admin@sitcloud.in',
                'password': admin_password,
                'role': 'ADMIN',
                'phone': '9999999999',
                'verified': True,
                'isFromCollege': False,
                'collegeName': '',
                'registered_on': datetime.utcnow().isoformat(),
                'loginToken': ''
            }
        ]
        
        # Sample ads data
        self.data['ads'] = [
            {
                '_id': str(MockObjectId()),
                'adsType': 'flashadd',
                'flashadslist': [
                    {
                        'title': 'Special Offer',
                        'description': '50% off on all courses',
                        'image': '/images/offer.jpg'
                    },
                    {
                        'title': 'New Batch Starting',
                        'description': 'AWS certification batch starts soon',
                        'image': '/images/aws-batch.jpg'
                    }
                ],
                'uploaded_on': datetime.utcnow().isoformat()
            }
        ]
        
        # Sample quiz data
        self.data['quiz'] = [
            {
                '_id': str(MockObjectId()),
                'quizid': 'aws-quiz-1',
                'courseid': 'aws-basics',
                'title': 'AWS Basics Quiz',
                'questions': [
                    {
                        'question': 'What does AWS stand for?',
                        'options': ['Amazon Web Services', 'Amazon World Services', 'Amazon Wide Services', 'Amazon Web Systems'],
                        'correct_answer': 0
                    },
                    {
                        'question': 'Which service is used for object storage?',
                        'options': ['EC2', 'S3', 'RDS', 'Lambda'],
                        'correct_answer': 1
                    }
                ],
                'duration': 30,
                'active': True
            }
        ]
        
        # Initialize other collections
        self.data['quizzes'] = []
        self.data['questions'] = []
        self.data['quiz_assignments'] = []
        self.data['attempts'] = []
        self.data['result_logs'] = []
        self.data['coursedoc'] = []

class MockCollection:
    def __init__(self, db, collection_name):
        self.db = db
        self.collection_name = collection_name
    
    def find(self, query=None, projection=None):
        data = self.db.data.get(self.collection_name, [])
        if query is None:
            return MockCursor(data)
        
        # Simple query matching
        filtered_data = []
        for item in data:
            if self._matches_query(item, query):
                filtered_data.append(item)
        return MockCursor(filtered_data)
    
    def find_one(self, query=None, projection=None):
        cursor = self.find(query, projection)
        try:
            return next(iter(cursor))
        except StopIteration:
            return None
    
    def insert_one(self, document):
        if '_id' not in document:
            document['_id'] = str(MockObjectId())
        document['created_at'] = datetime.utcnow()
        self.db.data[self.collection_name].append(document)
        return MockInsertResult(document['_id'])
    
    def insert_many(self, documents):
        inserted_ids = []
        for doc in documents:
            result = self.insert_one(doc)
            inserted_ids.append(result.inserted_id)
        return MockInsertManyResult(inserted_ids)
    
    def update_one(self, query, update):
        data = self.db.data.get(self.collection_name, [])
        for item in data:
            if self._matches_query(item, query):
                if '$set' in update:
                    item.update(update['$set'])
                item['updated_at'] = datetime.utcnow()
                return MockUpdateResult(1, 1)
        return MockUpdateResult(0, 0)
    
    def delete_one(self, query):
        data = self.db.data.get(self.collection_name, [])
        for i, item in enumerate(data):
            if self._matches_query(item, query):
                del data[i]
                return MockDeleteResult(1)
        return MockDeleteResult(0)
    
    def count_documents(self, query=None):
        return len(list(self.find(query)))
    
    def aggregate(self, pipeline):
        # Simple aggregation support
        data = self.db.data.get(self.collection_name, [])
        return MockCursor(data)
    
    def _matches_query(self, item, query):
        if not query:
            return True
        
        for key, value in query.items():
            if key not in item:
                return False
            if item[key] != value:
                return False
        return True

class MockCursor:
    def __init__(self, data):
        self.data = data
        self.index = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.index >= len(self.data):
            raise StopIteration
        result = self.data[self.index]
        self.index += 1
        return result
    
    def limit(self, count):
        self.data = self.data[:count]
        return self
    
    def sort(self, key, direction=1):
        if isinstance(key, str):
            self.data.sort(key=lambda x: x.get(key, ''), reverse=(direction == -1))
        return self

class MockInsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id

class MockInsertManyResult:
    def __init__(self, inserted_ids):
        self.inserted_ids = inserted_ids

class MockUpdateResult:
    def __init__(self, matched_count, modified_count):
        self.matched_count = matched_count
        self.modified_count = modified_count

class MockDeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count

class MockMongo:
    def __init__(self):
        self.mock_db = MockDB()
        self.db = self
    
    def __getattr__(self, name):
        return MockCollection(self.mock_db, name)

# Global mock instance
mock_mongo = MockMongo()