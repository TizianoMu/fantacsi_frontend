import React from 'react';

const PrivacyPolicyPage = () => {
    const Titolare = {
        nome: "Tiziano Murzio",
        indirizzo: "Via Roma 64, Arona (NO)",
        email: "fantacsileague@gmail.com",
    };
    
    const ultimoAggiornamento = "29 Settembre 2025";

    return (
        <div className="central-box">
            {/* Contenitore principale che simula la policy card */}
            <div>
                
                {/* Titolo principale */}
                <h1 className="title">
                    Privacy Policy
                </h1>
                
                <p>
                    Ultimo aggiornamento: {ultimoAggiornamento}
                </p>

                <p>
                    FantaCSI s'impegna a proteggere la tua privacy e a trattare i tuoi dati personali in conformità con il <strong>Regolamento Generale sulla Protezione dei Dati (GDPR) (Regolamento UE 2016/679)</strong> e la normativa italiana applicabile.
                </p>

                {/* Sezione Titolare del Trattamento */}
                <h2 className="title">
                    1. Titolare del Trattamento
                </h2>
                <div>
                    <p>Il Titolare del Trattamento dei dati personali è:</p>
                    <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
                        <li><span className='bold-text'>Nome:</span> {Titolare.nome}</li>
                        <li><span className='bold-text'>Indirizzo:</span> {Titolare.indirizzo}</li>
                        <li><span className='bold-text'>Email di contatto:</span> <a href={`mailto:${Titolare.email}`} style={{ color: primaryColor, fontWeight: 'bold', textDecoration: 'none' }} className="policy-link">{Titolare.email}</a></li>
                    </ul>
                </div>

                {/* Sezione Tipologia Dati */}
                <h2 className="title">
                    2. Tipologia di Dati Trattati e Finalità
                </h2>
                <p>
                    Il Servizio raccoglie e tratta <span className='bold-text'>solo i dati personali strettamente necessari</span> per l'autenticazione e per fornire i servizi principali di gestione dei campionati.
                </p>
                
                <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                    <table className="ranking-table" style={{ margin: '0', maxWidth: '100%' }}>
                        <thead>
                            <tr style={{ textAlign: 'left'}}>
                                <th>Categoria di Dati</th>
                                <th>Finalità del Trattamento</th>
                                <th>Base Giuridica (GDPR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-blue-50">
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee',fontWeight: 'bold' }}>Indirizzo email</td>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee' }}>
                                    Permettere l'autenticazione, la gestione dell'account, la creazione e la partecipazione ai campionati.
                                </td>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee'>
                                    <span className='bold-text'>Esecuzione del contratto (Art. 6.1.b)</span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee',fontWeight: 'bold' }}>Password hashata</td>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee' }}>
                                    Garantire la sicurezza e l'integrità del tuo account. (La password non è mai salvata in chiaro).
                                </td>
                                <td style={{ padding: '0.8rem', borderBottom: '1px solid #eee'}}>
                                    <span className='bold-text'>Legittimo interesse (Art. 6.1.f)</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                    <strong>Nota:</strong> Non trattiamo categorie particolari di dati personali (come dati sensibili, sanitari o genetici).
                </p>


                {/* Sezione Modalità del Trattamento */}
                <h2 className="title" >
                    3. Modalità del Trattamento
                </h2>
                <p style={{ marginBottom: '1.5rem'}}>
                    Il trattamento dei tuoi dati personali avviene mediante strumenti informatici e telematici. Adottiamo <span className='bold-text'>misure di sicurezza adeguate</span> per prevenire la perdita dei dati, usi illeciti o accessi non autorizzati. Le password sono salvate unicamente tramite <strong>hashing crittografico</strong>.
                </p>

                {/* Sezione Conservazione */}
                <h2 className="title">
                    4. Periodo di Conservazione dei Dati
                </h2>
                <p style={{ marginBottom: '1.5rem'}}>
                    I tuoi dati personali (email e password hashata) saranno conservati per tutta la durata del rapporto contrattuale, ossia <span className='bold-text'>finché il tuo account rimarrà attivo</span>. In caso di cancellazione, i dati saranno eliminati o anonimizzati, salvo obblighi legali.
                </p>


                {/* Sezione Diritti */}
                <h2 className="title">
                    5. Diritti dell'Interessato
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                    In qualità di utente, puoi esercitare i seguenti diritti in qualsiasi momento, inviando una richiesta all'indirizzo email del Titolare: <strong><a href={`mailto:${Titolare.email}`} style={{ color: primaryColor, fontWeight: 'bold', textDecoration: 'none' }}>{Titolare.email}</a></strong>.
                </p>

                <ul style={{ listStyleType: 'disc', marginLeft: '20px', lineHeight: '1.6' }}>
                    <li><span className='bold-text'>Diritto di Accesso</span> (Art. 15)</li>
                    <li><span className='bold-text'>Diritto di Rettifica</span> (Art. 16)</li>
                    <li><span className='bold-text'>Diritto alla Cancellazione</span> (Art. 17)</li>
                    <li><span className='bold-text'>Diritto di Limitazione di Trattamento</span> (Art. 18)</li>
                    <li><span className='bold-text'>Diritto alla Portabilità dei Dati</span> (Art. 20)</li>
                    <li><span className='bold-text'>Diritto di Opposizione</span> (Art. 21)</li>
                    <li><span className='bold-text'>Diritto di Proporre Reclamo</span> (Art. 77) all'Autorità Garante per la Protezione dei Dati Personali.</li>
                </ul>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
