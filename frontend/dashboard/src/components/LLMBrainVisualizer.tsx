import React from 'react';
import { Brain, Cpu, Database, Activity, GitCommit, Settings, ShieldAlert } from 'lucide-react';

export default function LLMBrainVisualizer() {
  const modules = [
    { name: "planner-llm", role: "Planning & Decomposition", status: "Active", gpu: "gpu0", icon: <GitCommit className="w-4 h-4 text-emerald-400" /> },
    { name: "critic-llm", role: "Safety & Policy Verification", status: "Active", gpu: "gpu1", icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { name: "narrative-llm", role: "Self-Narrative & Memory", status: "Idle", gpu: "cpu", icon: <Database className="w-4 h-4 text-blue-400" /> },
    { name: "tool-llm", role: "API & Code Orchestration", status: "Idle", gpu: "gpu0", icon: <Settings className="w-4 h-4 text-amber-400" /> },
    { name: "social-llm", role: "Multi-Agent Theory of Mind", status: "Idle", gpu: "gpu1", icon: <Brain className="w-4 h-4 text-purple-400" /> }
  ];

  return (
    <div className="flex flex-col h-full gap-4 text-slate-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-bold flex items-center gap-2 text-cyan-400">
          <Cpu className="w-5 h-5" /> ONNX Cognitive Substrate
        </h3>
        <span className="text-xs font-mono bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">v2.0 ACTIVE</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {modules.map((mod, idx) => (
            <div key={idx} className="bg-black/40 border border-white/5 rounded p-3 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {mod.icon}
                  <span className="font-mono text-sm font-semibold text-slate-100">{mod.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {mod.status === 'Active' && <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>}
                  <span className={`text-xs ${mod.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>{mod.status}</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>{mod.role}</span>
                <span className="font-mono text-indigo-400 bg-indigo-950 px-1 rounded border border-indigo-900/50">[{mod.gpu}]</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-cyan-500" />
            <span>Cognitive Bus</span>
          </div>
          <span className="text-cyan-500">Listening...</span>
        </div>
      </div>
    </div>
  );
}
