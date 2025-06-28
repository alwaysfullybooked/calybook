export function formatName(name: string): string {
  const words = name.toUpperCase().split(" ");
  if (words.length === 1) return name;

  return words
    .map((word, index) => {
      if (index === 0) return word; // First word stays as is
      return `${word[0]}.`; // Other words become first letter + dot
    })
    .join(" ");
}
