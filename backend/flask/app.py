from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

PORT = int(os.getenv("FLASK_PORT", 5002))  # Ensure different port

@app.route('/')
def home():
    return jsonify({"message": "Flask Backend is Running!"})

if __name__ == '__main__':
    app.run(debug=True, port=PORT)