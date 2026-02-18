import React, { useState, useEffect } from 'react';
import { getTop5Actors } from '../services/api';
import ActorPopup  from '../components/ActorPopup';

function HomePage() {
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActor, setSelectedActor] = useState(null);

    useEffect(() => {
        getTop5Actors()
            .then(data => setActors(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <h2>Loading...</h2>;

     return (
        <div style={styles.container}>
            <h2 style={styles.subtitle}>Top 5 Most Popular Actors</h2>
            
            <div style={styles.actorGrid}>
                {actors.map((actor, index) => (
                    <div 
                        key={actor.actor_id}
                        style={styles.actorCard}
                        onClick={() => setSelectedActor(`${actor.first_name} ${actor.last_name}`)}  
                    >
                        <div style={styles.rank}>#{index + 1}</div>
                        <h3>{actor.first_name} {actor.last_name}</h3>
                        <p style={styles.rentalCount}>
                            {actor.rental_count} total rentals
                        </p>
                    </div>
                ))}
            </div>

            {selectedActor && (
                <ActorPopup
                    actorName={selectedActor}
                    onClose={() => setSelectedActor(null)}
                />
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
   
    subtitle: {
        marginTop: '60px',
        textAlign: 'center',
        color: '#000000',
        marginBottom: '30px',
        fontSize: '30px',
    },
    actorGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    actorCard: {
        border: '2px solid #800c04',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        position: 'relative',
    },
    rank: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: '#005b8b',
        fontWeight: 'bold',
    },
    rentalCount: {
        color: '#005b8b',
        fontWeight: 'bold',
        fontSize: '18px',
    },
};

export default HomePage;