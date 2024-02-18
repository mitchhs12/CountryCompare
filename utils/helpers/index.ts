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

export function hexToRGBA(hex: string, alpha = 1) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
