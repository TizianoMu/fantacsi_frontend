export const GAME_SETTINGS = {
    CALCIO_5: {
        starters: 5,
        reserves: 3,
        modules: ['1-2-1'],
        defaultModule: '1-2-1',
    },
    CALCIO_7: {
        starters: 7,
        reserves: 4,
        modules: ['2-3-1', '3-2-1'],
        defaultModule: '2-3-1',
    },
    CALCIO_11: {
        starters: 11,
        reserves: 7,
        modules: ['4-4-2', '4-3-3'],
        defaultModule: '4-4-2',
    },
};

/**
 * Restituisce le impostazioni per un dato tipo di sport.
 * @param {string} sportType - Es. 'CALCIO_7'
 * @returns {object} Le impostazioni per quello sport o quelle di default (CALCIO_7).
 */
export const getSettingsForSport = (sportType) => {
    return GAME_SETTINGS[sportType] || GAME_SETTINGS.CALCIO_7;
};