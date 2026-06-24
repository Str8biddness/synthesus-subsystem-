-- New patterns pulled from latest Jan 21, 2026 web research on prompt engineering, agentic AI design patterns, and self-improvement techniques.[^1][^2][^3][^4][^5][^6]

INSERT INTO patterns (pattern, response, domain, metadata) VALUES
('Persona Prompting', 'Assign a specific role or persona to the AI to guide its response style and expertise.', 'prompt_engineering', '{\"technique\": \"persona\", \"enhances\": \"contextual_accuracy\"}'),
('Few-Shot Prompting', 'Provide a few input-output examples to demonstrate the desired task format and expected output.', 'prompt_engineering', '{\"examples\": \"few_shot\", \"improves\": \"zero_shot_generalization\"}'),
('Planning Pattern', 'Break down complex goals into hierarchical sub-plans and execute them sequentially or in parallel.', 'agentic_ai', '{\"decomposition\": \"hierarchical\", \"execution\": \"sequential_parallel\"}'),
('Tool Use Pattern', 'Delegate specific functions to external tools like search engines, code interpreters, or APIs.', 'agentic_ai', '{\"extension\": \"tools\", \"safety\": \"sandboxed_execution\"}'),
('Multi-Agent Collaboration', 'Distribute tasks across specialized agents coordinated by a central orchestrator.', 'agentic_ai', '{\"scale\": \"multi_agent\", \"coordination\": \"orchestrator\"}'),
('Human-in-the-Loop Pattern', 'Incorporate human oversight and validation at critical decision points.', 'agentic_ai', '{\"safety\": \"human_oversight\", \"trigger\": \"high_stakes\"}'),
('Context Engineering', 'Curate and structure contextual information beyond simple prompts to optimize performance.', 'prompt_engineering', '{\"advanced\": \"context_eng\", \"beyond\": \"prompt_eng\"}'),
('RAG Prompting', 'Augment generation with retrieved external knowledge for improved factual accuracy.', 'prompt_engineering', '{\"method\": \"RAG\", \"benefit\": \"hallucination_reduction\"}'),
('Cognitive Verifier Pattern', 'Generate additional verification questions to ensure comprehensive and accurate coverage.', 'prompt_engineering', '{\"verification\": \"cognitive\", \"use\": \"knowledge_validation\"}'),
('Self-Supervised Learning', 'Generate supervisory signals from unlabeled data for autonomous improvement.', 'self_improvement', '{\"type\": \"self_supervised\", \"data\": \"unlabeled\"}'),
('Recursive Language Models', 'Implement recursive feedback loops for iterative self-refinement of outputs.', 'self_improvement', '{\"architecture\": \"RLM\", \"process\": \"recursive_refinement\"}'),
('Fan-Out Gather Pattern', 'Spawn parallel subtasks and aggregate results from multiple paths.', 'agentic_ai', '{\"parallelism\": \"fan_out_gather\", \"aggregation\": \"consensus\"}'),
('Code-Then-Execute Pattern', 'Generate executable code to solve the task, then run it in a safe environment.', 'agentic_ai', '{\"workflow\": \"code_gen_exec\", \"sandbox\": true}'),
('Context Minimization Pattern', 'Limit exposed context to mitigate risks like prompt injection attacks.', 'agentic_ai', '{\"security\": \"min_context\", \"defense\": \"injection\"}'),
('Sequential Design Pattern', 'Chain agents or steps linearly, passing state between sequential operations.', 'agentic_ai', '{\"flow\": \"sequential\", \"state\": \"persistent\"}');
