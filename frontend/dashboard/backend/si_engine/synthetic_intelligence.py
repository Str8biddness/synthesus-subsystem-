import logging
import os
from .pattern_database import PatternDatabase
from .dsinn_consciousness import DSINNConsciousness
from .hardware_acceleration import HardwareAcceleration
from .pattern_matcher import PatternMatcher
from .quasi_reasoning_engine import QuasiReasoningEngine
from .pattern_learner import PatternLearner
from .synthetic_language_generator import SyntheticLanguageGenerator
from .emergent_reasoning import EmergentReasoning
from .world_modeling_engine import WorldModelingEngine
from .self_modeling_engine import SelfModelingEngine

class SyntheticIntelligence:
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("si_engine.main")
        
        try:
            self.db = PatternDatabase()
            self.dsinn = DSINNConsciousness()
            self.accelerator = HardwareAcceleration()
            
            # Modules
            self.matcher = PatternMatcher(self.db, self.accelerator)
            self.reasoner = QuasiReasoningEngine()
            self.learner = PatternLearner(self.db)
            self.generator = SyntheticLanguageGenerator()
            self.emergent = EmergentReasoning()
            self.world = WorldModelingEngine()
            self.self_model = SelfModelingEngine()
            self.web = WebAccess()
            
            self.logger.info("SI Engine Initialized Successfully")
        except Exception as e:
            self.logger.error(f"Module initialization failure: {e}")
            raise e

    def process_query(self, query, session_id):
        try:
            # 1. Pattern Matching
            pattern = self.matcher.match(query)
            if pattern:
                response = pattern['response']
                confidence = 0.95
                trace = ["Pattern matched from database."]
            else:
                # 2. Quasi-Reasoning
                response, trace = self.reasoner.reason(query)
                confidence = 0.75

            # 3. Post-processing
            self.dsinn.update(query, response)
            self.learner.learn(query, response)
            
            return {
                "response": response,
                "meta": {
                    "confidence": confidence,
                    "dsinn": self.dsinn.get_state(),
                    "trace": trace
                }
            }
        except Exception as e:
            self.logger.error(f"Execution error: {e}")
            return {"error": str(e), "response": "The engine encountered an internal state anomaly."}

class WebAccess:
    def __init__(self):
        self.enabled = os.getenv("WEB_ACCESS_ENABLED") == "true"
