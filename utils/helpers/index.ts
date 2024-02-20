import { countries } from "@/utils/data/Countries";
import allData from "@/utils/data/allData.json";
import countryData from "@/utils/data/countryData.json";

// Utility function to format country names, with specific handling for certain words
export function formatCountryName(country: string) {
  const lowercaseWords = ["a", "the", "of", "and"]; // Words to keep in lowercase unless they are the first word
  return country
    .split("_")
    .map((word, index) => {
      if (index === 0 || !lowercaseWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(" ");
}

export function hexToRGBA(hex: string, alpha = 1) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Use an async function to enable await for dynamic imports
export const formatCountries = async () => {
  const missingCountries: any[] = [];

  for (const [countryName, countryValue] of Object.entries(countries)) {
    try {
      // Dynamically import the country JSON data
      const data = await import(`@/utils/data/all/${countryName}.json`);

      // Loop through all features in the country data
      data.features.forEach((feature: any) => {
        // check if ISO_CODE already exists
        if (feature.properties.ISO_CODE) {
          return;
        }
        // Add the ISO_CODE to each feature's properties
        feature.properties.ISO_CODE = countryValue.isoCode;
      });
    } catch (error) {
      // Handle errors, such as missing country files
      console.error(`Failed to load or update country data for ${countryName}: ${error}`);
      missingCountries.push(countryName);
    }
  }

  // After all countries have been processed, log any missing countries
  if (missingCountries.length > 0) {
    console.log(`Missing countries: ${missingCountries.join(", ")}`);
  } else {
    console.log("All countries processed successfully.");
  }
};

export const checkForAllCountries = () => {
  try {
    for (const [countryName, data] of Object.entries(countries)) {
      // Loop through the features array in country data and check if there is any ISO_A2 value that matches the country's ISO code
      const countryExists = countryData.features.some((feature) => {
        return feature.properties.ISO_A2_EH === data.isoCode;
      });

      if (!countryExists) {
        console.log(`Missing country: ${countryName}`);
      }
    }
  } catch (error) {
    console.error(`Failed to check for all countries: ${error}`);
  }
};
