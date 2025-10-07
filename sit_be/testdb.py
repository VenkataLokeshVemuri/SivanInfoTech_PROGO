from flask import Flask, request
from pymongo import MongoClient

app = Flask(__name__)

# root route
@app.route('/')
def hello_world():
	return 'Hello, World!'

# Set up MongoDB connection and collection
client = MongoClient('mongodb://situser:sitadmin@localhost:27017/admin')

# Create database named demo if they don't exist already
db = client['admin']

# Create collection named data if it doesn't exist already
collection = db['data']

# Add data to MongoDB route
@app.route('/add_data', methods=['POST'])
def add_data():
	# Get data from request
	data = request.json

	# Insert data into MongoDB
	collection.insert_one(data)

	return 'Data added to MongoDB'


if __name__ == '__main__':
	app.run(host='0.0.0.0')

