export function capitalizeFirstLetter(str: string) {
  if (str.includes('-')) {
    const words = str.split('-');

    const capitalizedWords = words.map(word => capitalizeFirstLetter(word));

    return capitalizedWords.join(' ');
  } else {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
