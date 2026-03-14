from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Dummy users for login
users = [
    {"username": "admin", "password": "123", "role": "admin"},
    {"username": "user", "password": "123", "role": "user"}
]

# -------------------------------
# LOGIN API
# -------------------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = next((u for u in users if u["username"] == username and u["password"] == password), None)
    if not user:
        return jsonify({"message": "Invalid login"}), 401
    return jsonify({"role": user["role"]})

# -------------------------------
# REPORT UPLOAD API
# -------------------------------
@app.route("/report", methods=["POST"])
def report_issue():
    if "image" not in request.files:
        return jsonify({"message": "No image uploaded"}), 400

    image = request.files["image"]
    description = request.form.get("description", "")

    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    # Call AI service if available
    try:
        from ai_service import analyze_damage
        ai_result = analyze_damage(filepath)
    except:
        ai_result = {"damage_type": "unknown", "severity_score": 0, "description": description}

    # Save to database (optional, requires database setup)
    # from database import get_connection
    # conn = get_connection()
    # conn.execute("INSERT INTO reports (...) VALUES (...)", (...))
    # conn.commit()
    # conn.close()

    return jsonify({
        "damage_type": ai_result["damage_type"],
        "severity_score": ai_result["severity_score"],
        "description": ai_result["description"]
    })

# -------------------------------
# DASHBOARD APIs
# -------------------------------
@app.route("/reports", methods=["GET"])
def get_reports():
    # Dummy data for now, replace with DB query
    reports = [
        {"id":1, "description":"Pothole", "severity_score":8},
        {"id":2, "description":"Crack", "severity_score":5}
    ]
    return jsonify(reports)

@app.route("/priority", methods=["GET"])
def get_priority():
    # Sort by severity descending
    reports = [
        {"id":1, "description":"Pothole", "severity_score":8},
        {"id":2, "description":"Crack", "severity_score":5}
    ]
    reports.sort(key=lambda r: r["severity_score"], reverse=True)
    return jsonify(reports)

# -------------------------------
# HEALTH CHECK
# -------------------------------
@app.route("/")
def home():
    return "Backend running"

# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)