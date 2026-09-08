/**
 * Format currency amounts
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date string into human friendly format
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate BMI
 */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string; color: string } {
  if (!weightKg || !heightCm) return { bmi: 0, category: 'Unknown', color: 'text-slate-400' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  
  if (bmi < 18.5) return { bmi, category: 'Underweight', color: 'text-amber-400' };
  if (bmi < 25) return { bmi, category: 'Normal weight', color: 'text-emerald-400' };
  if (bmi < 30) return { bmi, category: 'Overweight', color: 'text-amber-400' };
  return { bmi, category: 'Obesity', color: 'text-rose-400' };
}
