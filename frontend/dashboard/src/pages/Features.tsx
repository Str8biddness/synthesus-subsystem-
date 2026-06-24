import React, { useState } from "react";
import { 
  BrainCircuit, 
  Atom, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming basic clsx utility

interface FeatureItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: "FREE" | "PRO" | "ENTERPRISE" | "QUANTUM";
  active: boolean;
}

export default function FeaturesPage() {
  const [userTier, setUserTier] = useState<"FREE" | "PRO" | "ENTERPRISE" | "QUANTUM">("ENTERPRISE");

  const [features, setFeatures] = useState<FeatureItem[]>([
    {
      id: "dsinn",
      name: "DSINN Network",
      description: "Deep Synthetic Intelligence Neural Network with Qualia Encoding.",
      icon: <BrainCircuit className="w-6 h-6 text-indigo-400" />,
      tier: "PRO",
      active: true,
    },
    {
      id: "computress",
      name: "Computress Engines",
      description: "Activate Dream and Forge symbolic subsystems.",
      icon: <Sparkles className="w-6 h-6 text-fuchsia-400" />,
      tier: "ENTERPRISE",
      active: true,
    },
    {
      id: "quantum",
      name: "Quantum Boot Service",
      description: "Enable temporal resonance and hyperspace coordinate mapping.",
      icon: <Atom className="w-6 h-6 text-blue-400" />,
      tier: "QUANTUM",
      active: false,
    },
    {
      id: "canvas",
      name: "Geometric Canvas Generation",
      description: "Synthesus core image generation and pixel grounding abilities.",
      icon: <ImageIcon className="w-6 h-6 text-emerald-400" />,
      tier: "PRO",
      active: true,
    }
  ]);

  const toggleFeature = (id: string, requiredTier: string) => {
    // Basic tier checking mock
    const tiers = { "FREE": 1, "PRO": 2, "ENTERPRISE": 3, "QUANTUM": 4 };
    if (tiers[userTier] < tiers[requiredTier]) {
      alert(`Paywall Alert: Upgrade to ${requiredTier} to unlock this engine.`);
      return;
    }

    setFeatures(features.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
              System Entitlements
            </h1>
            <p className="text-slate-400 mt-2">Manage subsystem abstractions and graphical toggles.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
            <Settings className="w-5 h-5 text-slate-400" />
            <select 
              value={userTier} 
              onChange={(e) => setUserTier(e.target.value as any)}
              className="bg-transparent border-none text-sm font-semibold text-slate-200 outline-none cursor-pointer"
            >
              <option value="FREE">FREE Tier</option>
              <option value="PRO">PRO Tier</option>
              <option value="ENTERPRISE">ENTERPRISE Tier</option>
              <option value="QUANTUM">QUANTUM Tier</option>
            </select>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const tiers = { "FREE": 1, "PRO": 2, "ENTERPRISE": 3, "QUANTUM": 4 };
            const isLocked = tiers[userTier] < tiers[feature.tier];

            return (
              <div 
                key={feature.id}
                className={cn(
                  "relative group overflow-hidden rounded-3xl p-6 transition-all duration-300",
                  "border border-white/5 backdrop-blur-sm",
                  isLocked ? "bg-slate-900/40 opacity-75" : "bg-slate-900 hover:bg-slate-800",
                  feature.active && !isLocked && "ring-1 ring-indigo-500/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]"
                )}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl bg-slate-950 shadow-inner",
                    isLocked && "grayscale opacity-50"
                  )}>
                    {feature.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg">{feature.name}</h3>
                      
                      {/* Toggle Button / Lock Icon */}
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500/80 bg-amber-500/10 px-2.5 py-1 rounded-full">
                          <Lock className="w-3 h-3" />
                          {feature.tier}
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleFeature(feature.id, feature.tier)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                            feature.active ? "bg-indigo-500" : "bg-slate-700"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-sm",
                              feature.active ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      {feature.active && !isLocked ? (
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> System Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Offline
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
