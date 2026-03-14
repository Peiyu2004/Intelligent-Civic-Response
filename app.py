# ============================================================
# app.py — CiviScan Flask Backend
# Run:  python app.py
# Test: http://localhost:5000
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import json
from datetime import datetime
from pathlib import Path

# ── Import your AI classifier ──────────────────────────────
from ai_classifier import process_citizen_report, generate_work_order, validate_and_fix

# ── Import mock data for testing without API ───────────────
from mock_data import MOCK_REPORTS, get_all_mock_reports, get_cluster_coordinates

app = Flask(__name__)
CORS(app)  # Allow frontend (React/HTML) to call this API

# ── Config ─────────────────────────────────────────────────
UPLOAD_FOLDER = "uploads"
Path(UPLOAD_FOLDER).mkdir(exist_ok=True)

# In-memory store for submitted reports (replace with DB on production)
SUBMITTED_REPORTS = []

# ── Helper: generate unique report ID ──────────────────────
def make_report_id():
    return f"WO-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"


# ── Helper: cluster nearby reports ─────────────────────────
def cluster_reports(reports):
    """Group reports that are within ~1km of each other for route optimization"""
    try:
        import numpy as np
        from sklearn.cluster import DBSCAN

        if len(reports) < 2:
            return [{"cluster_id": 0, "reports": reports}]

        coords = []
        for r in reports:
            lat = r.get("lat") or r.get("ai_analysis", {}).get("lat", 0)
            lng = r.get("lng") or r.get("ai_analysis", {}).get("lng", 0)
            coords.append([float(lat), float(lng)])

        coords_np = np.radians(coords)
        # eps=0.015 radians ≈ ~1km radius
        db = DBSCAN(eps=0.015, min_samples=1, algorithm="ball_tree", metric="haversine").fit(coords_np)
        labels = db.labels_

        clusters = {}
        for i, label in enumerate(labels):
            key = int(label)
            if key not in clusters:
                clusters[key] = []
            clusters[key].append(reports[i])

        return [{"cluster_id": k, "report_count": len(v), "reports": v} for k, v in clusters.items()]

    except ImportError:
        # sklearn not installed — just return all as one cluster
        return [{"cluster_id": 0, "report_count": len(reports), "reports": reports}]


# ==============================================================
# ROUTES
# ==============================================================

# ── Health check ───────────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "system": "CiviScan — Intelligent Civic Response System",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "POST /analyze":         "Upload photo → get AI damage analysis + work order",
            "POST /analyze/mock":    "Test with mock data (no API key needed)",
            "GET  /reports":         "List all submitted reports",
            "GET  /reports/<id>":    "Get single report by ID",
            "GET  /reports/priority":"Get reports sorted by severity",
            "GET  /routes":          "Get optimized maintenance routes (clustered)",
            "GET  /mock/reports":    "Preview all 8 built-in mock scenarios",
            "GET  /stats":           "Dashboard stats"
        }
    })


