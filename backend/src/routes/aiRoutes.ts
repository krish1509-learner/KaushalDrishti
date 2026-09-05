import express from 'express';

const router = express.Router();

router.post('/analyze', (req, res) => {
  const skills = Array.isArray(req.body?.skills) ? req.body.skills : [];
  const softSkills = Array.isArray(req.body?.softSkills) ? req.body.softSkills : [];
  const ratings = skills
    .map((skill: { rating?: unknown }) => Number(skill.rating))
    .filter((rating: number) => Number.isFinite(rating) && rating >= 1 && rating <= 5);
  const averageRating = ratings.length
    ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
    : 0;
  const skillScore = Math.round((averageRating / 5) * 100);
  const employabilityScore = Math.min(100, Math.round(skillScore * 0.8 + softSkills.length * 4));
  const strongSkills = skills
    .filter((skill: { rating?: unknown }) => Number(skill.rating) >= 4)
    .map((skill: { name?: unknown }) => String(skill.name || ''))
    .filter(Boolean);
  const selectedSkillNames = new Set(
    skills.map((skill: { name?: unknown }) => String(skill.name || '').toLowerCase()),
  );
  const missingSkills = ['Communication', 'Data Analytics', 'Cloud Computing']
    .filter((skill) => !selectedSkillNames.has(skill.toLowerCase()) && !softSkills.includes(skill));

  res.status(200).json({
    success: true,
    skillScore,
    employabilityScore,
    strongSkills,
    missingSkills,
    recommendedPath: missingSkills.map((skill) => `Build capability in ${skill}`),
  });
});

export default router;
