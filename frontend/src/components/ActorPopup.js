import React, { useState, useEffect } from 'react';
import { getActorDetails } from '../services/api';

function ActorPopup({ actorName, onClose }) {
    const [actorData, setActorData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActorDetails(actorName)
            .then(data => setActorData(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [actorName]);

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>✕</button>
                
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <>
                        <h2 style={styles.actorName}>
                            {actorData.actor.first_name} {actorData.actor.last_name}
                        </h2>
                        <p style={styles.actorId}>Actor ID: {actorData.actor.actor_id}</p>
                        
                        <h3 style={styles.subtitle}>Top 5 Rented Films</h3>
                        
                        <div style={styles.filmsList}>
                            {actorData['top 5 films'].map((film, index) => (
                                <div key={film.film_id} style={styles.filmItem}>
                                    <span style={styles.filmRank}>#{index + 1}</span>
                                    <span style={styles.filmTitle}>{film.title}</span>
                                    <span style={styles.filmRentals}>{film.rental_count} rentals</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        backgroundColor: '#800c04',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        fontSize: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    actorName: {
        textAlign: 'center',
        color: '#000000',
        marginBottom: '5px',
    },
    actorId: {
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        marginBottom: '25px',
    },
    subtitle: {
        textAlign: 'center',
        color: '#005b8b',
        marginBottom: '20px',
        fontSize: '18px',
    },
    filmsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    filmItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    filmRank: {
        color: '#005b8b',
        fontWeight: 'bold',
        marginRight: '15px',
        minWidth: '35px',
        textAlign: 'center',
    },
    filmTitle: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: '16px',
    },
    filmRentals: {
        color: '#005b8b',
        fontWeight: 'bold',
    },
};

export default ActorPopup;