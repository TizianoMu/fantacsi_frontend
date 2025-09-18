export const decodeStatus = (status) => {
    switch (status) {
        case '00':
            return 'Prossimamente';
        case '10':
            return 'Prossimamente';
        case '20':
            return 'Mercato Aperto';
        case '50':
            return 'In Corso';
        case '100':
            return 'Concluso';
        default:
            return status;
    }
};

export const getStatusClass = (status) => {
    switch (decodeStatus(status)) {
        case 'In Corso': return 'status-in-corso';
        case 'Concluso': return 'status-concluso';
        case 'Prossimamente': return 'status-prossimamente';
        case 'Mercato Aperto': return 'status-mercato-aperto';
        default: return '';
    }
};