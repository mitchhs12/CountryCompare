// Utility function to format country names, with specific handling for certain words
export function formatCountryName(country: string) {
  const lowercaseWords = ["a", "the", "of", "and"]; // Words to keep in lowercase unless they are the first word
  return country
    .split("-")
    .map((word, index) => {
      if (index === 0 || !lowercaseWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(" ");
}
