import React, { useState } from 'react';
import { Telescope, Award, Sparkles, Star, RotateCcw, ChevronRight, HelpCircle, ArrowLeft, BookOpen, Lightbulb, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playButtonClick, playStarChime, playBadgeUnlock } from '../utils/soundEngine';

const CONSTELLATIONS = [
  {
    id: 'orion',
    name: 'Orion the Hunter 🏹',
    category: 'Winter Constellation',
    description: 'One of the brightest and most recognizable constellations in the night sky across the world.',
    bestTime: 'December to February (Look South in Evening Sky)',
    stars: [
      { id: 1, name: 'Betelgeuse', x: 220, y: 110, color: '#ff4d4d', colorName: 'Red Supergiant (Cool - 3,500K)', fact: 'A giant red supergiant star 700 times larger than our Sun!', freq: 523.25 },
      { id: 2, name: 'Bellatrix', x: 380, y: 120, color: '#66ccff', colorName: 'Blue-White Giant (Hot - 22,000K)', fact: 'Known as the "Amazon Star" marking Orion\'s left shoulder.', freq: 659.25 },
      { id: 3, name: 'Alnitak', x: 260, y: 220, color: '#ffffff', colorName: 'Blue Supergiant', fact: 'The left star of Orion\'s famous 3-star Belt!', freq: 783.99 },
      { id: 4, name: 'Alnilam', x: 300, y: 220, color: '#00e5ff', colorName: 'Blue Supergiant', fact: 'The middle star of Orion\'s Belt, 2,000 light-years away.', freq: 830.61 },
      { id: 5, name: 'Mintaka', x: 340, y: 220, color: '#ffffff', colorName: 'Multiple Star System', fact: 'The right star of Orion\'s Belt, sitting almost on the celestial equator.', freq: 880.00 },
      { id: 6, name: 'Saiph', x: 240, y: 340, color: '#66ccff', colorName: 'Supergiant', fact: 'Marks Orion\'s right knee and glows with blue-white light.', freq: 987.77 },
      { id: 7, name: 'Rigel', x: 360, y: 350, color: '#00e5ff', colorName: 'Blue Supergiant (40,000x Sun\'s brightness)', fact: 'The brightest star in Orion, shining with dazzling blue intensity.', freq: 1046.50 }
    ],
    sequence: [1, 2, 5, 4, 3, 6, 7],
    quiz: {
      question: 'Which star in Orion is a Red Supergiant 700x larger than our Sun?',
      options: ['Rigel', 'Betelgeuse', 'Bellatrix', 'Polaris'],
      answerIndex: 1,
      explanation: 'Betelgeuse is a massive red supergiant! If placed at the center of our Solar System, it would reach past Mars!'
    }
  },
  {
    id: 'ursa_major',
    name: 'Ursa Major (Big Dipper) 🐻',
    category: 'Circumpolar (Visible All Year)',
    description: 'The Big Dipper is an asterism inside Ursa Major used for navigation for thousands of years.',
    bestTime: 'Spring (Look North)',
    stars: [
      { id: 1, name: 'Alkaid', x: 120, y: 100, color: '#00e5ff', colorName: 'Blue Main Sequence', fact: 'The tip of the Big Dipper handle, burning extremely hot!', freq: 523.25 },
      { id: 2, name: 'Mizar', x: 200, y: 130, color: '#66ccff', colorName: 'Double Star', fact: 'Mizar forms a famous double star system visible to the naked eye!', freq: 587.33 },
      { id: 3, name: 'Alioth', x: 280, y: 150, color: '#ffffff', colorName: 'White Star', fact: 'The brightest star in the entire Ursa Major constellation.', freq: 659.25 },
      { id: 4, name: 'Megrez', x: 350, y: 180, color: '#ffffff', colorName: 'White Main Sequence', fact: 'Joins the handle of the dipper to the bowl.', freq: 739.99 },
      { id: 5, name: 'Phecda', x: 360, y: 280, color: '#00e5ff', colorName: 'Blue-White Star', fact: 'Forms the bottom-left corner of the Dipper bowl.', freq: 783.99 },
      { id: 6, name: 'Merak', x: 480, y: 290, color: '#ffffff', colorName: 'White Subgiant', fact: 'Bottom pointer star used to navigate to the North Star.', freq: 880.00 },
      { id: 7, name: 'Dubhe', x: 470, y: 170, color: '#ffb700', colorName: 'Yellow-Orange Giant', fact: 'Top pointer star! Draw a line from Merak through Dubhe to find Polaris (North Star).', freq: 1046.50 }
    ],
    sequence: [1, 2, 3, 4, 5, 6, 7, 4],
    quiz: {
      question: 'Where do the pointer stars (Merak & Dubhe) point to?',
      options: ['The Moon', 'Polaris (North Star)', 'Mars', 'Sirius'],
      answerIndex: 1,
      explanation: 'Drawing an imaginary line from Merak through Dubhe points directly to Polaris, the North Star!'
    }
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia the Queen 👑',
    category: 'Northern Sky Constellation',
    description: 'Forms a distinctive "W" or "M" shape depending on the season and position in the sky.',
    bestTime: 'Autumn (Look High North)',
    stars: [
      { id: 1, name: 'Caph', x: 150, y: 280, color: '#ffb700', colorName: 'Yellow-White Giant', fact: 'The westernmost star of the "W" pattern.', freq: 659.25 },
      { id: 2, name: 'Schedar', x: 230, y: 320, color: '#ff9900', colorName: 'Orange Giant (Cooler Star)', fact: 'An orange giant star slightly cooler than our Sun but 40x larger!', freq: 783.99 },
      { id: 3, name: 'Gamma Cas', x: 320, y: 220, color: '#00e5ff', colorName: 'Eruptive Blue Variable', fact: 'The central star of the "W", spinning so fast it flattens at its poles!', freq: 880.00 },
      { id: 4, name: 'Ruchbah', x: 410, y: 270, color: '#ffffff', colorName: 'White Subgiant', fact: 'A eclipsing binary star system 99 light-years away.', freq: 987.77 },
      { id: 5, name: 'Segin', x: 480, y: 190, color: '#66ccff', colorName: 'Bright Blue-White Giant', fact: 'Marks the eastern tip of Queen Cassiopeia\'s crown.', freq: 1174.66 }
    ],
    sequence: [1, 2, 3, 4, 5],
    quiz: {
      question: 'What letter shape does Cassiopeia make in the autumn sky?',
      options: ['Letter "S"', 'Letter "W"', 'Letter "O"', 'Letter "Z"'],
      answerIndex: 1,
      explanation: 'Cassiopeia forms a prominent "W" (or "M") shape that is easy to spot in the northern night sky.'
    }
  },
  {
    id: 'leo',
    name: 'Leo the Lion 🦁',
    category: 'Spring Constellation',
    description: 'Resembles a crouching lion with a backwards question-mark shape forming its head (The Sickle).',
    bestTime: 'March to May (Look High South)',
    stars: [
      { id: 1, name: 'Regulus', x: 160, y: 300, color: '#00e5ff', colorName: 'Blue-White Quadruple Star', fact: 'The "Heart of the Lion", spinning at over 700,000 mph!', freq: 523.25 },
      { id: 2, name: 'Algieba', x: 220, y: 200, color: '#ffb700', colorName: 'Golden Binary System', fact: 'A stunning double star with a giant exoplanet orbiting it.', freq: 659.25 },
      { id: 3, name: 'Adhafera', x: 280, y: 140, color: '#ffffff', colorName: 'White Giant', fact: 'Forms the top curve of Leo\'s mane.', freq: 783.99 },
      { id: 4, name: 'Rasalas', x: 220, y: 110, color: '#ffb700', colorName: 'Orange Giant', fact: 'Marks the lion\'s snout.', freq: 880.00 },
      { id: 5, name: 'Zosma', x: 380, y: 220, color: '#ffffff', colorName: 'White Star', fact: 'Marks the lion\'s hip.', freq: 987.77 },
      { id: 6, name: 'Denebola', x: 480, y: 260, color: '#66ccff', colorName: 'Blue-White Star', fact: 'Means "Tail of the Lion" in Arabic.', freq: 1046.50 }
    ],
    sequence: [1, 2, 3, 4, 2, 5, 6],
    quiz: {
      question: 'What is the brightest star in Leo, known as the "Heart of the Lion"?',
      options: ['Polaris', 'Regulus', 'Vega', 'Betelgeuse'],
      answerIndex: 1,
      explanation: 'Regulus is the brightest star in Leo and one of the brightest stars in the night sky!'
    }
  },
  {
    id: 'cygnus',
    name: 'Cygnus the Swan 🦢',
    category: 'Summer Constellation',
    description: 'Also known as the Northern Cross, flying along the Milky Way starry band.',
    bestTime: 'July to September (Look Overhead)',
    stars: [
      { id: 1, name: 'Deneb', x: 300, y: 90, color: '#00e5ff', colorName: 'Blue-White Supergiant', fact: 'One of the most distant stars visible to the naked eye (2,600 light-years away)!', freq: 523.25 },
      { id: 2, name: 'Sadr', x: 300, y: 210, color: '#ffffff', colorName: 'Yellow Supergiant', fact: 'Sits at the heart of the Northern Cross, surrounded by glowing nebula clouds.', freq: 659.25 },
      { id: 3, name: 'Albireo', x: 300, y: 370, color: '#ffb700', colorName: 'Gold & Blue Double Star', fact: 'Famous in telescopes as a magnificent golden and topaz-blue twin star!', freq: 783.99 },
      { id: 4, name: 'Gienah', x: 170, y: 220, color: '#66ccff', colorName: 'Giant Star', fact: 'Marks the swan\'s left outstretched wing.', freq: 880.00 },
      { id: 5, name: 'Delta Cygni', x: 430, y: 200, color: '#00e5ff', colorName: 'Triple Star System', fact: 'Marks the swan\'s right wing tip.', freq: 1046.50 }
    ],
    sequence: [1, 2, 3, 4, 2, 5],
    quiz: {
      question: 'Which bright star marks the tail of Cygnus the Swan?',
      options: ['Deneb', 'Rigel', 'Sirius', 'Antares'],
      answerIndex: 0,
      explanation: 'Deneb marks the tail of Cygnus the Swan and is part of the famous Summer Triangle asterism!'
    }
  }
];

