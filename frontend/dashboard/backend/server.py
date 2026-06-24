from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from si_engine.synthetic_intelligence import SyntheticIntelligence

load_dotenv()

app = Flask(__name__)
CORS(app)

si = SyntheticIntelligence()

@app.route('/api/query', methods=['POST'])
def query_engine():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    query = data.get('query')
    session_id = data.get('session_id', 'default')
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
        
    result = si.process_query(query, session_id)
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "dsinn": si.dsinn.get_state()
    })

if __name__ == '__main__':
    # Try 5001 to avoid conflicts if 5000 is stubborn
    app.run(host='0.0.0.0', port=5001)
