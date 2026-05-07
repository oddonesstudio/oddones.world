export const splitHeading = (heading: string) => {
  const words = heading.split(" ");

  return { first: words[0], second: words.slice(1).join(" ") };
};
