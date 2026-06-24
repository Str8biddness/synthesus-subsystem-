-- New patterns pulled from latest Jan 20, 2026 web research on prompt engineering, agentic AI design patterns, and self-improvement techniques.[^1][^2][^3][^4][^5]

INSERT INTO patterns (pattern, response, domain, metadata) VALUES
('PromptCoT 2.0', 'Use expectation-maximization loop to iteratively refine rationales for advanced LLM reasoning prompts.', 'prompt_engineering', '{"technique": "PromptCoT_2.0", "training": "self-play_sft", "year": "2026"}'),
('Self-Consistency Sampling', 'Generate multiple reasoning paths and majority vote for consistent, reliable outputs.', 'prompt_engineering', '{"method": "self_consistency", "improves": "accuracy_complex_tasks"}'),
('Meta-Prompting', 'Leverage AI to automatically refine and optimize prompts iteratively.', 'prompt_engineering', '{"advanced": "meta_prompting", "use": "prompt_refinement"}'),
('Tree-of-Thoughts ToT', 'Explore multiple reasoning paths in a tree structure for complex problem-solving.', 'prompt_engineering', '{"framework": "ToT", "for": "multi_step_reasoning"}'),
('Constitutional AI Principles', 'Embed ethical guidelines and principles into prompts for aligned AI behavior.', 'prompt_engineering', '{"alignment": "constitutional_ai", "focus": "ethics"}'),
('Recursive Prompting', 'Iteratively refine prompts and responses in a feedback loop for precision.', 'prompt_engineering', '{"method": "recursive", "benefit": "iterative_improvement"}'),
('Prompt Decomposition Chaining', 'Break complex prompts into sequential sub-tasks for better handling.', 'prompt_engineering', '{"pattern": "decomposition", "enhances": "complexity_tolerance"}'),
('Structured Outputs Schema Validation', 'Enforce JSON schemas in prompts for parseable, consistent outputs.', 'prompt_engineering', '{"output": "structured_json", "tool": "pydantic_schema"}'),
('Adversarial Prompting', 'Test prompts against edge cases to build robust AI responses.', 'prompt_engineering', '{"testing": "adversarial", "goal": "robustness"}'),
('Reflection Self-Critique', 'Prompt AI to evaluate and critique its own outputs for improvement.', 'prompt_engineering', '{"meta": "reflection", "improves": "self_assessment"}'),
('Reflection Pattern Agentic', 'Agents self-evaluate outputs to enable continuous self-improvement.', 'agentic_ai', '{"pattern": "reflection", "key": "self_feedback"}'),
('Routing Pattern', 'Direct tasks to specialized sub-agents based on query analysis.', 'agentic_ai', '{"orchestration": "routing", "multi_agent": true}'),
('Parallelization Pattern', 'Execute independent sub-tasks concurrently and aggregate results.', 'agentic_ai', '{"scalability": "parallel", "efficiency": "high"}'),
('Meta-Reasoning Agents', 'Oversee and coordinate other agents with higher-level reasoning.', 'agentic_ai', '{"hierarchy": "meta_reasoning", "supervision": true}'),
('Feedback-Driven Learning', 'Agents improve via internal feedback loops without retraining.', 'self_improvement', '{"loop": "feedback_learning", "autonomous": true}'),
('Model Context Protocol MCP', 'Ensure agents operate in appropriate contexts for optimal performance.', 'agentic_ai', '{"protocol": "MCP", "deployment": "production_grade"}');