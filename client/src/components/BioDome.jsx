import React, { useState, useEffect } from 'react';
import { Sprout, ShieldAlert, Award, Sparkles, CheckCircle2, RotateCcw, Info, ArrowLeft, Sun, Droplets, Shield, Orbit } from 'lucide-react';
import { playButtonClick, playButtonHover, playStarChime, playBadgeUnlock } from '../utils/soundEngine';

const CROPS = [
  {
    id: 'potato',
    name: 'Space Potato 🥔',
    desc: 'Sturdy root crop rich in carbohydrates, ideal for long Moon bases.',
    targetGravity: [0.10, 0.40],
    targetShield: [70, 100],
    targetWater: [50, 80],
    fact: 'NASA tested potatoes in simulated Martian soil and found they can thrive under controlled LED lights!'
  },
  {
    id: 'algae',
    name: 'Micro-Algae 🦠',
    desc: 'Fast-growing bio-oxygen generator that consumes CO2 rapidly.',
    targetGravity: [0.0, 0.20],
    targetShield: [80, 100],
    targetWater: [80, 100],
    fact: 'Algae yields 10x more oxygen per square meter than land trees and provides rich astronaut superfood nutrients.'
  },
  {
    id: 'lettuce',
    name: 'Lunar Lettuce 🥬',
    desc: 'Fresh leafy greens rich in antioxidants to protect astronaut eyes from cosmic ray glare.',
    targetGravity: [0.15, 0.50],
    targetShield: [60, 90],
    targetWater: [45, 75],
    fact: 'Astronauts on the ISS ate the first space-grown Red Romaine lettuce grown in the Veggie chamber!'
  }
];

