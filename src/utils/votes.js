export const getVoteClass = (vote) => {
    if (vote === null) return 'vote-sv'; // Senza Voto
    if (vote >= 6.5) return 'vote-good';
    if (vote >= 6.0) return 'vote-sufficient';
    return 'vote-bad';
};