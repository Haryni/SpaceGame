import React, { useState } from 'react';
import { BookOpen, X, Sprout, Move, Telescope, Sparkles, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { playButtonClick } from '../utils/soundEngine';

const MANUAL_PAGES = [
  {
    title: 'Module 1: Space Biology & Plant Survival',
    icon: '🌱',
    color: 'emerald',
    content: [
      {
        heading: 'Why do plants need gravity?',
        text: 'On Earth, plants use gravity to know which direction to send their roots (gravitropism). In microgravity on the Space Station, NASA uses directional LED lights to guide plant stems upward!'
      },
      {
        heading: 'What are Cosmic Rays?',
        text: 'Outer space is full of high-energy radiation from solar flares. Space greenhouse bio-domes use water jackets or lead-shielded glass to block 90%+ of radiation from damaging crop DNA.'
      },
      {
        heading: 'Watering in Zero-G',
        text: 'Without gravity, water forms floating bubbles instead of soaking into dirt! NASA uses special clay pillows ("Veggie hardware") that feed water directly to roots through tiny wicks.'
      }
    ]
  },
  {
    title: 'Module 2: Zero-G Physics & Newton\'s Laws',
    icon: '🧲',
    color: 'cyan',
    content: [
      {
        heading: 'Newton\'s First Law of Motion',
        text: 'An object at rest stays at rest, and an object in motion stays in motion with the exact same speed and direction unless acted upon by an external force!'
      },
      {
        heading: 'Why is friction zero in deep space?',
        text: 'On Earth, friction between tires and roads or air resistance slows objects down. Deep space has no air molecules, so a pushed cargo crate will drift infinitely until it hits a wall!'
      },
      {
        heading: 'Bouncing & Elastic Collisions',
        text: 'Magnetic elastic walls reflect cargo crates at the exact same angle they hit! Using wall bounces lets astronauts steer payload around obstacles.'
      }
    ]
  },
  {
    title: 'Module 3: Astronomy & Celestial Navigation',
    icon: '🌌',
    color: 'purple',
    content: [
      {
        heading: 'What is a Constellation?',
        text: 'A constellation is a group of stars that form a recognizable pattern or picture in the night sky. Ancient navigators used them like a giant cosmic map to sail ships across oceans!'
      },
      {
        heading: 'Betelgeuse the Red Supergiant',
        text: 'Located in Orion\'s shoulder, Betelgeuse is so gigantic that if placed at the center of our solar system, it would swallow Mercury, Venus, Earth, and Mars!'
      },
      {
        heading: 'Finding the North Star (Polaris)',
        text: 'By following a line drawn through the two pointer stars at the tip of the Big Dipper\'s bowl, you can always pinpoint Polaris, the North Star.'
      }
    ]
  }
];

export default function CadetManual({ isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const page = MANUAL_PAGES[currentPage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05020a]/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel-glow rounded-3xl p-6 sm:p-8 relative border-2 border-cyan-400/60 shadow-2xl animate-float space-y-6 max-h-[90vh] flex flex-col">
        
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-[#100727] rounded-[14px] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-cyan-300" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-yellow-200 to-purple-200">
              CADET FIELD MANUAL & SCIENCE GUIDE
            </h2>
            <p className="text-xs text-purple-200/80">
              NASA Astronaut Handbook: Study space biology, physics, and stargazing!
            </p>
          </div>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex space-x-2">
          {MANUAL_PAGES.map((p, idx) => (
            <button
              key={p.title}
              onClick={() => {
                playButtonClick();
                setCurrentPage(idx);
              }}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 border ${
                currentPage === idx
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-md'
                  : 'bg-purple-950/40 border-purple-800 text-purple-400 opacity-70'
              }`}
            >
              <span>{p.icon}</span>
              <span className="hidden sm:inline">Chapter {idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Chapter Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <span>{page.icon}</span>
            <span>{page.title}</span>
          </h3>

          <div className="space-y-3">
            {page.content.map((item, i) => (
              <div key={i} className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800 space-y-1">
                <div className="text-sm font-black text-yellow-300 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>{item.heading}</span>
                </div>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Navigation */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => {
              playButtonClick();
              setCurrentPage((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentPage === 0}
            className={`btn-cyan-game px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer ${
              currentPage === 0 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <span className="text-xs font-bold text-purple-300">
            Page {currentPage + 1} of {MANUAL_PAGES.length}
          </span>

          <button
            onClick={() => {
              playButtonClick();
              setCurrentPage((prev) => Math.min(MANUAL_PAGES.length - 1, prev + 1));
            }}
            disabled={currentPage === MANUAL_PAGES.length - 1}
            className={`btn-cyan-game px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer ${
              currentPage === MANUAL_PAGES.length - 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