# ── MAIN ENDPOINT: Analyze a real uploaded photo ───────────
@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Accepts a photo upload + location, returns AI analysis + work order.

    Form data:
        image    (file)   — the photo
        location (string) — e.g. "Jalan Bukit Jalil, KL"
        lat      (float)  — optional GPS latitude
        lng      (float)  — optional GPS longitude

    Returns: JSON with ai_analysis + work_order
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided. Send as form-data with key 'image'"}), 400

    image_file = request.files["image"]
    location   = request.form.get("location", "Unknown Location")
    lat        = request.form.get("lat", None)
    lng        = request.form.get("lng", None)

    if image_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save uploaded image temporarily
    ext         = Path(image_file.filename).suffix.lower() or ".jpg"
    temp_path   = os.path.join(UPLOAD_FOLDER, f"temp_{uuid.uuid4().hex}{ext}")
    image_file.save(temp_path)

    try:
        report_id = make_report_id()

        # ── Call your AI classifier ────────────────────────
        result = process_citizen_report(
            image_path=temp_path,
            location=location,
            report_id=report_id
        )

        # Attach GPS if provided
        if lat and lng:
            result["ai_analysis"]["lat"] = float(lat)
            result["ai_analysis"]["lng"] = float(lng)

        # Store in memory
        SUBMITTED_REPORTS.append({
            "report_id": report_id,
            "location":  location,
            "lat":       float(lat) if lat else None,
            "lng":       float(lng) if lng else None,
            "submitted_at": datetime.now().isoformat(),
            "ai_analysis": result["ai_analysis"],
            "work_order":  result["work_order"]
        })

        return jsonify({
            "success":    True,
            "report_id":  report_id,
            "ai_analysis": result["ai_analysis"],
            "work_order":  result["work_order"]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)


# ── MOCK ENDPOINT: Test without API key ───────────────────
@app.route("/analyze/mock", methods=["POST"])
def analyze_mock():
    """
    Simulates AI analysis using mock data. No API key needed.
    Rotates through 8 mock scenarios based on a 'scenario' parameter.

    Form data:
        scenario (int 1-8) — which mock scenario to return (default: random)
        location (string)  — override location label
    """
    import random

    scenario_index = request.form.get("scenario", None)
    location_override = request.form.get("location", None)

    if scenario_index is not None:
        idx = (int(scenario_index) - 1) % len(MOCK_REPORTS)
    else:
        idx = random.randint(0, len(MOCK_REPORTS) - 1)

    mock = MOCK_REPORTS[idx].copy()
    report_id = make_report_id()

    if location_override:
        mock["ai_analysis"]["location"] = location_override
        mock["location"] = location_override

    work_order = generate_work_order(mock["ai_analysis"], report_id)

    SUBMITTED_REPORTS.append({
        "report_id":    report_id,
        "location":     mock["location"],
        "lat":          mock.get("lat"),
        "lng":          mock.get("lng"),
        "submitted_at": datetime.now().isoformat(),
        "is_mock":      True,
        "ai_analysis":  mock["ai_analysis"],
        "work_order":   work_order
    })

    return jsonify({
        "success":     True,
        "mock":        True,
        "scenario":    idx + 1,
        "report_id":   report_id,
        "ai_analysis": mock["ai_analysis"],
        "work_order":  work_order
    }), 200


# ── GET all submitted reports ──────────────────────────────
@app.route("/reports", methods=["GET"])
def get_reports():
    """Returns all reports submitted this session, newest first."""
    sorted_reports = sorted(
        SUBMITTED_REPORTS,
        key=lambda r: r["ai_analysis"].get("severity_score", 0),
        reverse=True
    )
    return jsonify({
        "total": len(sorted_reports),
        "reports": sorted_reports
    })


# ── GET single report ──────────────────────────────────────
@app.route("/reports/<report_id>", methods=["GET"])
def get_report(report_id):
    for r in SUBMITTED_REPORTS:
        if r["report_id"] == report_id:
            return jsonify(r)
    return jsonify({"error": f"Report {report_id} not found"}), 404


# ── GET priority-sorted report list ───────────────────────
@app.route("/reports/priority", methods=["GET"])
def get_priority_reports():
    """Returns reports sorted by severity score descending (highest risk first)."""
    sorted_reports = sorted(
        SUBMITTED_REPORTS,
        key=lambda r: r["ai_analysis"].get("severity_score", 0),
        reverse=True
    )
    # Label each with rank
    for i, r in enumerate(sorted_reports):
        r["priority_rank"] = i + 1

    return jsonify({
        "total": len(sorted_reports),
        "sorted_by": "severity_score (highest first)",
        "reports": sorted_reports
    })


# ── GET optimized maintenance routes ──────────────────────
@app.route("/routes", methods=["GET"])
def get_routes():
    """
    Clusters nearby reports using DBSCAN and returns grouped routes.
    Repair crews can handle one cluster per trip instead of individual visits.
    """
    if not SUBMITTED_REPORTS:
        # Fall back to mock data for demo
        reports_to_cluster = MOCK_REPORTS
    else:
        reports_to_cluster = SUBMITTED_REPORTS

    clusters = cluster_reports(reports_to_cluster)

    # Sort clusters by max severity in each cluster
    for cluster in clusters:
        max_score = max(
            r.get("ai_analysis", r).get("severity_score", 0)
            if "ai_analysis" in r else r.get("severity_score", 0)
            for r in cluster["reports"]
        )
        cluster["max_severity"] = max_score

    clusters.sort(key=lambda c: c["max_severity"], reverse=True)

    return jsonify({
        "total_reports":  len(reports_to_cluster),
        "total_clusters": len(clusters),
        "note": "Each cluster = one optimized maintenance route",
        "routes": clusters
    })


# ── GET dashboard stats ────────────────────────────────────
@app.route("/stats", methods=["GET"])
def get_stats():
    """Returns summary stats for a dashboard."""
    reports = SUBMITTED_REPORTS if SUBMITTED_REPORTS else MOCK_REPORTS

    total = len(reports)
    urgency_counts = {"immediate": 0, "high": 0, "medium": 0, "low": 0}
    type_counts = {}

    for r in reports:
        a = r.get("ai_analysis", r)
        urgency = a.get("urgency", "low")
        dtype   = a.get("damage_type", "other")
        urgency_counts[urgency] = urgency_counts.get(urgency, 0) + 1
        type_counts[dtype]      = type_counts.get(dtype, 0) + 1

    avg_severity = (
        sum(r.get("ai_analysis", r).get("severity_score", 0) for r in reports) / total
        if total > 0 else 0
    )

    return jsonify({
        "total_reports":   total,
        "average_severity": round(avg_severity, 1),
        "by_urgency":      urgency_counts,
        "by_damage_type":  type_counts,
        "using_mock_data": len(SUBMITTED_REPORTS) == 0
    })


# ── GET raw mock scenarios (for frontend dev reference) ───
@app.route("/mock/reports", methods=["GET"])
def get_mock_reports():
    """Returns all 8 built-in mock scenarios. Useful for frontend development."""
    return jsonify({
        "total": len(MOCK_REPORTS),
        "note":  "These are pre-built scenarios for testing. Use POST /analyze/mock to submit one.",
        "scenarios": MOCK_REPORTS
    })


# ==============================================================
# RUN
# ==============================================================
if __name__ == "__main__":
    print("\n" + "=" * 55)
    print("🏙️  CiviScan — Intelligent Civic Response System")
    print("=" * 55)
    print("🚀 Server starting at http://localhost:5000")
    print("📋 Endpoints:")
    print("   POST /analyze          → Real AI analysis")
    print("   POST /analyze/mock     → Mock test (no API needed)")
    print("   GET  /reports          → All submitted reports")
    print("   GET  /reports/priority → Sorted by severity")
    print("   GET  /routes           → Optimized repair routes")
    print("   GET  /stats            → Dashboard stats")
    print("   GET  /mock/reports     → Preview mock scenarios")
    print("=" * 55 + "\n")

    app.run(debug=True, host="0.0.0.0", port=5000)
