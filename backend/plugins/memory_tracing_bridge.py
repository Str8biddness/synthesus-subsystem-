import os
import sys
import asyncio
import time
from typing import AsyncGenerator, Dict, Any

# Inject paths to Synthesus-Ultra components so they can be imported
sys.path.insert(0, "/home/dakin/synthesus-ultra/packages/kernel")
sys.path.insert(0, "/home/dakin/synthesus-ultra/packages/core")

try:
    from bridge import KernelBridge, BridgeMode, KernelQuery
    from reasoning_tracer import get_tracer, Hemisphere, TraceEventType
except ImportError as e:
    raise ImportError(f"Failed to import core synthesus components. Ensure paths are correct. {e}")

class MemoryTracingBridge:
    """
    Bridge connecting the Hybrid SGI 4-layer memory hierarchy and the
    Quadbrain Reasoning Tracer.
    """
    def __init__(self):
        # Initialize Hybrid SGI message bus / kernel bridge
        self.kernel_bridge = KernelBridge(force_mode=BridgeMode.FALLBACK)
        
        # Initialize Reasoning Tracer
        self.tracer = get_tracer(enable_streaming=True)
        
        # 4-layer Memory Hierarchy
        self.working_memory = []
        self.short_term_memory = []
        self.long_term_memory = {}
        self.episodic_memory = []
        
        # Internal state
        self.latest_trace_id = None
        
    async def process_chat(self, user_msg: str) -> str:
        """
        Stores user_msg in the 4-layer memory hierarchy and triggers 
        the Reasoning Tracer for live stats.
        """
        # 1. 4-Layer Memory Hierarchy
        # ---------------------------
        self.working_memory.append(user_msg)
        
        # Promote to Short-term Memory if working memory gets too large
        if len(self.working_memory) > 5:
            promoted = self.working_memory.pop(0)
            self.short_term_memory.append(promoted)
            
        # Promote to Long-term Memory via KernelBridge
        if len(self.short_term_memory) > 10:
            promoted = self.short_term_memory.pop(0)
            mem_key = f"mem_{len(self.long_term_memory)}"
            self.long_term_memory[mem_key] = promoted
            self.kernel_bridge.store_memory(mem_key, promoted)
            
        # Record in Episodic Memory
        self.episodic_memory.append({
            "timestamp": time.time(),
            "event": user_msg,
            "type": "chat_message"
        })

        # 2. Quadbrain Reasoning Tracer Logic
        # -----------------------------------
        trace_id = self.tracer.start_trace(query=user_msg, character_id="system")
        self.latest_trace_id = trace_id
        
        # MC (Policy / Monte Carlo)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_START, Hemisphere.MC, {"input": user_msg})
        await asyncio.sleep(0.01)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_COMPLETE, Hemisphere.MC, {"intent": "chat", "action": "process"})

        # NS (Risk / Novelty Search)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_START, Hemisphere.NS, {"input": user_msg})
        await asyncio.sleep(0.01)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_COMPLETE, Hemisphere.NS, {"threat_level": "none"})

        # PSI (Attention / Pattern)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_START, Hemisphere.PSI, {"input": user_msg})
        await asyncio.sleep(0.01)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_COMPLETE, Hemisphere.PSI, {"pattern_match": True})

        # VO (Value / Outcome)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_START, Hemisphere.VO, {"input": user_msg})
        await asyncio.sleep(0.01)
        self.tracer.add_event(trace_id, TraceEventType.HEMISPHERE_COMPLETE, Hemisphere.VO, {"value_alignment": "optimal"})

        # Integration / Complete
        self.tracer.end_trace(trace_id, final_answer="Memory and reasoning processed.", overall_confidence=0.95)
        
        return "Success"

    async def get_tracer_events(self) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Yields live tracing stats (Hemisphere NS, PSI, MC, VO).
        Reads from the reasoning_tracer streamer.
        """
        if not self.latest_trace_id:
            yield {"status": "No active traces available"}
            return
            
        async for event in self.tracer.stream_trace(self.latest_trace_id):
            # Yield events which include hemisphere activity
            yield event