export default function ObservationDeck({ cadet, onCompleteModule, onBack }) {
  const [selectedConstellationIdx, setSelectedConstellationIdx] = useState(0);
  const [userSequence, setUserSequence] = useState([]);
  const [lastSelectedStar, setLastSelectedStar] = useState(null);
  const [discoveredConstellations, setDiscoveredConstellations] = useState([]);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const [showFactModal, setShowFactModal] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentConstellation = CONSTELLATIONS[selectedConstellationIdx];
  const targetSequence = currentConstellation.sequence;
  
  const currentStep = userSequence.length;
  const isCompleted = userSequence.length >= targetSequence.length;
  const nextTargetStarId = !isCompleted ? targetSequence[currentStep] : null;

  const handleStarClick = (star) => {
    playButtonClick();
    playStarChime(star.freq);

    if (isCompleted) {
      setLastSelectedStar(star);
      return;
    }

    if (star.id === nextTargetStarId) {
      const nextSeq = [...userSequence, star.id];
      setUserSequence(nextSeq);
      setLastSelectedStar(star);

      if (nextSeq.length >= targetSequence.length) {
        handleConstellationCompleted(currentConstellation.id);
      }
    } else {
      setLastSelectedStar(star);
    }
  };

  const handleConstellationCompleted = (constellationId) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (!discoveredConstellations.includes(constellationId)) {
      const nextDiscovered = [...discoveredConstellations, constellationId];
      setDiscoveredConstellations(nextDiscovered);

      if (nextDiscovered.length >= 3 && !badgeUnlocked) {
        setBadgeUnlocked(true);
        playBadgeUnlock();
        onCompleteModule(300, true);
      } else {
        onCompleteModule(100, false);
      }
    }
  };

  const handleResetCurrent = () => {
    playButtonClick();
    setUserSequence([]);
    setLastSelectedStar(null);
    setShowFactModal(false);
    setQuizAnswered(null);
    setQuizSubmitted(false);
  };

  const handleNextConstellation = () => {
    playButtonClick();
    const nextIdx = (selectedConstellationIdx + 1) % CONSTELLATIONS.length;
    setSelectedConstellationIdx(nextIdx);
    setUserSequence([]);
    setLastSelectedStar(null);
    setShowFactModal(false);
    setQuizAnswered(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-3xl border-2 border-purple-500/40 shadow-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-700 text-purple-200 border border-purple-500/40 transition cursor-pointer"
            title="Return to Command Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Telescope className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-black text-white tracking-wide">STARGAZER ACADEMY (CONSTELLATIONS)</h2>
            </div>
            <p className="text-xs text-purple-200/80 mt-1">
              Connect stars in sequence to map constellations, explore star temperatures & learn real sky navigation!
            </p>
          </div>
        </div>

        {badgeUnlocked && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-purple-500/30 border-2 border-yellow-400/80 px-4 py-2 rounded-2xl flex items-center space-x-2.5 animate-pulse shadow-lg">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-xs font-black text-yellow-300">MASTER STARGAZER BADGE!</div>
              <div className="text-[10px] text-purple-200 font-bold">+300 CADET SCORES UNLOCKED</div>
            </div>
          </div>
        )}
      </div>

      {/* Constellation Selector Tabs & Progress Bar */}
      <div className="bg-purple-950/70 p-4 rounded-3xl border border-purple-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              CONSTELLATIONS MAPPED: {discoveredConstellations.length} / {CONSTELLATIONS.length}
            </span>
          </div>

          <div className="text-xs text-purple-300 font-medium">
            Select a target constellation to start mapping:
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CONSTELLATIONS.map((c, idx) => {
            const isFound = discoveredConstellations.includes(c.id);
            const isCurrent = idx === selectedConstellationIdx;
            return (
              <button
                key={c.id}
                onClick={() => {
                  playButtonClick();
                  setSelectedConstellationIdx(idx);
                  setUserSequence([]);
                  setLastSelectedStar(null);
                  setShowFactModal(false);
                  setQuizAnswered(null);
                  setQuizSubmitted(false);
                }}
                className={`px-3 py-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/50'
                    : isFound
                    ? 'bg-purple-900/40 border-purple-500/60 text-purple-200 hover:bg-purple-800/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <span className="truncate">{c.name.split(' ')[0]}</span>
                <span>{isFound ? '✅' : isCurrent ? '📍' : '🔒'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Telescope Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: Interactive Star Map Viewport */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border-2 border-purple-500/30 space-y-4 relative overflow-hidden">
          
          {/* Header Info Banner */}
          <div className="flex items-center justify-between bg-purple-950/80 p-3 rounded-2xl border border-purple-800/60">
            <div>
              <h3 className="text-lg font-black text-white">{currentConstellation.name}</h3>
              <span className="text-xs text-purple-300 font-semibold">{currentConstellation.category} • {currentConstellation.bestTime}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetCurrent}
                className="p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-300 border border-purple-700/60 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                title="Reset Lines"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Star Map Graphic Display Area */}
          <div className="relative w-full h-[380px] bg-[#040112] rounded-2xl border-2 border-purple-700/50 overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Background Starfield Canvas Grid */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#6b21a8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Animated Ambient Space Glow */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl" />

            {/* SVG Connecting Lines Render */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              
              {/* Target Outline Guide (Subtle Dashed Hint Line) */}
              {targetSequence.map((starId, i) => {
                if (i === 0) return null;
                const prevStar = currentConstellation.stars.find(s => s.id === targetSequence[i - 1]);
                const currStar = currentConstellation.stars.find(s => s.id === starId);
                if (!prevStar || !currStar) return null;
                return (
                  <line
                    key={`hint-${i}`}
                    x1={prevStar.x}
                    y1={prevStar.y}
                    x2={currStar.x}
                    y2={currStar.y}
                    stroke="rgba(168, 85, 247, 0.25)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Connected Active User Laser Lines */}
              {userSequence.map((starId, i) => {
                if (i === 0) return null;
                const prevStar = currentConstellation.stars.find(s => s.id === userSequence[i - 1]);
                const currStar = currentConstellation.stars.find(s => s.id === starId);
                if (!prevStar || !currStar) return null;
                return (
                  <line
                    key={`connected-${i}`}
                    x1={prevStar.x}
                    y1={prevStar.y}
                    x2={currStar.x}
                    y2={currStar.y}
                    stroke="#00e5ff"
                    strokeWidth="3.5"
                    className="animate-pulse"
                    style={{
                      filter: 'drop-shadow(0px 0px 8px #00e5ff)'
                    }}
                  />
                );
              })}
            </svg>

            {/* Render Star Nodes */}
            {currentConstellation.stars.map((star) => {
              const isTargetNext = star.id === nextTargetStarId;
              const isConnected = userSequence.includes(star.id);

              return (
                <button
                  key={star.id}
                  onClick={() => handleStarClick(star)}
                  style={{ left: `${star.x}px`, top: `${star.y}px` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none cursor-pointer`}
                >
                  {/* Glowing Target Pulsing Reticle */}
                  {isTargetNext && (
                    <div className="absolute -inset-3 rounded-full border-2 border-yellow-400 animate-ping opacity-75 pointer-events-none" />
                  )}
                  {isTargetNext && (
                    <div className="absolute -inset-4 rounded-full border border-cyan-400/80 animate-spin opacity-90 pointer-events-none" />
                  )}

                  {/* Outer Glow Halo */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isConnected
                        ? 'bg-cyan-500/20 ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50'
                        : isTargetNext
                        ? 'bg-yellow-500/30 ring-2 ring-yellow-400 animate-pulse'
                        : 'bg-purple-900/30 hover:bg-purple-700/40 ring-1 ring-purple-500/40'
                    }`}
                  >
                    {/* Star Core Center Dot */}
                    <div
                      className="w-4 h-4 rounded-full shadow-md transition-transform group-hover:scale-125 flex items-center justify-center text-[10px] font-black text-slate-950"
                      style={{
                        backgroundColor: star.color,
                        boxShadow: `0 0 12px ${star.color}`
                      }}
                    >
                      {star.id}
                    </div>
                  </div>

                  {/* Star Name Tooltip Tag */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-11 bg-purple-950/90 border border-purple-600/70 text-[10px] font-bold text-slate-200 px-2 py-0.5 rounded-md whitespace-nowrap opacity-90 group-hover:opacity-100 shadow-md pointer-events-none">
                    {star.name}
                  </div>
                </button>
              );
            })}

            {/* Instruction Overlay Pill */}
            <div className="absolute bottom-4 left-4 right-4 bg-purple-950/90 backdrop-blur-md border border-purple-600/60 p-2.5 rounded-2xl flex items-center justify-between text-xs text-purple-200">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>
                  {!isCompleted ? (
                    <span>
                      Tap <strong className="text-yellow-300">Star #{nextTargetStarId} ({currentConstellation.stars.find(s => s.id === nextTargetStarId)?.name})</strong> to draw the next star line!
                    </span>
                  ) : (
                    <span className="text-cyan-300 font-bold">
                      🎉 Constellation Fully Calibrated! Explore its science facts below.
                    </span>
                  )}
                </span>
              </div>

              {isCompleted && (
                <button
                  onClick={() => setShowFactModal(true)}
                  className="btn-yellow-game text-[11px] px-3 py-1 rounded-xl flex items-center space-x-1 cursor-pointer font-bold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Science Fact</span>
                </button>
              )}
            </div>

          </div>

          {/* Star Fact Card Footer */}
          {lastSelectedStar && (
            <div className="bg-purple-950/80 border border-cyan-500/40 p-4 rounded-2xl space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-cyan-300 flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>Star Inspection: {lastSelectedStar.name}</span>
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-purple-900 border border-purple-700 text-purple-200">
                  {lastSelectedStar.colorName}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {lastSelectedStar.fact}
              </p>
            </div>
          )}

        </div>

        {/* Right 1-Col: NASA Science & Star Temperature Guide Panel */}
        <div className="glass-panel rounded-3xl p-5 border-2 border-purple-500/30 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            {/* Panel Title */}
            <div className="flex items-center space-x-2 border-b border-purple-800 pb-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">ASTRONAUT FIELD NOTES</h3>
            </div>

            {/* Constellation Fact Overview */}
            <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-700/50 space-y-2">
              <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wide">ABOUT THIS CONSTELLATION</h4>
              <p className="text-xs text-purple-100 leading-relaxed">
                {currentConstellation.description}
              </p>
              <div className="text-[11px] text-cyan-300 font-semibold pt-1">
                📍 <strong>Best Viewing Time:</strong> {currentConstellation.bestTime}
              </div>
            </div>

            {/* Star Color Temperature Science Guide */}
            <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-700/50 space-y-2.5">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">WHY DO STARS HAVE DIFFERENT COLORS?</h4>
              
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between bg-purple-900/40 p-2 rounded-xl border border-purple-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
                    <span className="font-bold text-white">Blue / White Stars</span>
                  </div>
                  <span className="text-cyan-300 font-black">Hottest (10,000K+)</span>
                </div>

                <div className="flex items-center justify-between bg-purple-900/40 p-2 rounded-xl border border-purple-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#ffb700] shadow-[0_0_8px_#ffb700]" />
                    <span className="font-bold text-white">Yellow Stars (Our Sun)</span>
                  </div>
                  <span className="text-yellow-400 font-black">Medium (~6,000K)</span>
                </div>

                <div className="flex items-center justify-between bg-purple-900/40 p-2 rounded-xl border border-purple-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff4d4d] shadow-[0_0_8px_#ff4d4d]" />
                    <span className="font-bold text-white">Red Supergiants</span>
                  </div>
                  <span className="text-red-400 font-black">Coolest (~3,500K)</span>
                </div>
              </div>
            </div>

            {/* Quiz Check Mini Widget */}
            {isCompleted && (
              <div className="bg-gradient-to-b from-cyan-950/80 to-purple-950/90 p-4 rounded-2xl border border-cyan-500/50 space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black text-cyan-300 uppercase">CADET KNOWLEDGE CHECK</span>
                </div>

                <p className="text-xs text-white font-semibold">
                  {currentConstellation.quiz.question}
                </p>

                <div className="grid grid-cols-1 gap-1.5">
                  {currentConstellation.quiz.options.map((opt, i) => {
                    const isSelected = quizAnswered === i;
                    const isCorrect = i === currentConstellation.quiz.answerIndex;
                    return (
                      <button
                        key={i}
                        disabled={quizSubmitted}
                        onClick={() => {
                          playButtonClick();
                          setQuizAnswered(i);
                          setQuizSubmitted(true);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          quizSubmitted && isCorrect
                            ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200'
                            : quizSubmitted && isSelected && !isCorrect
                            ? 'bg-red-500/30 border-2 border-red-400 text-red-200'
                            : isSelected
                            ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                            : 'bg-purple-900/50 border border-purple-700/60 text-purple-200 hover:bg-purple-800/60'
                        }`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-[11px] text-cyan-200 bg-purple-950 p-2.5 rounded-xl border border-cyan-700/60 leading-relaxed">
                    {currentConstellation.quiz.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next Level Button */}
          <button
            onClick={handleNextConstellation}
            className="w-full btn-cyan-game py-3 rounded-2xl text-xs uppercase tracking-wider font-black flex items-center justify-center space-x-2 cursor-pointer shadow-lg mt-4"
          >
            <span>EXPLORE NEXT CONSTELLATION</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Modal Popup Science Celebration Card */}
      {showFactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05020a]/85 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 relative border-2 border-cyan-400 shadow-2xl animate-float space-y-4">
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl">
                🌟
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{currentConstellation.name}</h3>
                <span className="text-xs font-bold text-cyan-300">CONSTELLATION DIPLOMA</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed bg-purple-950/80 p-4 rounded-2xl border border-purple-800">
              {currentConstellation.description}
            </p>

            <button
              onClick={() => {
                playButtonClick();
                setShowFactModal(false);
              }}
              className="w-full btn-yellow-game py-3 rounded-2xl text-xs font-black uppercase tracking-wide cursor-pointer"
            >
              CONTINUE STARGAZING
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
