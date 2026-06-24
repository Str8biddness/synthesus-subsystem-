import requests
import os
import logging

class WebAccess:
    def __init__(self):
        self.enabled = os.getenv("WEB_ACCESS_ENABLED") == "true"
        self.logger = logging.getLogger("si_engine.web")

    def search(self, query):
        if not self.enabled:
            return "Web access is disabled."
        return f"Web result for: {query} (Mocked)"
