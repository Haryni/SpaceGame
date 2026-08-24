import React from 'react';
import { Volume2, VolumeX, Rocket, Award, Star, ArrowLeft, ShieldCheck } from 'lucide-react';
import { playButtonClick, playButtonHover } from '../utils/soundEngine';

export default function Navbar({ cadet, score, soundEnabled, onToggleSound, currentView, onNavigate }) {
  const getRankTitle = (scoreCount) => {
    if (scoreCount >= 300) return 'Commander 🚀';
    if (scoreCount >= 150) return 'Officer 🛰️';
    return 'Cadet 🧑‍🚀';
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-3 bg-[#0d061f]/85 backdrop-blur-md border-b-2 border-purple-900/60 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center space-x-3">
          {currentView !== 'dashboard' && (
            <button
              onClick={() => {
                playButtonClick();
                onNavigate('dashboard');
              }}
              onMouseEnter={playButtonHover}
              className="btn-cyan-game px-3 py-1.5 rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Academy Hub</span>
            </button>
          )}

          <div 
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => {
              playButtonClick();
              onNavigate('dashboard');
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#12082b] rounded-[14px] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-cyan-300 via-yellow-200 to-purple-300 bg-clip-text text-transparent">
                NASA SPACE ACADEMY
              </h1>
              <p className="text-[10px] text-purple-300/80 uppercase tracking-widest font-semibold">
                Astronaut Certification
              </p>
            </div>
          </div>
        </div>

        {/* Right: Cadet Status, Score, & Sound Toggle */}
        <div className="flex items-center space-x-3">
          
          {/* Cadet Rank Badge */}
          {cadet && (
            <div className="hidden sm:flex items-center space-x-2 bg-purple-950/80 border border-purple-700/50 rounded-2xl px-3 py-1.5">
              <span className="text-xl">{cadet.avatar || '🧑‍🚀'}</span>
              <div>
                <p className="text-xs font-bold text-cyan-200 leading-tight">{cadet.name}</p>
                <p className="text-[10px] font-semibold text-yellow-400">{getRankTitle(score)}</p>
              </div>
            </div>
          )}

          {/* Score Counter */}
          <div className="flex items-center space-x-1.5 bg-yellow-950/40 border border-yellow-500/40 px-3 py-1.5 rounded-2xl shadow-inner shadow-yellow-500/20">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin-slow" />
            <span className="text-sm font-black text-yellow-300">{score} PTS</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              playButtonClick();
              onToggleSound();
            }}
            onMouseEnter={playButtonHover}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-purple-900/60 border-purple-500/60 text-cyan-300 shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
}
