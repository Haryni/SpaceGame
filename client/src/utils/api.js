// API Helper for backend communication
const API_BASE = '/api';

export const loginCadet = async (name, avatar) => {
  try {
    const res = await fetch(`${API_BASE}/cadets/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatar })
    });
    if (!res.ok) throw new Error('Failed to login cadet');
    return await res.json();
  } catch (err) {
    console.warn('Backend API fallback (offline mode):', err);
    // Offline fallback for local preview without backend
    const mockId = 'cadet-local-' + Date.now();
    return {
      cadet: { id: mockId, name, avatar, score: 0 },
      progress: [
        { module_id: 'biodome', completed: 0, score: 0, badge_unlocked: 0 },
        { module_id: 'cargobay', completed: 0, score: 0, badge_unlocked: 0 },
        { module_id: 'observation', completed: 0, score: 0, badge_unlocked: 0 }
      ]
    };
  }
};

export const updateModuleProgress = async (cadetId, moduleId, score, badgeUnlocked) => {
  try {
    const res = await fetch(`${API_BASE}/progress/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cadetId, moduleId, score, badgeUnlocked })
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return await res.json();
  } catch (err) {
    console.warn('Progress update API fallback:', err);
    return { success: true };
  }
};

export const createCertificate = async (cadetId, rocketName, rocketColor) => {
  try {
    const res = await fetch(`${API_BASE}/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cadetId, rocketName, rocketColor })
    });
    if (!res.ok) throw new Error('Failed to issue certificate');
    return await res.json();
  } catch (err) {
    console.warn('Certificate API fallback:', err);
    return {
      success: true,
      certificate: {
        id: 'CERT-LOCAL-' + Math.floor(Math.random() * 100000),
        cadet_id: cadetId,
        rocket_name: rocketName,
        rocket_color: rocketColor,
        issued_at: new Date().toISOString()
      }
    };
  }
};

export const getLeaderboard = async () => {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return await res.json();
  } catch (err) {
    return [
      { id: '1', name: 'Cadet Leo', avatar: '🚀', score: 300, badges_count: 3 },
      { id: '2', name: 'Astro Maya', avatar: '🐱', score: 250, badges_count: 2 },
      { id: '3', name: 'Cosmic Sam', avatar: '👽', score: 180, badges_count: 1 }
    ];
  }
};
