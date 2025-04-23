/**
 * Formats a number as Indonesian Rupiah currency
 * @param amount The amount to format
 * @param includePrefix Whether to include the 'Rp.' prefix (default: true)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  includePrefix: boolean = true,
): string => {
  const formatted = amount.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return includePrefix ? `Rp. ${formatted}` : formatted;
};

/**
 * Formats a number with abbreviated suffixes for chart display (K for thousands, M for millions)
 * @param value The number to format
 * @param includePrefix Whether to include the 'Rp.' prefix (default: false)
 * @returns Abbreviated number string
 */
export const formatChartNumber = (
  value: number,
  includePrefix: boolean = false,
): string => {
  let result = "";

  if (value >= 1000000) {
    result = (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    result = (value / 1000).toFixed(1) + "K";
  } else {
    result = value.toFixed(0);
  }

  // Remove .0 if present
  result = result.replace(".0", "");

  return includePrefix ? `Rp. ${result}` : result;
};

/**
 * Calculates friendly Y-axis values for charts based on data range
 * @param data Array of numeric values to be displayed on chart
 * @param steps Number of steps/ticks to display on Y-axis (default: 5)
 * @returns Array of rounded values suitable for Y-axis
 */
export const calculateYAxisValues = (
  data: number[],
  steps: number = 5,
): number[] => {
  if (data.length === 0) return [0];

  const max = Math.max(...data);

  // Make the max value slightly higher for better visualization
  const roundedMax = roundToNiceNumber(max * 1.1);

  const result = [];
  const stepSize = roundedMax / steps;

  for (let i = 0; i <= steps; i++) {
    result.push(Math.round(i * stepSize));
  }

  return result;
};

/**
 * Rounds a number to a "nice" value for chart display
 * @param value The value to round
 * @returns A rounded value that looks clean on charts
 */
const roundToNiceNumber = (value: number): number => {
  const exponent = Math.floor(Math.log10(value));
  const factor = Math.pow(10, exponent);
  const normalizedValue = value / factor;

  let roundedValue;
  if (normalizedValue < 1.5) roundedValue = 1;
  else if (normalizedValue < 3) roundedValue = 2;
  else if (normalizedValue < 7) roundedValue = 5;
  else roundedValue = 10;

  return roundedValue * factor;
};
