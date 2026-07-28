const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const DEFAULT_FALLBACK_COUNT = 89746;

/**
 * Converts numbers to Bengali digits formatted with locale commas and '+' suffix.
 * Defaults to 89,746 ("৮৯,৭৪৬+") if input is invalid or loading/failed.
 * Example: 89746 -> "৮৯,৭৪৬+"
 */
export function formatBengaliNumber(num?: number | string | null, showPlus = true): string {
  let numValue = DEFAULT_FALLBACK_COUNT;

  if (typeof num === 'number' && !isNaN(num) && num > 0) {
    numValue = num;
  } else if (typeof num === 'string') {
    const parsed = parseInt(num, 10);
    if (!isNaN(parsed) && parsed > 0) {
      numValue = parsed;
    }
  }

  const formattedEn = numValue.toLocaleString('en-US');
  const bnFormatted = formattedEn.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
  return showPlus ? `${bnFormatted}+` : bnFormatted;
}
