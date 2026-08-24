import React, { useState } from 'react';
import { Rocket, Sparkles, User, ShieldAlert } from 'lucide-react';
import { playButtonClick, playButtonHover } from '../utils/soundEngine';

const AVATARS = [
  { id: 'astro_cat', emoji: '🐱', label: 'Astro Cat' },
  { id: 'cosmic_bunny', emoji: '🐰', label: 'Cosmic Bunny' },
  { id: 'alien_explorer', emoji: '👽', label: 'Zorp Explorer' },
  { id: 'cadet_alex', emoji: '🧑‍🚀', label: 'Space Cadet' },
  { id: 'robo_scout', emoji: '🤖', label: 'Robo Scout' },
  { id: 'star_fox', emoji: '🦊', label: 'Star Fox' }
];

export default function LoginModal({ onLogin }) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your Cadet Name to start training!');
      return;
    }
    playButtonClick();
    onLogin(name.trim(), selectedAvatar.emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05020a]/80 backdrop-blur-lg">
      <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden border-2 border-cyan-400/50 shadow-2xl animate-float">
        
        {/* Decorative Space Lights */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-1 mb-3 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-[#0e0722] rounded-xl flex items-center justify-center">
              <Rocket className="w-8 h-8 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-200 to-purple-200">
            CADET REGISTRATION
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
            Welcome to the NASA Space Academy! Enter your name and choose your space avatar to earn your Astronaut Certification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cadet Name Input */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span>Cadet Callsign / Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Cadet Alex"
              className="w-full px-4 py-3 bg-purple-950/80 border-2 border-purple-600/60 rounded-2xl text-white font-bold placeholder-purple-400/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all text-center text-lg"
              maxLength={20}
            />
            {error && (
              <p className="text-xs text-pink-400 mt-1.5 font-semibold flex items-center justify-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              Select Astronaut Avatar
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatar.id === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      playButtonClick();
                      setSelectedAvatar(avatar);
                    }}
                    onMouseEnter={playButtonHover}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105'
                        : 'bg-purple-950/50 border-purple-800/60 opacity-70 hover:opacity-100 hover:border-purple-500'
                    }`}
                  >
                    <span className="text-2xl mb-1">{avatar.emoji}</span>
                    <span className="text-[10px] font-bold text-purple-200 truncate w-full text-center">
                      {avatar.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            onMouseEnter={playButtonHover}
            className="w-full btn-yellow-game py-3.5 rounded-2xl text-lg uppercase tracking-wide flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-900" />
            <span>ENTER SPACE ACADEMY</span>
          </button>
        </form>
      </div>
    </div>
  );
}
