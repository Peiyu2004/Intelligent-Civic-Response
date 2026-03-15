import sqlite3

DATABASE = r"C:\Users\Chan Jia Ying\Desktop\hackathon\admin2\civicscan-dashboard\backend\civic_response.db"


# ==========================
# Create connection
# ==========================
def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# ==========================
# Create tables
# ==========================
def init_db():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'citizen',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS report(
        report_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        cluster_id INTEGER,
        image_path TEXT,
        description TEXT,
        location TEXT,
        location_lat REAL,
        location_lon REAL,
        damage_type TEXT,
        severity_score REAL,
        report_status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(cluster_id) REFERENCES damage_cluster(cluster_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS damage_cluster(
        cluster_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cluster_area TEXT,
        center_lat REAL,
        center_lon REAL,
        total_report INTEGER,
        avg_severity REAL,
        priority_level INTEGER,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS work_orders(
        workorder_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cluster_id INTEGER,
        priority_level INTEGER,
        assigned_team TEXT,
        repair_status TEXT DEFAULT 'In Progress',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(cluster_id) REFERENCES damage_cluster(cluster_id)
    )
    """)

    conn.commit()
    conn.close()

    print("Database initialized.")


# ==========================
# Insert dummy data
# ==========================
def insert_dummy_data():

    conn = get_connection()
    cursor = conn.cursor()

    # Clear existing data so we can start fresh
    cursor.execute("DELETE FROM work_orders")
    cursor.execute("DELETE FROM report")
    cursor.execute("DELETE FROM damage_cluster")
    cursor.execute("DELETE FROM users")
    # Reset the auto-increment counters to 1
    cursor.execute("DELETE FROM sqlite_sequence WHERE name IN ('users', 'report', 'damage_cluster', 'work_orders')")

    # ----------------------
    # USERS
    # ----------------------
    users = [
        ("Ali Ahmad", "ali@example.com", "citizen"),
        ("Siti Nur", "siti@example.com", "citizen"),
        ("John Lee", "john@example.com", "citizen"),
        ("Aisyah Rahman", "aisyah@example.com", "citizen"),
        ("Admin Officer", "admin@gov.my", "admin")
    ]

    cursor.executemany(
        "INSERT INTO users(name,email,role) VALUES(?,?,?)", users
    )

    # ----------------------
    # REPORTS
    # ----------------------
    reports = [
        (1, "img/pothole1.jpg", "Large pothole near junction", "Jalan Tun Razak", 3.1390, 101.6869, "Pothole", 0.8, "Pending"),
        (2, "img/crack1.jpg", "Road crack spreading", "Jalan Ampang", 3.1578, 101.7110, "Crack", 0.6, "Pending"),
        (3, "img/pothole2.jpg", "Deep pothole after rain", "Jalan Cheras", 3.0567, 101.7250, "Pothole", 0.9, "Pending"),
        (4, "img/flood1.jpg", "Flooded road section", "Jalan Pudu", 3.1343, 101.7152, "Flood", 0.7, "Pending"),
        (5, "img/crack2.jpg", "Surface crack visible", "Jalan Bangsar", 3.1300, 101.6780, "Crack", 0.5, "Pending")
    ]

    cursor.executemany("""
    INSERT INTO report(
    user_id,image_path,description,location,
    location_lat,location_lon,damage_type,severity_score,report_status)
    VALUES(?,?,?,?,?,?,?,?,?)
    """, reports)

    # ----------------------
    # DAMAGE CLUSTERS
    # ----------------------
    clusters = [
        ("KL City Center", 3.1390, 101.6869, 3, 0.75, 1),
        ("Ampang Area", 3.1578, 101.7110, 2, 0.65, 2),
        ("Cheras Zone", 3.0567, 101.7250, 4, 0.80, 1),
        ("Pudu Sector", 3.1343, 101.7152, 1, 0.70, 2),
        ("Bangsar District", 3.1300, 101.6780, 2, 0.55, 3)
    ]

    cursor.executemany("""
    INSERT INTO damage_cluster(
    cluster_area,center_lat,center_lon,
    total_report,avg_severity,priority_level)
    VALUES(?,?,?,?,?,?)
    """, clusters)

    # ----------------------
    # WORK ORDERS
    # ----------------------
    work_orders = [
        (1, 1, "Road Repair Team A", "In Progress"),
        (2, 2, "Maintenance Crew B", "Pending"),
        (3, 1, "Emergency Repair Team", "In Progress"),
        (4, 2, "Drainage Team C", "Pending"),
        (5, 3, "Road Repair Team D", "Completed")
    ]

    cursor.executemany("""
    INSERT INTO work_orders(
    cluster_id,priority_level,assigned_team,repair_status)
    VALUES(?,?,?,?)
    """, work_orders)

    conn.commit()
    conn.close()

    print("Dummy data inserted.")


# ==========================
# Show tables
# ==========================
def show_data():

    conn = get_connection()
    cursor = conn.cursor()

    tables = ["users", "report", "damage_cluster", "work_orders"]

    for table in tables:
        print("\n", table.upper())
        rows = cursor.execute(f"SELECT * FROM {table}").fetchall()

        for row in rows:
            print(dict(row))

    conn.close()


# ==========================
# Run
# ==========================
if __name__ == "__main__":

    init_db()
    insert_dummy_data()
    show_data()