import React, { useState, useEffect, useRef } from 'react';
import { Move, RotateCcw, Award, Sparkles, CheckCircle2, ArrowRight, Shield, Zap, Info } from 'lucide-react';
import { playButtonClick, playButtonHover, playThruster, playBounce, playDockSuccess, playBadgeUnlock } from '../utils/soundEngine';

const LEVELS = [
  {
    id: 1,
    title: 'Level 1: Straight Shot',
    desc: 'Align your thruster straight into the Docking Berth. No friction means it will drift continuously!',
    crateStart: { x: 80, y: 150 },
    dockTarget: { x: 500, y: 150, radius: 40 },
    obstacles: []
  },
  {
    id: 2,
    title: 'Level 2: Wall Ricochet',
    desc: 'An asteroid blocks the direct line. Bounce off the elastic top wall to reach the Docking Berth!',
    crateStart: { x: 80, y: 220 },
    dockTarget: { x: 500, y: 220, radius: 40 },
    obstacles: [{ x: 300, y: 180, width: 40, height: 120 }]
  },
  {
    id: 3,
    title: 'Level 3: Deep Space Obstacle Field',
    desc: 'Steer through multiple space debris hazards into the narrow bay!',
    crateStart: { x: 80, y: 80 },
    dockTarget: { x: 500, y: 250, radius: 35 },
    obstacles: [
      { x: 220, y: 40, width: 30, height: 140 },
      { x: 380, y: 160, width: 30, height: 140 }
    ]
  }
];

