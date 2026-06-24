-- New patterns pulled from latest Jan 19, 2026 web research on prompt engineering, agentic AI design patterns, and reasoning techniques.[^1][^2][^3]

INSERT INTO patterns (pattern, response, domain, metadata) VALUES
('Persona Pattern', 'Instruct model to adopt specific role (e.g., chef, expert) for contextually accurate responses.', 'prompt_engineering', '{"technique": "persona", "benefit": "role-based accuracy"}'),
('Few-shot Prompting', 'Include 2-5 examples in prompt to demonstrate desired output format and style.', 'prompt_engineering', '{"examples": "2-5", "use_case": "structured outputs"}'),
('Chain-of-Thought Prompting', 'Explicitly prompt "think step-by-step" to elicit detailed reasoning traces.', 'reasoning', '{"method": "CoT", "improvement": "logical tasks"}'),
('Tree of Thoughts', 'Generate multiple reasoning branches, evaluate utilities, prune suboptimal paths.', 'advanced_reasoning', '{"technique": "ToT", "exploration": "multi-path"}'),
('ReAct Pattern', 'Cycle through Reason -> Act (tool) -> Observe results until goal achieved.', 'agentic_ai', '{"loop": "ReAct", "autonomy": "high"}'),
('Tool Use Pattern', 'Delegate actions to external tools/APIs when generation insufficient.', 'agentic_ai', '{"essential": "beyond text gen", "2026": "core"}'),
('Planning Pattern', 'Decompose goal into sub-tasks, sequence execution plan before acting.', 'agentic_ai', '{"component": "planner", "complexity": "multi-step"}'),
('Multi-Agent Collaboration', 'Orchestrate specialist agents with shared memory for division of labor.', 'agentic_ai', '{"scale": "enterprise workflows"}'),
('Reflection Pattern', 'Self-critique output against criteria, generate improved version.', 'self_improvement', '{"iteration": "critique-revise"}'),
('Human-in-the-Loop Orchestration', 'Escalate uncertain decisions to human for approval/feedback.', 'agentic_ai', '{"governance": "safety-critical", "hybrid": true}'),
('Sequential Workflow Pattern', 'Chain agents in linear pipeline: output of one feeds next.', 'workflow_engineering', '{"pattern": "sequential", "predictable": true}'),
('Parallel Execution Pattern', 'Dispatch independent sub-tasks to agents/tools concurrently.', 'agentic_ai', '{"efficiency": "parallelism"}'),
('Self-Query Learning AZR', 'Auto-generate challenging questions on domain to self-train.', 'meta_learning', '{"autonomous": "zero human data"}'),
('Active Inference Principle', 'Act to fulfill predictions, minimize surprise (free energy).', 'principles_of_intelligence', '{"predictive": "processing"}'),
('Inference-Time Compute Scaling', 'Dynamically allocate more tokens/steps during inference for hard problems.', 'reasoning_models', '{"trend": "o1-preview style 2026"}');