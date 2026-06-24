import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Activity, 
  Sparkles, 
  AlertCircle, 
  Play, 
  Pause, 
  RefreshCw, 
  Eye, 
  Sliders, 
  Zap, 
  CheckCircle, 
  Search, 
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Tooltip 
} from "recharts";

interface Pattern {
  id: string;
  prob: number;
}

interface TelemetryVisualizerProps {
  entropy: number;
  topPatterns: Pattern[];
}

interface HistoryPoint {
  time: string;
  entropy: number;
}

export default function TelemetryVisualizer({ entropy: propEntropy, topPatterns: propPatterns }: TelemetryVisualizerProps) {
  // 1. Simulation Mode & Local Telemetry State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedEntropy, setSimulatedEntropy] = useState(1.84);
  const [simulatedPatterns, setSimulatedPatterns] = useState<Pattern[]>([
    { id: "ensemble_theta_5", prob: 0.42 },
    { id: "sensory_delta_prime", prob: 0.28 },
    { id: "cognitive_attractor_alpha", prob: 0.18 },
    { id: "motor_feedback_loop", prob: 0.12 }
  ]);

  // Use either live props or simulated state
  const currentEntropy = isSimulating ? simulatedEntropy : propEntropy;
  const currentPatterns = isSimulating ? simulatedPatterns : propPatterns;

  // 2. Entropy History for Sparkline/AreaChart
  const [entropyHistory, setEntropyHistory] = useState<HistoryPoint[]>([]);
  const historyCounter = useRef(0);

  // Sync history when the active entropy value changes
  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setEntropyHistory(prev => {
      const next = [...prev, { time: timeStr, entropy: currentEntropy }];
      // Keep last 25 points
      if (next.length > 25) {
        return next.slice(next.length - 25);
      }
      return next;
    });
  }, [currentEntropy]);

  // Generate simulated neural fluctuations in Simulation Mode
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Simulate random fluctuations in entropy, keeping it within 0.2 to 4.5
      setSimulatedEntropy(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        const next = Math.max(0.2, Math.min(4.5, prev + delta));
        return parseFloat(next.toFixed(3));
      });

      // Simulate random fluctuations in pattern probabilities
      setSimulatedPatterns(prev => {
        const next = prev.map(p => ({
          ...p,
          prob: Math.max(0.02, p.prob + (Math.random() - 0.5) * 0.08)
        }));
        
        // Normalize probabilities to sum to 1.0 (approximately)
        const total = next.reduce((sum, p) => sum + p.prob, 0);
        return next.map(p => ({
          ...p,
          prob: parseFloat((p.prob / total).toFixed(3))
        })).sort((a, b) => b.prob - a.prob);
      });

    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // 3. Stabilization Actions
  const [isStabilizing, setIsStabilizing] = useState(false);
  const [stabilizeSuccess, setStabilizeSuccess] = useState(false);

  const handleStabilize = () => {
    if (isStabilizing) return;
    
    setIsStabilizing(true);
    setStabilizeSuccess(false);

    // Simulate belief revision convergence
    setTimeout(() => {
      setIsStabilizing(false);
      setStabilizeSuccess(true);
      
      if (isSimulating) {
        // Drop entropy and collapse probability onto a single dominant pattern
        setSimulatedEntropy(0.185);
        setSimulatedPatterns([
          { id: "cognitive_attractor_alpha", prob: 0.88 },
          { id: "ensemble_theta_5", prob: 0.06 },
          { id: "sensory_delta_prime", prob: 0.04 },
          { id: "motor_feedback_loop", prob: 0.02 }
        ]);
      }

      // Clear success indicator after 3 seconds
      setTimeout(() => setStabilizeSuccess(false), 3000);
    }, 1200);
  };

  // 4. Interactive Pattern Details
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amplifiedPatterns, setAmplifiedPatterns] = useState<Record<string, boolean>>({});

  // Filter patterns by search query
  const filteredPatterns = useMemo(() => {
    return currentPatterns.filter(p => 
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentPatterns, searchQuery]);

  const toggleAmplify = (id: string) => {
    setAmplifiedPatterns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    if (isSimulating) {
      setSimulatedPatterns(prev => {
        const next = prev.map(p => {
          if (p.id === id) {
            // Increase its probability significantly
            return { ...p, prob: p.prob * 1.5 };
          }
          return p;
        });
        const total = next.reduce((sum, p) => sum + p.prob, 0);
        return next.map(p => ({
          ...p,
          prob: parseFloat((p.prob / total).toFixed(3))
        })).sort((a, b) => b.prob - a.prob);
      });
    }
  };

  // Compute selected pattern details (simulated dynamic details)
  const selectedDetails = useMemo(() => {
    if (!selectedPattern) return null;
    const pat = currentPatterns.find(p => p.id === selectedPattern);
    if (!pat) return null;

    // Deterministic simulation based on ID string
    const hash = pat.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const freeEnergy = parseFloat((0.15 + (hash % 50) / 100).toFixed(3));
    const dimension = `${64 + (hash % 8) * 32}-D Lattice`;
    const epochs = 120 + (hash % 300);
    
    return {
      id: pat.id,
      prob: pat.prob,
      freeEnergy,
      dimension,
      epochs,
      stability: pat.prob > 0.4 ? "High Attractor" : pat.prob > 0.15 ? "Meta-stable" : "Transient Trace"
    };
  }, [selectedPattern, currentPatterns]);

  // 5. Gauge Computations
  const maxEntropy = 5.0;
  const entropyPercentage = Math.min(100, (currentEntropy / maxEntropy) * 100);
  
  // SVG Circle parameters for radial gauge
  const radius = 32;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (entropyPercentage / 100) * circumference;

  // Determine color theme based on entropy
  const entropyColorClass = currentEntropy > 3.0 
    ? "text-rose-500" 
    : currentEntropy > 1.5 
      ? "text-amber-500" 
      : "text-emerald-400";

  const entropyStroke = currentEntropy > 3.0 
    ? "stroke-rose-500" 
    : currentEntropy > 1.5 
      ? "stroke-amber-500" 
      : "stroke-emerald-400";

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Header with Actions & Simulation Controls */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <Activity className={`w-4 h-4 text-orange-400 ${currentEntropy > 0 ? "animate-pulse" : ""}`} />
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono">PPBRS Telemetry Grid</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(prev => !prev)}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border transition-all font-mono ${
              isSimulating 
                ? "bg-orange-500/20 border-orange-500 text-orange-300" 
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
            title={isSimulating ? "Pause neural simulation" : "Start neural simulation"}
          >
            {isSimulating ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            {isSimulating ? "SIMULATING" : "SIMULATE"}
          </button>
        </div>
      </div>

      {/* Live / Idle Status Indicator */}
      {!isSimulating && propPatterns.length === 0 && (
        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Evidence Stream Idle.</span> WebSocket is disconnected or waiting for input. Toggle <strong className="underline cursor-pointer" onClick={() => setIsSimulating(true)}>SIMULATE</strong> mode to view live dashboard charts and interactions.
          </div>
        </div>
      )}

      {/* 2. Radial Gauge & Main Stats */}
      <div className="grid grid-cols-12 gap-3 bg-black/30 border border-white/5 rounded-lg p-3">
        {/* Radial Entropy Gauge */}
        <div className="col-span-4 flex flex-col items-center justify-center border-r border-white/5 pr-2">
          <div className="relative w-18 h-18">
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="36"
                cy="36"
                r={radius}
                className="stroke-white/5 fill-transparent"
                strokeWidth={strokeWidth}
              />
              {/* Foreground animated circle */}
              <circle
                cx="36"
                cy="36"
                r={radius}
                className={`fill-transparent transition-all duration-500 ease-out ${entropyStroke}`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono">H(x)</span>
              <span className={`text-xs font-bold font-mono ${entropyColorClass}`}>
                {currentEntropy.toFixed(2)}
              </span>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1 text-center">System Entropy</span>
        </div>

        {/* Core Metrics */}
        <div className="col-span-8 flex flex-col justify-between pl-1">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Belief Certainty:</span>
              <span className={`font-semibold ${currentEntropy < 1.5 ? "text-emerald-400" : currentEntropy < 3.0 ? "text-amber-400" : "text-rose-400"}`}>
                {Math.max(0, 100 - (currentEntropy / maxEntropy) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Active Nodes:</span>
              <span className="text-blue-300 font-semibold">{currentPatterns.length} Ensembles</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">System Mode:</span>
              <span className="text-purple-400 font-semibold font-mono text-[10px] tracking-wider uppercase">
                {isSimulating ? "Simulated Trace" : "Live WebSocket"}
              </span>
            </div>
          </div>

          {/* Stabilize Action Button */}
          <button
            onClick={handleStabilize}
            disabled={isStabilizing}
            className={`w-full text-center py-1 rounded text-[10px] font-bold tracking-widest font-mono transition-all border flex items-center justify-center gap-1.5 mt-2 ${
              stabilizeSuccess 
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                : isStabilizing
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400 cursor-not-allowed"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-orange-500/50"
            }`}
          >
            {isStabilizing ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                REVISING BELIEFS...
              </>
            ) : stabilizeSuccess ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-400 animate-bounce" />
                GRID STABILIZED
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 text-orange-400" />
                STABILIZE NEURAL GRID
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Real-time Entropy History Chart */}
      <div className="flex flex-col gap-1.5 bg-black/20 border border-white/5 rounded-lg p-2.5">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-0.5">
          <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-blue-400" /> Entropy Trend (25 epochs)</span>
          <span className="text-[9px] text-slate-500">Live Area Graph</span>
        </div>
        <div className="w-full h-20 mt-1">
          {entropyHistory.length < 2 ? (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono">
              [ Building historical landscape... ]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={entropyHistory} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <defs>
                  <linearGradient id="entropyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0080ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/95 border border-white/10 p-1.5 rounded text-[9px] font-mono shadow-xl">
                          <p className="text-slate-400">{payload[0].payload.time}</p>
                          <p className="text-orange-400 font-bold">H: {Number(payload[0].value).toFixed(3)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="entropy"
                  stroke="#ff8c00"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#entropyColor)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. Interactive Pattern Ensembles List */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Active Pattern Ensembles</span>
          {/* Micro Search Bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-1.5 w-3 h-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 pl-5 text-[10px] text-white outline-none w-24 focus:w-36 transition-all focus:border-orange-500/50"
            />
          </div>
        </div>

        {filteredPatterns.length === 0 ? (
          <div className="p-4 rounded border border-white/5 bg-black/10 text-center text-xs text-slate-600 font-mono">
            {currentPatterns.length === 0 
              ? "[ Awaiting Evidence Stream ]" 
              : `[ No matches for "${searchQuery}" ]`}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
            {filteredPatterns.map((pat) => {
              const isSelected = selectedPattern === pat.id;
              const isAmplified = amplifiedPatterns[pat.id];
              
              return (
                <div 
                  key={pat.id} 
                  className={`flex flex-col rounded border transition-all overflow-hidden ${
                    isSelected 
                      ? "bg-white/5 border-orange-500/40 shadow-[0_0_8px_rgba(255,140,0,0.15)]" 
                      : "bg-black/25 border-white/5 hover:border-white/10 hover:bg-black/40"
                  }`}
                >
                  {/* Pattern Header Row */}
                  <div 
                    onClick={() => setSelectedPattern(isSelected ? null : pat.id)}
                    className="flex items-center justify-between p-2 cursor-pointer text-[11px] font-mono"
                  >
                    <div className="flex items-center gap-1.5 truncate w-44">
                      <Sparkles className={`w-3 h-3 text-blue-400 ${isAmplified ? "text-orange-400 animate-spin" : ""}`} />
                      <span className={`truncate font-semibold ${isAmplified ? "text-orange-300" : "text-slate-200"}`}>
                        {pat.id}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-blue-300 font-bold">{(pat.prob * 100).toFixed(1)}%</span>
                      {isSelected ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Horizontal Confidence Bar */}
                  <div className="w-full bg-black/60 h-1">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isAmplified ? "bg-gradient-to-r from-blue-500 to-orange-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${pat.prob * 100}%` }}
                    />
                  </div>

                  {/* Expanded Pattern Details Panel */}
                  {isSelected && selectedDetails && (
                    <div className="p-2 bg-black/50 border-t border-white/5 text-[10px] font-mono flex flex-col gap-2 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-1.5 text-slate-400">
                        <div>Free Energy: <span className="text-slate-200 font-semibold">{selectedDetails.freeEnergy} eV</span></div>
                        <div>Attractor D: <span className="text-slate-200 font-semibold">{selectedDetails.dimension}</span></div>
                        <div>Epoch Age: <span className="text-slate-200 font-semibold">{selectedDetails.epochs}</span></div>
                        <div>Stability: <span className={`font-semibold ${
                          selectedDetails.stability === "High Attractor" 
                            ? "text-orange-400" 
                            : selectedDetails.stability === "Meta-stable" 
                              ? "text-blue-400" 
                              : "text-slate-500"
                        }`}>{selectedDetails.stability}</span></div>
                      </div>

                      {/* Interactive Details Actions */}
                      <div className="flex gap-2 mt-1 pt-1.5 border-t border-white/5">
                        <button
                          onClick={() => toggleAmplify(pat.id)}
                          className={`flex-1 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase transition-all border flex items-center justify-center gap-1 ${
                            isAmplified 
                              ? "bg-orange-500/20 border-orange-500 text-orange-300"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Sliders className="w-2.5 h-2.5" />
                          {isAmplified ? "AMPLIFIED ACTIVE" : "AMPLIFY SIGNAL"}
                        </button>
                        <button
                          onClick={() => alert(`Ensemble trace details for ${pat.id}:\nConfidence: ${(pat.prob * 100).toFixed(2)}%\nFree Energy: ${selectedDetails.freeEnergy}\nState Dimension: ${selectedDetails.dimension}`)}
                          className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white flex items-center justify-center"
                          title="Inspect full state vectors"
                        >
                          <Eye className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
