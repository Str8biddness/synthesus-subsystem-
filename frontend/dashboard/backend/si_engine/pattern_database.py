import psycopg2
from psycopg2.extras import RealDictCursor
import os
import logging

class PatternDatabase:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
        self.conn = None
        self.logger = logging.getLogger("si_engine.pattern_database")

    def connect(self):
        try:
            self.conn = psycopg2.connect(self.db_url, cursor_factory=RealDictCursor)
            self.conn.autocommit = True
            self.logger.info("Connected to PostgreSQL")
            return True
        except Exception as e:
            self.logger.error(f"Database connection failed: {e}")
            return False

    def get_patterns(self, domain=None):
        if not self.conn: return []
        with self.conn.cursor() as cur:
            if domain:
                cur.execute("SELECT * FROM patterns WHERE domain = %s", (domain,))
            else:
                cur.execute("SELECT * FROM patterns")
            return cur.fetchall()

    def add_pattern(self, pattern, response, domain=None):
        if not self.conn: return
        with self.conn.cursor() as cur:
            cur.execute(
                "INSERT INTO patterns (pattern, response, domain) VALUES (%s, %s, %s)",
                (pattern, response, domain)
            )
