import { Share } from "react-native";
export const nativeShareItem = async ({ message, url }: { message: string; url: string }) => {
  try {
    const result = await Share.share({
      message,
      url,
    });
    //-------
    //- Below code can be used if you want to have some sort of
    //- callback after you have shared or dismissed the share ui
    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     // shared with activity type of result.activityType
    //     console.log("result.activitytype", result.activityType);
    //   } else {
    //     console.log("just shared", result);
    //     // shared
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   // dismissed
    // }
  } catch (error) {
    alert(error);
  }
};

//~~ -----------------------------------------------------------
//~~ DEFAULT IMAGES
//~~ -----------------------------------------------------------
export const defaultProfileImages = {
  image01: require("../../assets/images/cast001.jpeg"),
  image02: require("../../assets/images/cast002.jpeg"),
  image03: require("../../assets/images/cast003.jpeg"),
  image04: require("../../assets/images/cast004.jpeg"),
  image05: require("../../assets/images/cast005.jpeg"),
  image06: require("../../assets/images/cast006.jpeg"),
  image07: require("../../assets/images/cast007.jpeg"),
  image08: require("../../assets/images/cast008.jpeg"),
  image09: require("../../assets/images/cast009.jpeg"),
  image10: require("../../assets/images/cast010.jpeg"),
  image11: require("../../assets/images/cast011.jpeg"),
  image12: require("../../assets/images/cast012.jpeg"),
  image13: require("../../assets/images/cast013.jpeg"),
  image14: require("../../assets/images/cast014.jpeg"),
  image15: require("../../assets/images/cast015.jpeg"),
  image16: require("../../assets/images/cast016.jpeg"),
};
export const defaultMoviePosters = {
  image01: require("../../assets/images/movieposter001.jpeg"),
  image02: require("../../assets/images/movieposter002.jpeg"),
  image03: require("../../assets/images/movieposter003.jpeg"),
  image04: require("../../assets/images/movieposter004.jpeg"),
  image05: require("../../assets/images/movieposter005.jpeg"),
  image06: require("../../assets/images/movieposter006.jpeg"),
};

export function getRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 12) + 1; // Generate random number between 1 and 13
  return randomNumber.toString().padStart(2, "0"); // Pad number with leading zero if less than 10
}

const hashStringToNumber = (str: string) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
};

export const getProfileImageIndex = (filename: string) => {
  const hash = hashStringToNumber(filename);
  const num = (hash % Object.keys(defaultProfileImages).length) + 1;
  return num.toString().padStart(2, "0");
};
export const getProfileImage = (filename: string) => {
  const hash = hashStringToNumber(filename);
  const num = (hash % Object.keys(defaultProfileImages).length) + 1;
  return defaultProfileImages[`image${num.toString().padStart(2, "0")}`];
};
export const getDefaultPosterImage = (filename: string) => {
  const hash = hashStringToNumber(filename);
  const num = (hash % Object.keys(defaultMoviePosters).length) + 1;
  return defaultMoviePosters[`image${num.toString().padStart(2, "0")}`];
};

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

//~  --------------------------------------
//~  format Epoch number to not include any time information
//~  You can send either milliseconds or seconds, but you
//~  will always get back seconds
//~  --------------------------------------
export const formatEpoch = (epoch: number) => {
  if (!epoch) return 0;
  if (epoch < 1e12) {
    epoch = epoch * 1000;
  }
  const newDate = new Date(epoch);
  newDate.setHours(0, 0, 0, 0);
  return Math.floor(newDate.getTime() / 1000);
};

export function addDelimitersToArray(arr: any[], delimiter: string = ", ") {
  if (!arr) return "";
  return arr.reduce((fin, el, index) => {
    if (index == 0) return el;
    fin = `${fin}${delimiter}${el}`;
    return fin;
  }, "");
}