export default function CargoBay({ cadet, onCompleteModule, onBack }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [angle, setAngle] = useState(0); // degrees
  const [power, setPower] = useState(50);
  const [isLaunched, setIsLaunched] = useState(false);
  const [docked, setDocked] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);

  const canvasRef = useRef(null);
  const currentLevel = LEVELS[currentLevelIndex];

  // Physics State
  const physicsRef = useRef({
    x: currentLevel.crateStart.x,
    y: currentLevel.crateStart.y,
    vx: 0,
    vy: 0,
    trail: []
  });

  // Reset physics position when changing levels
  const resetCrate = () => {
    const start = LEVELS[currentLevelIndex].crateStart;
    physicsRef.current = {
      x: start.x,
      y: start.y,
      vx: 0,
      vy: 0,
      trail: []
    };
    setIsLaunched(false);
    setDocked(false);
    setCrashed(false);
  };

  useEffect(() => {
    resetCrate();
  }, [currentLevelIndex]);

  // Launch Thrust Action
  const handleLaunch = () => {
    if (isLaunched || docked) return;
    playThruster();
    const rad = (angle * Math.PI) / 180;
    const speed = (power / 100) * 8;
    physicsRef.current.vx = Math.cos(rad) * speed;
    physicsRef.current.vy = Math.sin(rad) * speed;
    setIsLaunched(true);
  };

  // Canvas render & physics loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updatePhysics = () => {
      const p = physicsRef.current;

      if (isLaunched && !docked && !crashed) {
        // Zero Friction: vx and vy remain constant! (Newton's 1st Law)
        p.x += p.vx;
        p.y += p.vy;

        // Record motion trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 25) p.trail.shift();

        // Bounce off canvas boundaries (Friction-free elastic bounce)
        if (p.x <= 20 || p.x >= canvas.width - 20) {
          p.vx = -p.vx;
          playBounce();
        }
        if (p.y <= 20 || p.y >= canvas.height - 20) {
          p.vy = -p.vy;
          playBounce();
        }

        // Check Obstacle Collisions
        currentLevel.obstacles.forEach((obs) => {
          if (
            p.x + 15 >= obs.x &&
            p.x - 15 <= obs.x + obs.width &&
            p.y + 15 >= obs.y &&
            p.y - 15 <= obs.y + obs.height
          ) {
            setCrashed(true);
            setIsLaunched(false);
            playBounce();
          }
        });

        // Check Docking Target Hit
        const target = currentLevel.dockTarget;
        const dx = p.x - target.x;
        const dy = p.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= target.radius) {
          setDocked(true);
          setIsLaunched(false);
          playDockSuccess();

          if (!completedLevels.includes(currentLevel.id)) {
            const nextCompleted = [...completedLevels, currentLevel.id];
            setCompletedLevels(nextCompleted);

            if (nextCompleted.length >= 3 && !badgeUnlocked) {
              setBadgeUnlocked(true);
              playBadgeUnlock();
              onCompleteModule(300, true);
            }
          }
        }
      }

      // Render Frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Background Grid
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Render Walls
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

      // Render Obstacles
      ctx.fillStyle = '#ff007f';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 10;
      currentLevel.obstacles.forEach((obs) => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });
      ctx.shadowBlur = 0;

      // Render Docking Bay Target
      const target = currentLevel.dockTarget;
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fillStyle = docked ? 'rgba(0, 255, 102, 0.4)' : 'rgba(0, 229, 255, 0.25)';
      ctx.fill();
      ctx.strokeStyle = docked ? '#00ff66' : '#00e5ff';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(docked ? 'DOCKED ✅' : 'DOCK BAY 🧲', target.x, target.y + 4);

      // Render Motion Trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 183, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Render Aiming Arrow (if not launched)
      if (!isLaunched && !docked) {
        const rad = (angle * Math.PI) / 180;
        const arrowLen = (power / 100) * 60 + 20;
        const ax = p.x + Math.cos(rad) * arrowLen;
        const ay = p.y + Math.sin(rad) * arrowLen;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = '#ffb700';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Arrow tip
        ctx.beginPath();
        ctx.arc(ax, ay, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb700';
        ctx.fill();
      }

      // Render Cargo Crate
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = crashed ? '#ff0055' : docked ? '#00ff66' : '#ffb700';
      ctx.shadowColor = crashed ? '#ff0055' : '#ffb700';
      ctx.shadowBlur = 12;
      ctx.fillRect(-18, -18, 36, 36);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-18, -18, 36, 36);

      ctx.fillStyle = '#1e0e45';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📦', 0, 0);
      ctx.restore();

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [isLaunched, docked, crashed, angle, power, currentLevel]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-3xl border-2 border-cyan-500/40">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
            <Move className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">ZERO-G CARGO BAY (PHYSICS LAB)</h2>
            <p className="text-xs text-purple-200/80">
              Newton's 1st Law: Objects in motion stay in motion! Guide cargo crates without friction into docking berths.
            </p>
          </div>
        </div>

        {badgeUnlocked && (
          <div className="bg-cyan-500/20 border-2 border-cyan-400 px-4 py-2 rounded-2xl flex items-center space-x-2 animate-bounce">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-black text-cyan-300">ZERO-G MASTER BADGE UNLOCKED!</span>
          </div>
        )}
      </div>

      {/* Level Tabs */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {LEVELS.map((level, idx) => {
          const isSelected = currentLevelIndex === idx;
          const isDone = completedLevels.includes(level.id);
          return (
            <button
              key={level.id}
              onClick={() => {
                playButtonClick();
                setCurrentLevelIndex(idx);
              }}
              onMouseEnter={playButtonHover}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 border ${
                isSelected
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/30'
                  : 'bg-purple-950/40 border-purple-800 text-purple-300 opacity-75'
              }`}
            >
              <span>{level.title}</span>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Physics Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 2D Canvas Physics Viewport (8 Cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-4 flex flex-col items-center border-2 border-cyan-500/30 relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full max-w-[600px] h-[320px] bg-[#070b1a] rounded-2xl border-2 border-cyan-500/50 shadow-inner"
          />

          {/* Status Alert */}
          {crashed && (
            <div className="mt-3 bg-pink-950/80 border border-pink-500 text-pink-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2">
              <Shield className="w-4 h-4 text-pink-400" />
              <span>CRASHED INTO HAZARD! Press Reset to align your angle!</span>
            </div>
          )}

          {docked && (
            <div className="mt-3 bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>PERFECT DOCKING! Level Cleared!</span>
            </div>
          )}
        </div>

        {/* Right: Thruster Controls & Angle Wheel (4 Cols) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-5 border-2 border-cyan-500/30">
          
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>THRUSTER CONSOLE</span>
            </h3>
            <p className="text-xs text-purple-200/80">{currentLevel.desc}</p>
          </div>

          {/* Angle Dial */}
          <div className="space-y-2 bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-cyan-300">THRUST ANGLE</span>
              <span className="text-yellow-400">{angle}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              disabled={isLaunched}
              className="w-full accent-cyan-400 h-2 bg-purple-900 rounded-lg cursor-pointer"
            />
          </div>

          {/* Power Impulse Slider */}
          <div className="space-y-2 bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-cyan-300">IMPULSE POWER</span>
              <span className="text-yellow-400">{power}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={power}
              onChange={(e) => setPower(parseInt(e.target.value))}
              disabled={isLaunched}
              className="w-full accent-yellow-400 h-2 bg-purple-900 rounded-lg cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLaunch}
              disabled={isLaunched || docked}
              onMouseEnter={playButtonHover}
              className={`w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                isLaunched || docked ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400' : 'btn-yellow-game'
              }`}
            >
              <Zap className="w-5 h-5 text-yellow-900" />
              <span>FIRE ZERO-G THRUSTER</span>
            </button>

            <button
              onClick={() => {
                playButtonClick();
                resetCrate();
              }}
              onMouseEnter={playButtonHover}
              className="w-full btn-cyan-game py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET CARGO CRATE</span>
            </button>
          </div>

          {/* Educational Physics Tip */}
          <div className="bg-purple-900/40 border border-purple-700/50 p-3 rounded-2xl flex items-start space-x-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-purple-200/90 leading-tight">
              <strong>Newton's First Law:</strong> In deep space zero gravity with no friction or atmosphere, a pushed crate will travel infinitely at the exact same velocity until an external force acts on it!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
