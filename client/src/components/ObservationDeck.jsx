import React, { useState, useEffect, useRef } from 'react';
import { Telescope, Award, Sparkles, CheckCircle2, Star, Info, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';
import { playButtonClick, playButtonHover, playStarChime, playBadgeUnlock } from '../utils/soundEngine';

const CONSTELLATIONS = [
  {
    id: 'orion',
    name: 'Orion the Hunter 🏹',
    fact: 'Orion is one of the most recognizable constellations! Its shoulder star Betelgeuse is a giant red supergiant 700 times larger than our Sun!',
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 3]],
    stars: [
      { id: 'betelgeuse', name: 'Betelgeuse', x: 200, y: 120, size: 8, color: '#ff4d4d', freq: 523.25 },
      { id: 'bellatrix', name: 'Bellatrix', x: 300, y: 130, size: 6, color: '#66ccff', freq: 659.25 },
      { id: 'alnitak', name: 'Belt (Alnitak)', x: 240, y: 190, size: 5, color: '#ffffff', freq: 783.99 },
      { id: 'saiph', name: 'Saiph', x: 210, y: 260, size: 6, color: '#66ccff', freq: 880.00 },
      { id: 'rigel', name: 'Rigel', x: 290, y: 270, size: 9, color: '#00e5ff', freq: 1046.50 }
    ]
  },
  {
    id: 'ursa_major',
    name: 'Ursa Major (Big Dipper) 🐻',
    fact: 'The two pointer stars at the end of the Big Dipper bowl point directly to Polaris, the North Star, which sailors used for centuries!',
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    stars: [
      { id: 'dubhe', name: 'Dubhe', x: 500, y: 100, size: 7, color: '#ffb700', freq: 587.33 },
      { id: 'merak', name: 'Merak', x: 520, y: 150, size: 6, color: '#ffffff', freq: 659.25 },
      { id: 'phecda', name: 'Phecda', x: 600, y: 160, size: 6, color: '#00e5ff', freq: 739.99 },
      { id: 'megrez', name: 'Megrez', x: 610, y: 115, size: 5, color: '#ffffff', freq: 830.61 },
      { id: 'alioth', name: 'Alioth', x: 670, y: 100, size: 7, color: '#ffffff', freq: 880.00 },
      { id: 'mizar', name: 'Mizar', x: 720, y: 80, size: 6, color: '#66ccff', freq: 987.77 },
      { id: 'alkaid', name: 'Alkaid', x: 770, y: 60, size: 7, color: '#00e5ff', freq: 1046.50 }
    ]
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia the Queen 👑',
    fact: 'Cassiopeia forms a distinct "W" or "M" shape in the northern night sky depending on the season.',
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    stars: [
      { id: 'caph', name: 'Caph', x: 150, y: 400, size: 7, color: '#ffb700', freq: 659.25 },
      { id: 'schedar', name: 'Schedar', x: 210, y: 430, size: 8, color: '#ff9900', freq: 783.99 },
      { id: 'gamma_cas', name: 'Gamma Cas', x: 260, y: 390, size: 7, color: '#00e5ff', freq: 880.00 },
      { id: 'ruchbah', name: 'Ruchbah', x: 320, y: 420, size: 6, color: '#ffffff', freq: 987.77 },
      { id: 'segin', name: 'Segin', x: 370, y: 380, size: 6, color: '#66ccff', freq: 1174.66 }
    ]
  }
];

