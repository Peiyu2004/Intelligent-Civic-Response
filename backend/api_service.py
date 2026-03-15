# ============================================================
# CiviScan Flask Backend
# Run:  python app.py
# Test: http://127.0.0.1:5000
# ============================================================

from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS
from math import radians, cos, sin, asin, sqrt
import os
from werkzeug.utils import secure_filename
# from ai_classifier import process_citizen_report


DATABASE = r"C:\Users\Chan Jia Ying\Desktop\hackathon\admin2\civicscan-dashboard\backend\civic_response.db"
 
app = Flask(__name__)
CORS(app)  # allow requests from React / other frontend


 # Configure where to save images
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create the folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
 
 
# ==========================
# Database connection
# ==========================
def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn
 
 
# ==========================
# Home
# ==========================
@app.route("/")
def home():
    return "API Server Running"
 
 
# ==========================
# GET users
# ==========================
@app.route("/api/users", methods=["GET"])
def get_users():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])
 
 
# ==========================
# GET all reports
# ==========================
@app.route("/api/reports", methods=["GET"])
def get_reports():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM report").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])
 
 
# ==========================
# GET single report
# ==========================
@app.route("/api/report/<int:report_id>", methods=["GET"])
def get_report(report_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM report WHERE report_id = ?", (report_id,)).fetchone()
    conn.close()
    if row:
        return jsonify(dict(row))
    else:
        return jsonify({"error": "Report not found"}), 404
 

# ==========================
# Upload image from file
# ==========================
# @app.route("/api/upload", methods=["POST"])
# def upload_and_analyze():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400
    
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     # Get metadata from the form (React/Postman)
#     user_id = request.form.get("user_id", 1)
#     location_name = request.form.get("location", "Kuala Lumpur, Malaysia")
#     lat = request.form.get("location_lat")
#     lon = request.form.get("location_lon")

#     if file:
#         filename = secure_filename(file.filename)
#         save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(save_path)

#         try:
#             # 1. RUN THE FLEXTOKEN AI
#             # This calls the complex logic you wrote in ai_classifier.py
#             ai_results = process_citizen_report(save_path, location_name)
            
#             # Extract the cleaned data from your AI's response
#             analysis = ai_results["ai_analysis"]
            
#             # 2. SAVE TO DATABASE IMMEDIATELY
#             # This ensures the report shows up in your GET /api/reports list
#             conn = get_connection()
#             cursor = conn.cursor()
#             cursor.execute("""
#                 INSERT INTO report(
#                     user_id, image_path, description, location,
#                     location_lat, location_lon,
#                     damage_type, severity_score, report_status
#                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
#             """, (
#                 user_id, 
#                 f"uploads/{filename}", 
#                 analysis["description"], 
#                 location_name,
#                 lat, 
#                 lon,
#                 analysis["damage_type"], 
#                 analysis["severity_score"], 
#                 "Pending"
#             ))
#             conn.commit()
#             new_report_id = cursor.lastrowid
#             conn.close()

#             # 3. RETURN DATA TO FRONTEND
#             return jsonify({
#                 "status": "success",
#                 "message": "AI Analysis complete and report saved!",
#                 "report_id": new_report_id,
#                 "ai_analysis": analysis,
#                 "work_order": ai_results["work_order"],
#                 "image_path": f"uploads/{filename}"
#             }), 201

#         except Exception as e:
#             print(f"API Down, providing fallback for {filename}")
#             # Return a fake successful response so React doesn't show an error
#             return jsonify({
#                 "status": "Success",
#                 "report_id": 999, 
#                 "ai_analysis": {
#                     "damage_type": "pothole",
#                     "severity_score": 5,
#                     "description": "Local assessment: Pothole detected."
#                     },
#                     "image_path": f"uploads/{filename}"
#                     }), 201


@app.route("/api/upload", methods=["POST"])
def upload_file():
    # Print to terminal so you can see if ANY files arrived
    print(f"Files in request: {request.files.keys()}")

    # Check for the key 'file' OR just grab the first file found
    if 'file' not in request.files:
        if len(request.files) > 0:
            # Fallback: grab the first file if the key isn't named 'file'
            file = request.files[list(request.files.keys())[0]]
        else:
            return jsonify({"error": "No file part in the request"}), 400
    else:
        file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    return jsonify({"image_path": f"uploads/{filename}"}), 200

 
# ==========================
# CREATE new report
# ==========================
@app.route("/api/report", methods=["POST"])
def create_report():
    data = request.get_json()
    if not data or not data.get("description") or not data.get("location"):
        return jsonify({"error": "description and location are required"}), 400
 
    user_id = data.get("user_id", 1)
    description = data["description"]
    location = data["location"]
    image_path = data.get("image_path", "uploads/default.jpg")
    damage_type = data.get("damage_type", "Unknown")
    severity_score = data.get("severity_score", 0.0)
    report_status = data.get("report_status", "Pending")
 
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO report(
            user_id, image_path, description, location,
            damage_type, severity_score, report_status
        ) VALUES (?,?,?,?,?,?,?)
    """, (user_id, image_path, description, location, damage_type, severity_score, report_status))
    conn.commit()
    report_id = cursor.lastrowid
    conn.close()
 
    return jsonify({"message": "Report created", "report_id": report_id}), 201
 
 
# # ==========================
# # UPDATE report
# # ==========================
# @app.route("/api/report/<int:report_id>", methods=["PUT", "PATCH"])
# def edit_report(report_id):
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400
 
#     fields = ["description", "location", "image_path", "damage_type", "severity_score", "report_status"]
#     updates = {k: data[k] for k in fields if k in data}
 
#     if not updates:
#         return jsonify({"error": "No fields to update"}), 400
 
#     conn = get_connection()
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM report WHERE report_id = ?", (report_id,))
#     if not cursor.fetchone():
#         conn.close()
#         return jsonify({"error": "Report not found"}), 404
 
#     set_clause = ", ".join([f"{k}=?" for k in updates.keys()])
#     values = list(updates.values())
#     values.append(report_id)
#     cursor.execute(f"UPDATE report SET {set_clause} WHERE report_id = ?", values)
#     conn.commit()
#     conn.close()
 
#     return jsonify({"message": f"Report {report_id} updated", "updated_fields": updates})
 

 # ==========================
# UPDATE report
# ==========================
@app.route("/api/report/<int:report_id>", methods=["PUT", "PATCH"])
def edit_report(report_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
 
    fields = ["description", "location", "image_path", "damage_type", "severity_score", "report_status"]
    updates = {k: data[k] for k in fields if k in data}
 
    if not updates:
        return jsonify({"error": "No fields to update"}), 400
 
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM report WHERE report_id = ?", (report_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({"error": "Report not found"}), 404
 
    set_clause = ", ".join([f"{k}=?" for k in updates.keys()])
    values = list(updates.values())
    values.append(report_id)
    cursor.execute(f"UPDATE report SET {set_clause} WHERE report_id = ?", values)
    conn.commit()
    
    # ✅ FETCH THE UPDATED REPORT AND RETURN IT
    updated_row = cursor.execute("SELECT * FROM report WHERE report_id = ?", (report_id,)).fetchone()
    conn.close()
    
    # Return the complete updated report
    return jsonify(dict(updated_row)), 200
 
# ==========================
# DELETE report
# ==========================
@app.route("/api/report/<int:report_id>", methods=["DELETE"])
def delete_report(report_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM report WHERE report_id = ?", (report_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({"error": "Report not found"}), 404
 
    cursor.execute("DELETE FROM report WHERE report_id = ?", (report_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Report {report_id} deleted"})
 
 
# ==========================
# GET clusters
# ==========================
@app.route("/api/clusters", methods=["GET"])
def get_clusters():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM damage_cluster").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])
 

 # Helper function to calculate distance between two lat/lng points (km)
def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    km = 6371 * c
    return km


# ===================================
# Cluster nearby reports (new route)
# ===================================
@app.route("/api/clustered-reports", methods=["GET"])
def get_clustered_reports():
    conn = get_connection()
    
    # 1. Fetch valid reports from DB
    reports = conn.execute(
        "SELECT report_id, location_lat, location_lon, severity_score, description, image_path FROM report WHERE location_lat IS NOT NULL"
    ).fetchall()

    if not reports:
        conn.close()
        return jsonify([])

    clusters = []
    threshold_km = 1.0  

    # 2. Perform clustering logic in memory
    for r in reports:
        try:
            lat = float(r["location_lat"])
            lon = float(r["location_lon"])
            sev = float(r["severity_score"]) if r["severity_score"] else 0.0
            
            added_to_cluster = False
            for cluster in clusters:
                dist = haversine(lat, lon, cluster["center_lat"], cluster["center_lon"])
                if dist <= threshold_km:
                    cluster["reports"].append(dict(r))
                    # Update averages
                    n = len(cluster["reports"])
                    cluster["center_lat"] = sum(rep["location_lat"] for rep in cluster["reports"]) / n
                    cluster["center_lon"] = sum(rep["location_lon"] for rep in cluster["reports"]) / n
                    cluster["avg_severity"] = sum(rep["severity_score"] for rep in cluster["reports"]) / n
                    added_to_cluster = True
                    break

            if not added_to_cluster:
                clusters.append({
                    "center_lat": lat,
                    "center_lon": lon,
                    "avg_severity": sev,
                    "reports": [dict(r)]
                })
        except Exception as e:
            continue

    # 3. SAVE TO DATABASE & LINK
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM damage_cluster")
        # Reset links before re-assigning
        cursor.execute("UPDATE report SET cluster_id = NULL")
        
        for cluster in clusters:
            priority = 1 if cluster["avg_severity"] > 0.7 else 2
            
            cursor.execute("""
                INSERT INTO damage_cluster (center_lat, center_lon, avg_severity, total_report, priority_level)
                VALUES (?, ?, ?, ?, ?)
            """, (cluster["center_lat"], cluster["center_lon"], cluster["avg_severity"], len(cluster["reports"]), priority))
            
            new_id = cursor.lastrowid
            cluster["cluster_id"] = new_id # Add ID to the response
            
            # Link reports in DB
            report_ids = [rep["report_id"] for rep in cluster["reports"]]
            placeholders = ','.join(['?'] * len(report_ids))
            cursor.execute(f"UPDATE report SET cluster_id = ? WHERE report_id IN ({placeholders})", [new_id] + report_ids)
        
        conn.commit()
    except Exception as e:
        print(f"Sync Error: {e}")
        conn.rollback()
    finally:
        conn.close()

    return jsonify(clusters)


# ==========================
# GET work orders
# ==========================
@app.route("/api/workorders", methods=["GET"])
def get_workorders():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM work_orders").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# =============================
# Create work order for cluster
# =============================
@app.route("/api/work-orders", methods=["POST"])
def create_work_order():
    data = request.json
    
    # Extract data from the incoming request
    cluster_id = data.get("cluster_id")
    assigned_team = data.get("team")
    
    # Use your existing connection helper
    conn = get_connection() 
    cursor = conn.cursor()

    try:
        # 1. Insert the new work order
        cursor.execute(
            """
            INSERT INTO work_orders (cluster_id, assigned_team, repair_status)
            VALUES (?, ?, ?)
            """,
            (cluster_id, assigned_team, "Pending")
        )

        conn.commit()
        return jsonify({
            "repair_status": "Completed",
            "message": f"Work order created for Cluster {cluster_id}",
            "assigned_team": assigned_team
        }), 201

    except Exception as e:
        conn.rollback()
        print(f"Error creating work order: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
        
    finally:
        conn.close()


# ========================
# Update work order status
# ========================
@app.route("/api/work-orders/update-status", methods=["PUT", "POST"])
def update_work_order_status():
    data = request.json
    workorder_id = data.get("workorder_id")
    new_status = data.get("repair_status") # e.g., "in_progress", "completed"

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # We ONLY update the work_orders table here
        cursor.execute(
            """
            UPDATE work_orders 
            SET repair_status = ? 
            WHERE workorder_id = ?
            """,
            (new_status, workorder_id)
        )
        
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"repair_status": "error", "message": "Work order not found"}), 404

        return jsonify({
            "repair_status": "Completed", 
            "message": f"Work order {workorder_id} updated to {new_status}"
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"repair_status": "error", "message": str(e)}), 500
    finally:
        conn.close()


# ==================
# Status Transition
# ==================
@app.route("/api/work-orders/complete/<int:workorder_id>", methods=["POST"])
def complete_work_order(workorder_id):
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Find the cluster_id associated with this work order
        row = cursor.execute("SELECT cluster_id FROM work_orders WHERE workorder_id = ?", (workorder_id,)).fetchone()
        if not row:
            return jsonify({"error": "Work order not found"}), 404
        
        cluster_id = row['cluster_id']

        # 2. Update Work Order status
        cursor.execute("UPDATE work_orders SET repair_status = 'Completed' WHERE workorder_id = ?", (workorder_id,))
        
        # 3. Update the Cluster status
        cursor.execute("UPDATE damage_cluster SET status = 'Repaired' WHERE cluster_id = ?", (cluster_id,))
        
        # 4. Update ALL Reports in that cluster to 'Fixed'
        cursor.execute("UPDATE report SET report_status = 'Fixed' WHERE cluster_id = ?", (cluster_id,))
        
        conn.commit()
        return jsonify({"message": f"Work order {workorder_id} and all related reports marked as Fixed!"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
 

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

        # HARD-CODED ADMIN
    if username == "admin" and password == "admin123":
        return jsonify({
            "username": "admin",
            "role": "admin"
        })

    for user in users:
        if user["username"] == username and user["password"] == password:
            return jsonify({
                "username": username,
                "role": user["role"]
            })

    return jsonify({"message": "Invalid credentials"}), 401

# ==========================
# Run server
# ==========================
if __name__ == "__main__":
    app.run(debug=True)