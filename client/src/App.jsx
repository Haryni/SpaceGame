import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';
import BioDome from './components/BioDome';
import CargoBay from './components/CargoBay';
import ObservationDeck from './components/ObservationDeck';
import Graduation from './components/Graduation';
import { loginCadet, updateModuleProgress } from './utils/api';
import { toggleSound, isSoundEnabled } from './utils/soundEngine';

export default function App() {
  const [cadet, setCadet] = useState(null);
  const [progress, setProgress] = useState([
    { module_id: 'biodome', completed: 0, score: 0, badge_unlocked: 0 },
    { module_id: 'cargobay', completed: 0, score: 0, badge_unlocked: 0 },
    { module_id: 'observation', completed: 0, score: 0, badge_unlocked: 0 }
  ]);
  const [totalScore, setTotalScore] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [soundActive, setSoundActive] = useState(true);

  // Restore cadet session from localStorage if available
  useEffect(() => {
    const savedCadet = localStorage.getItem('nasa_academy_cadet');
    if (savedCadet) {
      try {
        const parsed = JSON.parse(savedCadet);
        setCadet(parsed.cadet);
        if (parsed.progress) setProgress(parsed.progress);
      } catch (e) {}
    }
  }, []);

  const handleLogin = async (name, avatar) => {
    const data = await loginCadet(name, avatar);
    if (data.cadet) {
      setCadet(data.cadet);
      if (data.progress) setProgress(data.progress);
      localStorage.setItem('nasa_academy_cadet', JSON.stringify(data));
    }
  };

  const handleCompleteModule = async (scoreDelta, badgeUnlocked) => {
    if (!cadet) return;
    
    const moduleId = currentView;
    const newScore = totalScore + scoreDelta;
    setTotalScore(newScore);

    // Update progress state
    const updatedProgress = progress.map((item) => {
      if (item.module_id === moduleId) {
        return {
          ...item,
          completed: 1,
          badge_unlocked: badgeUnlocked ? 1 : item.badge_unlocked,
          score: Math.max(item.score, scoreDelta)
        };
      }
      return item;
    });

    setProgress(updatedProgress);

    // Save to SQLite3 backend API
    await updateModuleProgress(cadet.id, moduleId, scoreDelta, badgeUnlocked);
  };

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setSoundActive(nextState);
  };

  return (
    <div className="min-h-screen bg-[#090314] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Space Station HUD Navbar */}
      <Navbar
        cadet={cadet}
        score={totalScore}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {!cadet ? (
          <LoginModal onLogin={handleLogin} />
        ) : (
          <>
            {currentView === 'dashboard' && (
              <Dashboard
                cadet={cadet}
                progress={progress}
                onSelectModule={(mod) => setCurrentView(mod)}
                onLaunchMission={() => setCurrentView('graduation')}
              />
            )}

            {currentView === 'biodome' && (
              <BioDome
                cadet={cadet}
                onCompleteModule={(score, badge) => handleCompleteModule(score, badge)}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'cargobay' && (
              <CargoBay
                cadet={cadet}
                onCompleteModule={(score, badge) => handleCompleteModule(score, badge)}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'observation' && (
              <ObservationDeck
                cadet={cadet}
                onCompleteModule={(score, badge) => handleCompleteModule(score, badge)}
                onBack={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'graduation' && (
              <Graduation
                cadet={cadet}
                score={totalScore}
                onBack={() => setCurrentView('dashboard')}
              />
            )}
          </>
        )}
      </main>

    </div>
  );
}
