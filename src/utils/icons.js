import { faHandPaper, faShieldAlt, faCogs, faCrosshairs, faUser } from '@fortawesome/free-solid-svg-icons';

export const getRoleIcon = (role) => {
    switch (role) {
        case 'PORTIERE': return faHandPaper;
        case 'DIFENSORE': return faShieldAlt;
        case 'CENTROCAMPISTA': return faCogs;
        case 'ATTACCANTE': return faCrosshairs;
        default: return faUser;
    }
};