import sqlite3

DATABASE = "reports.db"

def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def create_table():
    conn = get_connection()

    conn.execute("""
    CREATE TABLE IF NOT EXISTS reports(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_path TEXT,
        description TEXT,
        damage_type TEXT,
        severity_score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
        """)

    conn.commit()
    conn.close()