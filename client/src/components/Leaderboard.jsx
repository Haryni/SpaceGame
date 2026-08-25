import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Award, X, Sparkles, UserCheck } from 'lucide-react';
import { getLeaderboard } from '../utils/api';
import { playButtonClick } from '../utils/soundEngine';

export default function Leaderboard({ isOpen, onClose, currentCadetId }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getLeaderboard().then((data) => {
        setLeaderboard(data || []);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05020a]/80 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel-glow rounded-3xl p-6 sm:p-8 relative border-2 border-yellow-400/60 shadow-2xl animate-float space-y-6 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playButtonClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-purple-900/80 hover:bg-purple-700 text-white cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 p-0.5 shadow-lg shadow-yellow-500/30">
            <div className="w-full h-full bg-[#120826] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-7 h-7 text-yellow-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-cyan-300">
              ACADEMY HALL OF FAME
            </h2>
            <p className="text-xs text-purple-200/80">
              Top Astronaut Commanders who passed all certification modules!
            </p>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="text-center py-10 text-cyan-300 font-bold animate-pulse">
              LOADING CADET RECORDS FROM NASA DATABASE...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-purple-300">
              No cadets logged yet. Be the first to earn your Astronaut Certification!
            </div>
          ) : (
            leaderboard.map((item, index) => {
              const isCurrent = item.id === currentCadetId;
              return (
                <div
                  key={item.id || index}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    index === 0
                      ? 'bg-yellow-950/60 border-yellow-500/80 shadow-lg shadow-yellow-500/20'
                      : index === 1
                      ? 'bg-slate-900/80 border-slate-400/60'
                      : index === 2
                      ? 'bg-amber-950/40 border-amber-600/60'
                      : isCurrent
                      ? 'bg-cyan-950/60 border-cyan-400/80'
                      : 'bg-purple-950/40 border-purple-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-xl bg-purple-900/80 flex items-center justify-center font-black text-xs text-yellow-300">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>

                    <span className="text-2xl">{item.avatar || '🧑‍🚀'}</span>

                    <div>
                      <div className="text-sm font-black text-white flex items-center space-x-1.5">
                        <span>{item.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-semibold text-purple-300">
                        Badges Earned: {item.badges_count || item.badges || 3} / 3 🏅
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center space-x-1 font-black text-yellow-300 text-sm bg-yellow-950/60 px-3 py-1.5 rounded-xl border border-yellow-500/30">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>{item.score} PTS</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <button
          onClick={() => {
            playButtonClick();
            onClose();
          }}
          className="w-full btn-yellow-game py-3 rounded-2xl text-sm font-bold uppercase tracking-wider cursor-pointer"
        >
          CLOSE HALL OF FAME
        </button>

      </div>
    </div>
  );
}