export default function BioDome({ cadet, onCompleteModule, onBack }) {
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);
  const [gravity, setGravity] = useState(0.16); // Moon gravity default
  const [shielding, setShielding] = useState(40); // Intentional initial warning
  const [water, setWater] = useState(60);
  
  const [plantHealth, setPlantHealth] = useState(50);
  const [survivalTimer, setSurvivalTimer] = useState(0);
  const [completedCrops, setCompletedCrops] = useState([]);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);

  // Dynamic simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      let penalty = 0;
      
      // Gravity evaluation
      if (gravity < selectedCrop.targetGravity[0] || gravity > selectedCrop.targetGravity[1]) {
        penalty += 12;
      }
      
      // Radiation evaluation
      if (shielding < selectedCrop.targetShield[0]) {
        penalty += 25;
      }

      // Water evaluation
      if (water < selectedCrop.targetWater[0] || water > selectedCrop.targetWater[1]) {
        penalty += 15;
      }

      const calculatedHealth = Math.max(0, Math.min(100, 100 - penalty));
      setPlantHealth(calculatedHealth);

      // Timer for optimal survival
      if (calculatedHealth >= 80) {
        setSurvivalTimer((prev) => {
          const nextTimer = prev + 1;
          if (nextTimer >= 10 && !completedCrops.includes(selectedCrop.id)) {
            const nextCompleted = [...completedCrops, selectedCrop.id];
            setCompletedCrops(nextCompleted);
            playStarChime(987.77);

            if (nextCompleted.length >= 2 && !badgeUnlocked) {
              setBadgeUnlocked(true);
              playBadgeUnlock();
              onCompleteModule(300, true);
            }
          }
          return nextTimer;
        });
      } else {
        setSurvivalTimer(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gravity, shielding, water, selectedCrop, completedCrops, badgeUnlocked, onCompleteModule]);

  // Determine plant status message & state
  const getPlantVisualState = () => {
    if (shielding < selectedCrop.targetShield[0]) {
      return { status: 'RADIOACTIVE WILT ☣️', color: 'text-pink-400', alert: 'Radiation shielding is too low! cosmic rays are turning leaves brown!' };
    }
    if (water < selectedCrop.targetWater[0]) {
      return { status: 'DROUGHT WILTING 🍂', color: 'text-amber-400', alert: 'Soil is dry! Increase Water Pump flow!' };
    }
    if (water > selectedCrop.targetWater[1]) {
      return { status: 'FLOODED ROOTS 🌊', color: 'text-blue-400', alert: 'Too much water! Roots are drowning in microgravity!' };
    }
    if (gravity < selectedCrop.targetGravity[0] || gravity > selectedCrop.targetGravity[1]) {
      return { status: 'GRAVITY STRESS 🌌', color: 'text-purple-300', alert: 'Adjust gravity slider to crop microclimate optimal zone!' };
    }
    return { status: 'LUSH BIOLUMINESCENT BLOOM ✨', color: 'text-emerald-300', alert: 'Environment is OPTIMAL! Keep parameters stable to harvest!' };
  };

  const visualState = getPlantVisualState();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-3xl border-2 border-emerald-500/40">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">THE BIO-DOME (SPACE BIOLOGY)</h2>
            <p className="text-xs text-purple-200/80">
              Manage environmental controls to keep crops alive under extreme orbital radiation & gravity!
            </p>
          </div>
        </div>

        {badgeUnlocked && (
          <div className="bg-emerald-500/20 border-2 border-emerald-400 px-4 py-2 rounded-2xl flex items-center space-x-2 animate-bounce">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-black text-emerald-300">BIO-BOTANIST BADGE UNLOCKED!</span>
          </div>
        )}
      </div>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Bio-Dome Visualizer (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col items-center justify-between border-2 border-emerald-500/30 relative overflow-hidden">
          
          {/* Crop Selector Tabs */}
          <div className="flex space-x-2 w-full mb-4">
            {CROPS.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              const isDone = completedCrops.includes(crop.id);
              return (
                <button
                  key={crop.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedCrop(crop);
                    setSurvivalTimer(0);
                  }}
                  onMouseEnter={playButtonHover}
                  className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 border ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/30'
                      : 'bg-purple-950/40 border-purple-800 text-purple-300 opacity-75'
                  }`}
                >
                  <span>{crop.name.split(' ')[0]}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
                </button>
              );
            })}
          </div>

          {/* Plant Dome graphic preview */}
          <div className="relative w-64 h-64 my-4 flex items-center justify-center">
            {/* Dome Glass Shell */}
            <div className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
              plantHealth >= 80 ? 'border-emerald-400/80 shadow-2xl shadow-emerald-500/40' : 'border-pink-500/60 shadow-xl shadow-pink-500/30'
            } bg-gradient-to-b from-cyan-500/10 via-purple-900/30 to-emerald-900/40 backdrop-blur-sm`} />

            {/* Plant Icon & Animation */}
            <div className={`relative z-10 text-center transition-all duration-500 ${
              plantHealth >= 80 ? 'scale-110 animate-float' : plantHealth < 40 ? 'scale-90 grayscale opacity-60' : 'scale-100'
            }`}>
              <div className="text-7xl mb-2 filter drop-shadow-lg">
                {selectedCrop.id === 'potato' ? '🥔' : selectedCrop.id === 'algae' ? '🦠' : '🥬'}
              </div>
              <div className="text-xs font-black tracking-wide text-white uppercase bg-purple-950/80 border border-purple-500/40 px-3 py-1 rounded-full">
                {selectedCrop.name}
              </div>
            </div>
          </div>

          {/* Health Bar */}
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-purple-200">BIO-HEALTH SCORE</span>
              <span className={visualState.color}>{plantHealth}%</span>
            </div>
            <div className="w-full h-4 bg-purple-950 rounded-full overflow-hidden border border-purple-700/50 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  plantHealth >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-300' : plantHealth >= 40 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-pink-600 to-red-500 animate-pulse'
                }`}
                style={{ width: `${plantHealth}%` }}
              />
            </div>
          </div>

          {/* Alert Box */}
          <div className={`mt-4 w-full p-3 rounded-2xl border text-xs font-semibold text-center ${
            plantHealth >= 80 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-pink-950/60 border-pink-500/50 text-pink-200 animate-pulse'
          }`}>
            {visualState.alert}
          </div>

          {/* Optimal Harvest Progress Timer */}
          <div className="mt-3 w-full bg-purple-950/80 border border-purple-700/50 rounded-xl p-2 flex items-center justify-between text-xs font-bold text-cyan-300">
            <span>HARVEST STABILITY:</span>
            <span>{survivalTimer} / 10 SEC</span>
          </div>

        </div>

        {/* Right: Controls & Sliders (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-6 border-2 border-emerald-500/30">
          
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white flex items-center space-x-2">
              <Sun className="w-5 h-5 text-yellow-400" />
              <span>ENVIRONMENT CONTROL CONSOLE</span>
            </h3>
            <p className="text-xs text-purple-200/80">
              Tune parameters to reach optimal ranges: Gravity ({selectedCrop.targetGravity[0]} - {selectedCrop.targetGravity[1]}G), Radiation Shield ({selectedCrop.targetShield[0]}%+), Water ({selectedCrop.targetWater[0]} - {selectedCrop.targetWater[1]}%).
            </p>
          </div>

          {/* Slider 1: Gravity */}
          <div className="space-y-2 bg-purple-950/50 p-4 rounded-2xl border border-purple-800/60">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-cyan-300">
                <Orbit className="w-4 h-4 text-cyan-400" />
                <span>GRAVITY LEVEL</span>
              </span>
              <span className="text-yellow-400 bg-yellow-950 px-2 py-0.5 rounded-lg border border-yellow-500/40">
                {gravity.toFixed(2)}G
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.02"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-purple-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-300/70 font-semibold">
              <span>0.0G (Zero-G)</span>
              <span>0.16G (Moon)</span>
              <span>0.38G (Mars)</span>
              <span>1.0G (Earth)</span>
            </div>
          </div>

          {/* Slider 2: Radiation Shielding */}
          <div className="space-y-2 bg-purple-950/50 p-4 rounded-2xl border border-purple-800/60">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-pink-300">
                <Shield className="w-4 h-4 text-pink-400" />
                <span>RADIATION SHIELDING</span>
              </span>
              <span className="text-pink-400 bg-pink-950 px-2 py-0.5 rounded-lg border border-pink-500/40">
                {shielding}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={shielding}
              onChange={(e) => setShielding(parseInt(e.target.value))}
              className="w-full accent-pink-400 h-2 bg-purple-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-300/70 font-semibold">
              <span>0% (Solar Storm)</span>
              <span>50% (Standard)</span>
              <span>100% (Lead Hydro Shield)</span>
            </div>
          </div>

          {/* Slider 3: Water & Nutrient Flow */}
          <div className="space-y-2 bg-purple-950/50 p-4 rounded-2xl border border-purple-800/60">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-blue-300">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>WATER & NUTRIENT PUMP</span>
              </span>
              <span className="text-blue-400 bg-blue-950 px-2 py-0.5 rounded-lg border border-blue-500/40">
                {water}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={water}
              onChange={(e) => setWater(parseInt(e.target.value))}
              className="w-full accent-blue-400 h-2 bg-purple-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-purple-300/70 font-semibold">
              <span>0% (Dry Drought)</span>
              <span>60% (Optimal)</span>
              <span>100% (Flooded)</span>
            </div>
          </div>

          {/* NASA Fun Fact Box */}
          <div className="bg-purple-900/40 border border-purple-700/50 p-4 rounded-2xl flex items-start space-x-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-cyan-300 uppercase">NASA Space Biology Fact</div>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                {selectedCrop.fact}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
