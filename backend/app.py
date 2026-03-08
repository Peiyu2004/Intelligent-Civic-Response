from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Backend running"

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/report",methods=["POST"])
def report_issue():

    image = request.files["image"]
    description = request.form.get("description")

    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    return jsonify({
        "message": "Report received",
        "image_path": filepath,
        "description": description
    })

if __name__ == "__main__":
    app.run(debug=True)

from ai_service import analyze_damage

# connect ai
@app.route("/report", methods=["POST"])
def report_issue():

    image = request.files["image"]
    description = request.form.get("description")

    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    ai_result = analyze_damage(filepath)

    return jsonify({
        "damage_type": ai_result["damage_type"],
        "severity_score": ai_result["severity_score"],
        "description": ai_result["description"]
    })

# save reports to database
from database import get_connection

conn = get_connection()

conn.execute(
    "INSERT INTO reports (image_path, description, damage_type, severity_score) VALUES (?, ?, ?, ?)",
    (filepath, description, ai_result["damage_type"], ai_result["severity_score"])
)

conn.commit()
conn.close()

# create dashboard api
@app.route("/reports", methods=["GET"])
def get_reports():

    conn = get_connection()

    reports = conn.execute(
        "SELECT * FROM reports"
    ).fetchall()

    conn.close()

    return jsonify(reports)

# add priority logic
    @app.route("/priority", methods=["GET"])
    def get_priority():

        conn = get_connection()

        reports = conn.execute(
            "SELECT * FROM reports ORDER BY severity_score DESC"
        ).fetchall()

        conn.close()

        return jsonify(reports)
