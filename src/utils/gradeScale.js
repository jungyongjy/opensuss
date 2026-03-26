export const GRADE_SCALE = [
  { grade: 'A+', points: 5.0, min: 85, max: 100 },
  { grade: 'A',  points: 5.0, min: 80, max: 84 },
  { grade: 'A-', points: 4.5, min: 75, max: 79 },
  { grade: 'B+', points: 4.0, min: 70, max: 74 },
  { grade: 'B',  points: 3.5, min: 65, max: 69 },
  { grade: 'B-', points: 3.0, min: 60, max: 64 },
  { grade: 'C+', points: 2.5, min: 55, max: 59 },
  { grade: 'C',  points: 2.0, min: 50, max: 54 },
  { grade: 'D+', points: 1.5, min: 45, max: 49 },
  { grade: 'D',  points: 1.0, min: 40, max: 44 },
  { grade: 'F',  points: 0.0, min: 0,  max: 39 },
]

export function scoreToGrade(score) {
  const s = Number(score)
  if (isNaN(s)) return null
  return GRADE_SCALE.find(g => s >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1]
}

export function gradeToPoints(grade) {
  return GRADE_SCALE.find(g => g.grade === grade)?.points ?? 0
}
