import sqlite3

DATABASE = "civic_response.db"

# Create and return a database connection
def get_connection():
    """
    Create and return a database connection
    """
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize all database tables
def init_db():
    """
    Initialize all database tables
    """
    conn = get_connection()
    cursor = conn.cursor()

    # ========================
    # USERS TABLE
    # ========================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user(
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'citizen',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # =========================
    # REPORTS TABLE
    # =========================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS report(
        report_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        image_path TEXT,
        description TEXT,
        location TEXT,
        location_lat REAL,
        location_log REAL,
        damage_type TEXT,
        severity_score REAL,
        report_status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    )
    """)

    # =========================
    # DAMAGE CLUSTERS TABLE
    # =========================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS damage_cluster(
        cluster_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cluster_area TEXT,
        center_lat REAL,
        center_log REAL,
        total_report INTEGER DEFAULT 0,
        avg_severity REAL,
        priority_level INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
    
    # ========================
    # WORK ORDERS TABLE
    # ========================
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
    # save changes
    conn.commit()

    print("Database and tables created successfully!")
   
    # close connection
    conn.close()