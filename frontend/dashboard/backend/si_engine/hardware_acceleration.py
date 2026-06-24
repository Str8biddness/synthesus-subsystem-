import numpy as np
from numba import jit
import logging
from functools import lru_cache

@jit(nopython=True)
def fast_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9)

class HardwareAcceleration:
    def __init__(self):
        self.logger = logging.getLogger("si_engine.hardware")

    @lru_cache(maxsize=1024)
    def cached_process(self, query):
        return query.strip().lower()

    def profile_operation(self, func, *args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        self.logger.info(f"Operation {func.__name__} took {(end-start)*1000:.2f}ms")
        return result
