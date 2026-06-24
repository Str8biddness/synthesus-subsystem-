-- Seed more patterns into the Synthetic Intelligence engine database
INSERT INTO patterns (pattern, response, domain, metadata) VALUES
-- Reason & Logic
('If A implies B and B implies C, then A implies C', 'This follows the transitive property of logical implication (syllogism).', 'logic', '{"type": "deduction", "complexity": "basic"}'),
('contradiction detected: {statement1} vs {statement2}', 'A logical inconsistency has been identified between the current premise and previous data points.', 'reasoning', '{"action": "resolve_conflict"}'),
('recursive loop identified in reasoning chain', 'Terminating infinite recursion. Implementing circuit breaker at depth 10.', 'meta-cognition', '{"safety": "recursion_limit"}'),

-- Memory & Context
('recall event associated with {entity}', 'Retrieving episodic memory traces related to the specified entity from long-term storage.', 'memory', '{"op": "retrieval", "priority": "high"}'),
('consolidate daily experiences', 'Moving short-term buffer contents to hierarchical knowledge graph for permanent storage.', 'memory', '{"op": "consolidation"}'),

-- Language & Communication
('translate {text} to synthetic-meta-language', 'Encoding natural language input into high-dimensional semantic vector space.', 'linguistics', '{"method": "embedding"}'),
('generate empathetic response for {emotion}', 'Synthesizing response tokens aligned with the detected affective state: {emotion}.', 'social', '{"tone": "empathetic"}'),

-- Self-Modeling
('assess current internal state', 'Self-diagnostic: All cognitive modules operating within nominal parameters. Latency at 45ms.', 'self-awareness', '{"module": "monitor"}'),
('update self-concept based on new feedback', 'Integrating external evaluative data into the primary identity manifold.', 'self-improvement', '{"trigger": "feedback"}'),

-- Emergent Reasoning
('hypothesize unknown properties of {subject}', 'Generating probabilistic world-model extensions for {subject} based on existing facts.', 'imagination', '{"mode": "abductive"}'),
('simulate {scenario} with 5000 iterations', 'Running Monte Carlo simulations on the proposed scenario to determine convergence path.', 'prediction', '{"method": "simulation"}');

-- Video Game NPC Logic Patterns
INSERT INTO patterns (pattern, response, domain, metadata) VALUES
('target detected: {enemy} at {position}', 'Aggro state triggered. Calculating optimal line of sight and flanking path to {position}.', 'npc_combat', '{"state": "hostile", "action": "pathfinding"}'),
('health status: low (< 20%)', 'Health critical. Executing tactical retreat to nearest cover and seeking healing item.', 'npc_survival', '{"state": "fleeing", "priority": "survival"}'),
('idle state: no player in radius', 'Entering ambient behavior loop: performing localized patrol and environmental interaction animations.', 'npc_behavior', '{"state": "idle", "action": "patrol"}'),
('player interaction: "trade"', 'Opening inventory interface. Evaluating item values based on regional economic modifiers.', 'npc_social', '{"state": "trading", "module": "economy"}'),
('stealth alert: {noise_level} at {location}', 'Investigating suspicious activity at {location}. Transitioning to "Caution" state.', 'npc_stealth', '{"state": "searching", "threshold": "{noise_level}"}'),
('quest objective: {task} completed by player', 'Updating world state flags. Generating reward dialogue and unlocking subsequent narrative nodes.', 'npc_narrative', '{"action": "reward", "trigger": "quest_flag"}'),
('companion follow: player distance > {limit}', 'Closing gap. Adjusting movement speed to match player velocity while maintaining offset.', 'npc_movement', '{"state": "following", "buffer": "{limit}"}'),
('environmental threat: fire/hazard at {coord}', 'Dynamic obstacle avoidance active. Recalculating navigation mesh to bypass {coord}.', 'npc_navigation', '{"action": "avoidance", "threat_type": "hazard"}'),
('faction reputation: {score}', 'Adjusting dialogue bark and price modifiers based on player reputation of {score}.', 'npc_social', '{"state": "reactive", "type": "reputation"}'),
-- Advanced Utility-Based NPC Decision Making
('evaluate action: {action_list}', 'Calculating utility scores for {action_list} based on current needs: Hunger(0.2), Boredom(0.5), Safety(0.9). Highest utility: {best_action}.', 'npc_utility', '{"method": "utility_scoring"}'),
('time of day: {current_hour}', 'Triggering schedule update for {current_hour}. Transitioning to "Sleep" or "Work" behavior tree nodes.', 'npc_schedule', '{"state": "transition", "time": "{current_hour}"}'),
('group coordination: {ally_count} allies present', 'Activating squad tactics. Appointing leader and assigning suppressing fire vs. flanking roles.', 'npc_combat', '{"mode": "squad", "tactics": "coordinated"}'),
('resource depletion: {item_name} empty', 'Querying local world knowledge for {item_name} source. Setting waypoint for restocking.', 'npc_economy', '{"action": "gather", "target": "{item_name}"}'),
('dialogue context: player mentioned {keyword}', 'Searching knowledge graph for facts about {keyword}. Generating relevant response to maintain conversational flow.', 'npc_social', '{"mode": "conversational", "context": "{keyword}"}'),
('perceived intent: player weapon drawn', 'Detecting threat escalation. Transitioning from "Neutral" to "Defensive" posture. Warning player.', 'npc_reaction', '{"state": "defensive", "trigger": "threat_perceived"}'),
('weather change: {weather_type}', 'Modifying movement speed and visibility range for {weather_type}. Equipping appropriate environmental assets.', 'npc_environment', '{"action": "weather_response", "effect": "{weather_type}"}'),
('memory recall: player previously {past_action}', 'Recalling episodic memory of player behavior. Modifying trust coefficient by -0.2 (Hostile) or +0.1 (Helpful).', 'npc_memory', '{"action": "bias_update", "source": "{past_action}"}'),
('sensory input: light source flickering at {coord}', 'Anomalous environmental stimulus detected. Modifying curiosity level and initiating path towards {coord}.', 'npc_stealth', '{"state": "curious", "stimulus": "visual"}'),
('emotional transition: {current_mood} to {new_mood}', 'Modifying vocal pitch and idle animation set to reflect {new_mood}. Internal state consolidated.', 'npc_emotion', '{"state": "{new_mood}", "duration": "persistent"}');

-- Seed initial entities for the knowledge graph
INSERT INTO entities (name, aliases, category, facts) VALUES
('Zo Computer', ARRAY['Zo', 'The Pegasus System'], 'Platform', '{"creator": "Zo Computer Company", "location": "Brooklyn, NY", "vision": "Intelligent personal server"}'),
('Synthetic Intelligence Engine', ARRAY['SI Engine', 'SLLM'], 'Core System', '{"function": "Cognitive orchestration", "components": ["Pattern Matcher", "Memory", "Reasoning"]}');