export default function ObservationDeck({ cadet, onCompleteModule, onBack }) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [activeConstellation, setActiveConstellation] = useState(null);
  const [discoveredConstellations, setDiscoveredConstellations] = useState([]);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);

  const canvasRef = useRef(null);

  // Handle Drag Panning
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Click on Canvas Star check
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left - pan.x;
    const clickY = e.clientY - rect.top - pan.y;

    CONSTELLATIONS.forEach((c) => {
      c.stars.forEach((s) => {
        const dx = clickX - s.x;
        const dy = clickY - s.y;
        if (Math.sqrt(dx * dx + dy * dy) <= 20) {
          playStarChime(s.freq);
          setActiveConstellation(c);

          if (!discoveredConstellations.includes(c.id)) {
            const nextDiscovered = [...discoveredConstellations, c.id];
            setDiscoveredConstellations(nextDiscovered);

            if (nextDiscovered.length >= 3 && !badgeUnlocked) {
              setBadgeUnlocked(true);
              playBadgeUnlock();
              onCompleteModule(300, true);
            }
          }
        }
      });
    });
  };

  // Render Star Map Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);

    // Render Deep Sky Background Stars (random background field)
    for (let i = 0; i < 150; i++) {
      const bx = (i * 97) % 1200 - 200;
      const by = (i * 131) % 800 - 200;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 229, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(bx, by, (i % 2) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Constellation Lines & Stars
    CONSTELLATIONS.forEach((c) => {
      const isDiscovered = discoveredConstellations.includes(c.id);

      // Draw Lines
      ctx.strokeStyle = isDiscovered ? 'rgba(0, 229, 255, 0.8)' : 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = isDiscovered ? 2.5 : 1.5;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = isDiscovered ? 12 : 0;

      c.lines.forEach(([startIdx, endIdx]) => {
        const p1 = c.stars[startIdx];
        const p2 = c.stars[endIdx];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Draw Stars
      c.stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px sans-serif';
        ctx.fillText(s.name, s.x + 10, s.y + 4);
      });
    });

    ctx.restore();
  }, [pan, discoveredConstellations]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-3xl border-2 border-purple-500/40">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center">
            <Telescope className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">THE OBSERVATION DECK (CONSTELLATION TOUR)</h2>
            <p className="text-xs text-purple-200/80">
              Drag to pan the 2D star map! Click star nodes to discover constellations and calibrate the navigation computer.
            </p>
          </div>
        </div>

        {badgeUnlocked && (
          <div className="bg-purple-500/20 border-2 border-purple-400 px-4 py-2 rounded-2xl flex items-center space-x-2 animate-bounce">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-black text-purple-300">STARGAZER BADGE UNLOCKED!</span>
          </div>
        )}
      </div>

      {/* Progress & Constellation Tracker Bar */}
      <div className="flex items-center justify-between bg-purple-950/60 p-4 rounded-2xl border border-purple-700/50">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-xs font-bold text-cyan-300 uppercase">
            CONSTELLATIONS CALIBRATED: {discoveredConstellations.length} / 3
          </span>
        </div>

        <div className="flex space-x-2">
          {CONSTELLATIONS.map((c) => {
            const isFound = discoveredConstellations.includes(c.id);
            return (
              <span
                key={c.id}
                className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                  isFound ? 'bg-purple-500/30 border-purple-400 text-purple-200' : 'bg-slate-900/50 border-slate-700 text-slate-500'
                }`}
              >
                {c.name.split(' ')[0]} {isFound ? '✅' : '🔒'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Interactive 2D Star Map Canvas */}
      <div className="glass-panel rounded-3xl p-4 border-2 border-purple-500/30 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
          className="w-full h-[450px] bg-[#050212] rounded-2xl border-2 border-purple-600/50 cursor-grab active:cursor-grabbing"
        />

        {/* Floating Instruction Hint */}
        <div className="absolute top-8 left-8 bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-purple-200 text-xs px-3 py-1.5 rounded-xl pointer-events-none flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click & Drag to pan sky • Click glowing star nodes</span>
        </div>
      </div>

      {/* Constellation Fact Modal Popup */}
      {activeConstellation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05020a]/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 relative border-2 border-cyan-400 shadow-2xl animate-float space-y-4">
            <button
              onClick={() => {
                playButtonClick();
                setActiveConstellation(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-purple-900/80 hover:bg-purple-700 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{activeConstellation.name}</h3>
                <span className="text-xs font-bold text-cyan-300">NASA DEEP SPACE OBSERVATION</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed bg-purple-950/60 p-4 rounded-2xl border border-purple-800">
              {activeConstellation.fact}
            </p>

            <button
              onClick={() => {
                playButtonClick();
                setActiveConstellation(null);
              }}
              className="w-full btn-yellow-game py-3 rounded-2xl text-sm uppercase tracking-wide cursor-pointer"
            >
              CONTINUE STARGAZING
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
