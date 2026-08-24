import React from 'react';
import { Sprout, Move, Telescope, Rocket, Award, CheckCircle2, Lock, Star, ChevronRight, Trophy } from 'lucide-react';
import { playButtonClick, playButtonHover } from '../utils/soundEngine';

export default function Dashboard({ cadet, progress, onSelectModule, onLaunchMission }) {
  const getModuleStatus = (moduleId) => {
    const p = progress.find((item) => item.module_id === moduleId);
    return {
      completed: p ? p.completed === 1 || p.badge_unlocked === 1 : false,
      score: p ? p.score : 0
    };
  };

  const bioStatus = getModuleStatus('biodome');
  const cargoStatus = getModuleStatus('cargobay');
  const obsStatus = getModuleStatus('observation');

  const totalBadges = [bioStatus, cargoStatus, obsStatus].filter((s) => s.completed).length;
  const isReadyForLaunch = totalBadges >= 3;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden glass-panel-glow rounded-3xl p-6 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-purple-500/40">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center space-x-2 bg-purple-900/60 border border-purple-500/50 rounded-full px-3 py-1 text-xs font-bold text-cyan-300">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span>CERTIFICATION ACADEMY PROGRESS: {totalBadges} / 3 MODULES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-cyan-300">{cadet?.name || 'Cadet'}</span>! {cadet?.avatar || '🧑‍🚀'}
          </h2>

          <p className="text-sm text-purple-200/90 leading-relaxed">
            To graduate as an Astronaut Commander and launch your deep space mission, pass all 3 interactive training modules below!
          </p>
        </div>

        {/* Badge Meter Display */}
        <div className="flex items-center space-x-3 sm:space-x-4 z-10 bg-purple-950/70 p-4 rounded-2xl border border-purple-700/50 shadow-inner">
          <div className={`flex flex-col items-center p-2 rounded-xl border ${bioStatus.completed ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-900/40 border-slate-700 opacity-50'}`}>
            <span className="text-2xl">🌱</span>
            <span className="text-[10px] font-bold mt-1">BIO</span>
          </div>

          <div className={`flex flex-col items-center p-2 rounded-xl border ${cargoStatus.completed ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/40 border-slate-700 opacity-50'}`}>
            <span className="text-2xl">📦</span>
            <span className="text-[10px] font-bold mt-1">PHYSICS</span>
          </div>

          <div className={`flex flex-col items-center p-2 rounded-xl border ${obsStatus.completed ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-slate-900/40 border-slate-700 opacity-50'}`}>
            <span className="text-2xl">🌌</span>
            <span className="text-[10px] font-bold mt-1">STARS</span>
          </div>
        </div>
      </div>

      {/* 3 Training Modules Grid (Ref: Module 1, Module 2, Module 3) */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span>TRAINING MODULES</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: Bio-Dome */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border-2 border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
            {bioStatus.completed && (
              <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-400/60 rounded-full px-2.5 py-1 flex items-center space-x-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PASSED</span>
              </div>
            )}

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 p-0.5 mb-4 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0d1f18] rounded-[14px] flex items-center justify-center">
                  <Sprout className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">MODULE 1</div>
              <h4 className="text-2xl font-black text-white mb-2">The Bio-Dome</h4>
              <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                Learn how gravity, radiation shields, and water affect living crops in an orbital space greenhouse.
              </p>
            </div>

            <button
              onClick={() => {
                playButtonClick();
                onSelectModule('biodome');
              }}
              onMouseEnter={playButtonHover}
              className="w-full btn-yellow-game py-3 rounded-2xl text-sm flex items-center justify-center space-x-2 cursor-pointer mt-4"
            >
              <span>{bioStatus.completed ? 'REPLAY BIO-DOME' : 'START MODULE 1'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 2: Cargo Bay */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
            {cargoStatus.completed && (
              <div className="absolute top-4 right-4 bg-cyan-500/20 border border-cyan-400/60 rounded-full px-2.5 py-1 flex items-center space-x-1 text-xs font-bold text-cyan-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PASSED</span>
              </div>
            )}

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 p-0.5 mb-4 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#071927] rounded-[14px] flex items-center justify-center">
                  <Move className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">MODULE 2</div>
              <h4 className="text-2xl font-black text-white mb-2">Zero-G Cargo Bay</h4>
              <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                Master Newton's 1st Law of Physics! Push crates across friction-free space into docking bays.
              </p>
            </div>

            <button
              onClick={() => {
                playButtonClick();
                onSelectModule('cargobay');
              }}
              onMouseEnter={playButtonHover}
              className="w-full btn-cyan-game py-3 rounded-2xl text-sm flex items-center justify-center space-x-2 cursor-pointer mt-4"
            >
              <span>{cargoStatus.completed ? 'REPLAY CARGO BAY' : 'START MODULE 2'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 3: Observation Deck */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
            {obsStatus.completed && (
              <div className="absolute top-4 right-4 bg-purple-500/20 border border-purple-400/60 rounded-full px-2.5 py-1 flex items-center space-x-1 text-xs font-bold text-purple-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PASSED</span>
              </div>
            )}

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 p-0.5 mb-4 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#1b082d] rounded-[14px] flex items-center justify-center">
                  <Telescope className="w-7 h-7 text-purple-300 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">MODULE 3</div>
              <h4 className="text-2xl font-black text-white mb-2">Observation Deck</h4>
              <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                Pan across the 2D night sky, connect constellations like Orion, and calibrate the navigation computer.
              </p>
            </div>

            <button
              onClick={() => {
                playButtonClick();
                onSelectModule('observation');
              }}
              onMouseEnter={playButtonHover}
              className="w-full btn-purple-game py-3 rounded-2xl text-sm flex items-center justify-center space-x-2 cursor-pointer mt-4"
            >
              <span>{obsStatus.completed ? 'REPLAY STAR TOUR' : 'START MODULE 3'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mission Launch Banner / Graduation Button */}
      <div className={`p-8 rounded-3xl border-2 transition-all relative overflow-hidden ${
        isReadyForLaunch
          ? 'glass-panel-glow border-yellow-400 shadow-2xl animate-pulse-glow'
          : 'glass-panel border-purple-900/60 opacity-90'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-yellow-300 bg-yellow-950/60 border border-yellow-500/40 rounded-full px-3 py-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>FINAL GRADUATION CEREMONY</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {isReadyForLaunch ? '🎉 ACADEMY GRADUATION READY!' : 'LOCK & LAUNCH YOUR MISSION'}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-lg">
              {isReadyForLaunch
                ? 'Congratulations Cadet! You have earned all 3 certification badges. Build your rocket and launch into deep space!'
                : `Complete all 3 training modules to unlock your Virtual Rocket Launch and official NASA Cadet Certificate! (${totalBadges}/3 Badges Earned)`}
            </p>
          </div>

          <button
            onClick={() => {
              playButtonClick();
              onLaunchMission();
            }}
            onMouseEnter={playButtonHover}
            className={`px-8 py-4 rounded-2xl font-black text-lg tracking-wide uppercase flex items-center space-x-3 transition-all cursor-pointer ${
              isReadyForLaunch
                ? 'btn-yellow-game scale-105 animate-bounce'
                : 'btn-cyan-game opacity-90'
            }`}
          >
            <Rocket className="w-6 h-6 text-yellow-900" />
            <span>{isReadyForLaunch ? 'GRADUATE & LAUNCH ROCKET 🚀' : 'MISSION LAUNCH BAY'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
