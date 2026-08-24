import React, { useState } from 'react';
import { Rocket, Award, Download, Printer, Sparkles, CheckCircle2, Star, Shield, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playButtonClick, playButtonHover, playLaunchSequence } from '../utils/soundEngine';
import { createCertificate } from '../utils/api';

const ROCKET_COLORS = [
  { name: 'Solar Gold', hex: '#ffb700' },
  { name: 'Neon Cyan', hex: '#00e5ff' },
  { name: 'Cosmic Pink', hex: '#ff007f' },
  { name: 'Nebula Purple', hex: '#7c3aed' },
  { name: 'Emerald Bio', hex: '#00ff66' }
];

export default function Graduation({ cadet, score, onBack }) {
  const [rocketName, setRocketName] = useState(`${cadet?.name || 'Starlight'}-1`);
  const [selectedColor, setSelectedColor] = useState(ROCKET_COLORS[0]);
  
  const [isLaunching, setIsLaunching] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [launched, setLaunched] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  const handleStartLaunch = () => {
    playButtonClick();
    setIsLaunching(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          triggerRocketLiftoff();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerRocketLiftoff = async () => {
    playLaunchSequence();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });

    // Save certificate to backend SQLite3 database
    if (cadet?.id) {
      const res = await createCertificate(cadet.id, rocketName, selectedColor.hex);
      if (res.certificate) {
        setCertificateData(res.certificate);
      }
    }

    setTimeout(() => {
      setIsLaunching(false);
      setLaunched(true);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {!launched ? (
        /* Rocket Customizer & Launch Pad */
        <div className="glass-panel-glow rounded-3xl p-8 border-2 border-yellow-400/60 shadow-2xl text-center space-y-8 relative overflow-hidden">
          
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-yellow-950/80 border border-yellow-500/50 rounded-full px-4 py-1 text-xs font-black text-yellow-300">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>ASTRONAUT GRADUATION LAUNCH BAY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              CUSTOMIZE & LAUNCH YOUR SPACECRAFT
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto">
              Prepare for deep space exploration, Commander {cadet?.name}! Paint your shuttle and ignite engines.
            </p>
          </div>

          {/* Interactive Rocket Preview */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {isLaunching && (
              <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
            )}

            <div className={`relative z-10 transition-all duration-1000 ${
              isLaunching ? '-translate-y-24 scale-125 duration-2000' : 'animate-float'
            }`}>
              <div className="text-8xl filter drop-shadow-2xl" style={{ filter: `drop-shadow(0 0 20px ${selectedColor.hex})` }}>
                🚀
              </div>
              <div className="text-xs font-black text-white mt-2 bg-purple-950/90 border border-purple-500/40 px-3 py-1 rounded-full">
                {rocketName}
              </div>
            </div>
          </div>

          {/* Countdown Display */}
          {countdown !== null && (
            <div className="text-5xl font-black text-yellow-300 animate-bounce">
              {countdown > 0 ? `IGNITION IN ${countdown}...` : '🚀 LIFTOFF! FLYING TO THE STARS!'}
            </div>
          )}

          {/* Customization Form */}
          {!isLaunching && (
            <div className="space-y-6 max-w-md mx-auto text-left">
              <div>
                <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  Spacecraft Callsign
                </label>
                <input
                  type="text"
                  value={rocketName}
                  onChange={(e) => setRocketName(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-950/80 border-2 border-purple-600 rounded-2xl text-white font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  Engine Shielding Color
                </label>
                <div className="flex justify-center space-x-3">
                  {ROCKET_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        playButtonClick();
                        setSelectedColor(c);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor.name === c.name ? 'scale-125 border-white shadow-lg' : 'opacity-70 hover:opacity-100 border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartLaunch}
                onMouseEnter={playButtonHover}
                className="w-full btn-yellow-game py-4 rounded-2xl text-lg uppercase font-black tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-xl shadow-yellow-500/30"
              >
                <Rocket className="w-6 h-6 text-yellow-900" />
                <span>LAUNCH DEEP SPACE MISSION!</span>
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Printable Official NASA Cadet Certificate */
        <div className="space-y-6">
          <div id="certificate-print" className="glass-panel-glow rounded-3xl p-8 sm:p-12 border-4 border-yellow-400 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#13072b] to-[#090314] text-center space-y-6">
            
            {/* Corner Decorative Seals */}
            <div className="absolute top-4 left-4 text-3xl">🚀</div>
            <div className="absolute top-4 right-4 text-3xl">🌌</div>
            <div className="absolute bottom-4 left-4 text-3xl">🌱</div>
            <div className="absolute bottom-4 right-4 text-3xl">🧲</div>

            <div className="space-y-1">
              <p className="text-xs font-black tracking-widest text-cyan-300 uppercase">
                NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
              </p>
              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-200 to-purple-200">
                OFFICIAL ASTRONAUT CERTIFICATE
              </h1>
              <p className="text-xs text-purple-300 font-semibold tracking-wider uppercase">
                SPACE APPS ACADEMY GRADUATION DIPLOMA
              </p>
            </div>

            <div className="my-6">
              <p className="text-xs text-purple-200/80">This certifies that Space Cadet</p>
              <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 my-1">
                {cadet?.name || 'Astronaut Cadet'} {cadet?.avatar || '🧑‍🚀'}
              </h2>
              <p className="text-xs text-purple-200/80 max-w-md mx-auto">
                has successfully completed all 3 interactive training modules (Space Biology, Zero-G Physics, & Stargazer Astronomy) and is hereby commissioned as an
              </p>
              <div className="inline-block mt-3 bg-gradient-to-r from-purple-600 to-cyan-500 p-0.5 rounded-2xl shadow-lg">
                <div className="bg-[#0f0724] px-6 py-2 rounded-[14px]">
                  <span className="text-lg font-black text-cyan-300">ASTRONAUT COMMANDER</span>
                </div>
              </div>
            </div>

            {/* Badges Display */}
            <div className="flex justify-center space-x-6">
              <div className="flex flex-col items-center">
                <span className="text-3xl">🌱</span>
                <span className="text-[10px] font-bold text-emerald-300 mt-1">Bio-Botanist</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl">🧲</span>
                <span className="text-[10px] font-bold text-cyan-300 mt-1">Zero-G Master</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl">🌌</span>
                <span className="text-[10px] font-bold text-purple-300 mt-1">Stargazer</span>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-6 border-t border-purple-800/60 flex justify-between items-center text-[10px] font-bold text-purple-300">
              <div>ISSUED: {new Date().toLocaleDateString()}</div>
              <div>CERT ID: {certificateData?.id || 'CERT-NASA-2026'}</div>
              <div>SPACECRAFT: {rocketName}</div>
            </div>
          </div>

          {/* Certificate Actions */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => window.print()}
              className="flex-1 btn-yellow-game py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Printer className="w-5 h-5" />
              <span>PRINT OFFICIAL DIPLOMA</span>
            </button>
            <button
              onClick={onBack}
              className="flex-1 btn-cyan-game py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>RETURN TO ACADEMY HUB</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
