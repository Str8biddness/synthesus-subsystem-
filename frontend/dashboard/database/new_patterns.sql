-- New patterns pulled from latest AI research on prompt engineering, agentic AI, and synthetic intelligence techniques (2026 sources)

INSERT INTO patterns (pattern, response, domain, metadata) VALUES
('prompt repetition technique', 'Repeat the input prompt internally to boost accuracy on direct retrieval tasks by up to 76% without extra output length.', 'prompt_engineering', '{"technique": "repetition", "gain": "76%", "source": "VentureBeat"}'),
('prime prompt polish framework', 'Prime: Provide context first. Prompt: Ask precisely. Polish: Refine iteratively for best results.', 'prompt_engineering', '{"framework": "PPP", "steps": 3}'),
('self-query learning AZR', 'Generate challenging self-questions on code/problems to learn autonomously without human data.', 'meta_learning', '{"method": "AZR", "self_improvement": true}'),
('TRIDENT self-improvement', 'Generate reasoning traces, self-evaluate with rewards, iterate to improve intelligence.', 'self_improvement', '{"loop": "SGRL", "autonomous": true}'),
('ReAct reasoning acting loop', 'Reason about action, Act with tools, Observe outcome, repeat until task complete.', 'agentic_ai', '{"pattern": "ReAct"}'),
('Tree of Thoughts exploration', 'Branch multiple reasoning paths, evaluate utilities, prune and converge on best solution.', 'advanced_reasoning', '{"technique": "ToT"}'),
('self-ask with search', 'Decompose question into sub-questions, search/verify answers step-by-step.', 'verification', '{"method": "self_ask_search"}'),
('multi-agent orchestration', 'Delegate subtasks to specialist agents, coordinate via shared memory or hierarchy.', 'agentic_ai', '{"collaboration": "multi_agent"}'),
('reflection critique pattern', 'Generate output, then critique for errors/gaps, revise for higher quality.', 'self_critique', '{"iteration": "reflect"}'),
('prompt chaining workflow', 'Break complex task into sequential prompts, feeding outputs as next inputs.', 'workflow_engineering', '{"technique": "chaining"}'),
('meta-prompting optimization', 'Use AI to generate/optimize prompts for specific tasks dynamically.', 'prompt_engineering', '{"meta": true}'),
('utility-based decision', 'Score actions by utility across needs (hunger, safety, etc.), select highest.', 'decision_making', '{"method": "utility_scoring"}'),
('active inference principle', 'Predict sensory outcomes, act to minimize prediction error (free energy).', 'principles_of_intelligence', '{"principle": "active_inference"}'),
('multi-timescale computation', 'Integrate fast reflexes with slow deliberation in parallel timescales.', 'cognition', '{"multi_scale": true}'),
('adaptive structure evolution', 'Dynamically modify own architecture based on task demands.', 'self_modification', '{"adaptation": "structural"}');