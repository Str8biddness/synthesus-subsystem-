import logging
from functools import lru_cache

class PatternMatcher:
    def __init__(self, db, accelerator):
        self.db = db
        self.accelerator = accelerator
        self.logger = logging.getLogger("si_engine.matcher")

    @lru_cache(maxsize=1024)
    def match(self, query):
        patterns = self.db.get_patterns()
        best_match = None
        highest_score = 0
        
        for p in patterns:
            score = self.accelerator.calculate_similarity(query, p['pattern'])
            if score > highest_score:
                highest_score = score
                best_match = p
        
        if highest_score > 0.8:
            return best_match
        return None
