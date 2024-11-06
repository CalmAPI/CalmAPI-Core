/**
 * Simple pluralization rules
 * @param {string} word - Word to pluralize
 * @returns {string} Pluralized word
 */
const pluralize = (word) => {
    if (!word) return word;
    
    // Special cases
    const irregulars = {
        'person': 'people',
        'child': 'children',
        'man': 'men',
        'woman': 'women',
        'tooth': 'teeth',
        'foot': 'feet',
        'mouse': 'mice',
        'goose': 'geese'
    };

    if (irregulars[word.toLowerCase()]) {
        return irregulars[word.toLowerCase()];
    }

    // Common rules
    if (word.endsWith('y')) {
        // city -> cities, puppy -> puppies
        if (!['ay', 'ey', 'oy', 'uy'].some(ending => word.toLowerCase().endsWith(ending))) {
            return word.slice(0, -1) + 'ies';
        }
    }
    if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
        return word + 'es';
    }
    if (word.endsWith('fe')) {
        return word.slice(0, -2) + 'ves';
    }
    if (word.endsWith('f')) {
        return word.slice(0, -1) + 'ves';
    }

    // Default: add 's'
    return word + 's';
};

module.exports = pluralize;