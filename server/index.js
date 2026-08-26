import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mission: 'NASA Space Apps Certification Academy API Online' });
});

// Create or Login Cadet Profile
app.post('/api/cadets/login', (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Cadet name is required' });
  }

  const cadetName = name.trim();
  const cadetAvatar = avatar || 'astro_cat';

  // Check if cadet exists
  db.get('SELECT * FROM cadets WHERE LOWER(name) = LOWER(?)', [cadetName], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Cadet exists, fetch their progress
      db.all('SELECT * FROM progress WHERE cadet_id = ?', [row.id], (pErr, pRows) => {
        if (pErr) return res.status(500).json({ error: pErr.message });
        return res.json({
          cadet: row,
          progress: pRows || []
        });
      });
    } else {
      // Create new cadet
      const id = uuidv4();
      db.run(
        'INSERT INTO cadets (id, name, avatar, score) VALUES (?, ?, ?, ?)',
        [id, cadetName, cadetAvatar, 0],
        function (iErr) {
          if (iErr) return res.status(500).json({ error: iErr.message });

          // Initialize progress for 3 modules
          const modules = ['biodome', 'cargobay', 'observation'];
          const stmt = db.prepare('INSERT INTO progress (cadet_id, module_id, completed, score, badge_unlocked) VALUES (?, ?, 0, 0, 0)');
          modules.forEach((mod) => stmt.run(id, mod));
          stmt.finalize();

          const newCadet = { id, name: cadetName, avatar: cadetAvatar, score: 0 };
          return res.status(201).json({
            cadet: newCadet,
            progress: modules.map(m => ({ cadet_id: id, module_id: m, completed: 0, score: 0, badge_unlocked: 0 }))
          });
        }
      );
    }
  });
});

// Get Cadet Profile and Progress
app.get('/api/cadets/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM cadets WHERE id = ?', [id], (err, cadet) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!cadet) return res.status(404).json({ error: 'Cadet not found' });

    db.all('SELECT * FROM progress WHERE cadet_id = ?', [id], (pErr, progress) => {
      if (pErr) return res.status(500).json({ error: pErr.message });

      db.all('SELECT * FROM certificates WHERE cadet_id = ?', [id], (cErr, certs) => {
        if (cErr) return res.status(500).json({ error: cErr.message });
        return res.json({
          cadet,
          progress: progress || [],
          certificates: certs || []
        });
      });
    });
  });
});

// Update Module Progress & Unlock Badges
app.post('/api/progress/update', (req, res) => {
  const { cadetId, moduleId, score, badgeUnlocked } = req.body;

  if (!cadetId || !moduleId) {
    return res.status(400).json({ error: 'cadetId and moduleId are required' });
  }

  const completed = badgeUnlocked ? 1 : 0;

  db.run(
    `INSERT INTO progress (cadet_id, module_id, completed, score, badge_unlocked, updated_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(cadet_id, module_id) DO UPDATE SET
       completed = MAX(completed, excluded.completed),
       score = MAX(score, excluded.score),
       badge_unlocked = MAX(badge_unlocked, excluded.badge_unlocked),
       updated_at = CURRENT_TIMESTAMP`,
    [cadetId, moduleId, completed, score || 0, badgeUnlocked ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Recalculate total score for cadet
      db.get('SELECT SUM(score) as totalScore FROM progress WHERE cadet_id = ?', [cadetId], (sErr, sRow) => {
        const totalScore = sRow ? sRow.totalScore : 0;
        db.run('UPDATE cadets SET score = ? WHERE id = ?', [totalScore, cadetId], (uErr) => {
          if (uErr) console.error('Failed to update cadet total score:', uErr.message);

          // Return updated cadet progress
          db.all('SELECT * FROM progress WHERE cadet_id = ?', [cadetId], (pErr, pRows) => {
            if (pErr) return res.status(500).json({ error: pErr.message });
            return res.json({
              success: true,
              totalScore,
              progress: pRows
            });
          });
        });
      });
    }
  );
});

// Create Mission Launch Certificate
app.post('/api/certificates', (req, res) => {
  const { cadetId, rocketName, rocketColor } = req.body;

  if (!cadetId) return res.status(400).json({ error: 'cadetId is required' });

  const certId = 'CERT-' + uuidv4().substring(0, 8).toUpperCase();
  db.run(
    'INSERT INTO certificates (id, cadet_id, rocket_name, rocket_color) VALUES (?, ?, ?, ?)',
    [certId, cadetId, rocketName || 'Starlight Voyager', rocketColor || '#00f0ff'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      return res.status(201).json({
        success: true,
        certificate: {
          id: certId,
          cadet_id: cadetId,
          rocket_name: rocketName,
          rocket_color: rocketColor,
          issued_at: new Date().toISOString()
        }
      });
    }
  );
});

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  db.all(
    `SELECT c.id, c.name, c.avatar, c.score, c.created_at,
            (SELECT COUNT(*) FROM progress p WHERE p.cadet_id = c.id AND p.badge_unlocked = 1) as badges_count
     FROM cadets c
     ORDER BY c.score DESC, badges_count DESC
     LIMIT 10`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 NASA Space Apps Academy Server running on http://localhost:${PORT}`);
});
