/**
 * Returns all elements containing text without case matching
 * @param text the text to match
 * @param tag Tag containing the text
 * @param nth Number of the tag, if there are more then one
 * @param allowWrapped Whether there could be other element in the path
 * @returns {string}
 */
export const getAnyContainingText = (text, tag = "*", nth = 1, allowWrapped = true) =>
    `//${tag}${allowWrapped ? "//*" : ""}[contains(translate(text(),` +
    `'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'), '${text.toLowerCase()}')][${nth}]`;

export const getAnyContainingAriaLabelAttribute = (text, tag = "*", nth = 1, allowWrapped = true) =>
    `//${tag}${allowWrapped ? "//*" : ""}[contains(translate(@aria-label,` +
    `'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'), '${text.toLowerCase()}')][${nth}]`;