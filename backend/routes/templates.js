const express = require('express');
const router = express.Router();

const TEMPLATES = [
  { id: 'classic', name: 'Classic ATS', desc: 'Traditional format optimized for all ATS systems. Highest compatibility.', badge: 'Most Popular', accent: '#6366f1', category: 'ats', atsScore: 98 },
  { id: 'modern', name: 'Modern Professional', desc: 'Contemporary design with gradient header. Perfect for tech roles.', badge: 'Trending', accent: '#8b5cf6', category: 'professional', atsScore: 92 },
  { id: 'minimal', name: 'Minimal Clean', desc: 'Ultra-clean layout focused on content. Passes all ATS systems.', badge: 'ATS-Safe', accent: '#10b981', category: 'ats', atsScore: 97 },
  { id: 'executive', name: 'Executive', desc: 'Premium layout for senior professionals and C-suite candidates.', badge: 'Premium', accent: '#d97706', category: 'professional', atsScore: 94 },
  { id: 'developer', name: 'Developer', desc: 'Code-inspired design for software engineers and developers.', badge: 'Dev Pick', accent: '#3b82f6', category: 'professional', atsScore: 90 },
  { id: 'creative', name: 'Creative', desc: 'Bold design for UX/UI designers and creative professionals.', badge: '', accent: '#ec4899', category: 'creative', atsScore: 82 },
  { id: 'two-column', name: 'Two Column', desc: 'Sidebar layout for comprehensive skills and experience display.', badge: '', accent: '#f59e0b', category: 'professional', atsScore: 88 },
  { id: 'graduate', name: 'Graduate', desc: 'Entry-level template highlighting education, projects, and internships.', badge: 'Entry Level', accent: '#0ea5e9', category: 'ats', atsScore: 96 },
];

// GET /api/templates
router.get('/', (req, res) => {
  const { category } = req.query;
  const data = category ? TEMPLATES.filter(t => t.category === category) : TEMPLATES;
  res.json({ success: true, data });
});

// GET /api/templates/:id
router.get('/:id', (req, res) => {
  const tpl = TEMPLATES.find(t => t.id === req.params.id);
  if (!tpl) return res.status(404).json({ success: false, message: 'Template not found' });
  res.json({ success: true, data: tpl });
});

module.exports = router;
