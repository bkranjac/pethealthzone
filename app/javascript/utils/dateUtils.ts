/**
 * Calculate age from a birthdate and return a human-readable string
 */
export function calculateAge(birthdate: string | Date): string {
  const birth = new Date(birthdate);
  const today = new Date();

  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate years, months, and remaining days
  const years = Math.floor(diffDays / 365);
  const remainingDaysAfterYears = diffDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  // Build age string
  if (years > 0) {
    if (months > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
    }
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  } else if (months > 0) {
    if (days > 0 && months < 3) {
      return `${months} ${months === 1 ? 'month' : 'months'}, ${days} ${days === 1 ? 'day' : 'days'}`;
    }
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else if (days > 0) {
    if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }

  return 'Just born!';
}

/**
 * Get emoji icon for pet type
 */
export function getPetTypeIcon(petType: string): string {
  const type = petType.toLowerCase();

  if (type.includes('dog')) return '🐕';
  if (type.includes('cat')) return '🐱';
  if (type.includes('bird')) return '🐦';
  if (type.includes('fish')) return '🐟';
  if (type.includes('rabbit')) return '🐰';
  if (type.includes('hamster')) return '🐹';
  if (type.includes('guinea pig')) return '🐹';
  if (type.includes('reptile') || type.includes('lizard') || type.includes('snake')) return '🦎';
  if (type.includes('turtle') || type.includes('tortoise')) return '🐢';

  return '🐾'; // Default
}

/**
 * Get emoji icon for gender
 */
export function getGenderIcon(gender: string): string {
  const g = gender.toLowerCase();

  if (g === 'male' || g === 'm') return '♂️';
  if (g === 'female' || g === 'f') return '♀️';

  return ''; // No icon for unknown/other
}
