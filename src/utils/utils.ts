//~  --------------------------------------
//~  formatAsUSDCurrency
//~  --------------------------------------
export function formatAsUSDCurrency(
  value: number | string,
  includeDecimals: boolean = true
): string | undefined {
  if (!value) return undefined;
  // Convert value to a number if it's a string
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    throw new Error("Invalid number");
  }

  // Determine the number of decimal places based on the includeDecimals flag
  const minimumFractionDigits = includeDecimals ? 2 : 0;
  const maximumFractionDigits = includeDecimals ? 2 : 0;

  // Create an Intl.NumberFormat instance for USD currency formatting
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  // Format the number and return it as a string
  return formatter.format(numericValue);
}

type TimeFormat = {
  verbose: string;
  minutes: string;
};

//~  --------------------------------------
//~  formatTime
//~  --------------------------------------
export function formatTime(value: number | string): TimeFormat {
  // Convert value to a number if it's a string
  const totalMinutes = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(totalMinutes) || totalMinutes < 0) {
    throw new Error("Invalid time length");
  }

  // Calculate hours and remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Construct formatted strings
  const verbose = hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
  const minutesString = `${totalMinutes}m`;

  return { verbose, minutes: minutesString };
}

export function addDelimitersToArray(arr: any[], delimiter: string = ", ") {
  return arr.reduce((fin, el, index) => {
    if (index == 0) return el;
    fin = `${fin}${delimiter}${el}`;
    return fin;
  }, "");
}
