import React, { useState, useEffect } from 'react';
import { getMovieDetails, createRental } from '../services/api';

function MoviePopup({ in_title, onClose }) {
    const [movieData, getMovieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customerID, setCustomerID] = useState('');
    const [rentalMessage, setMessage] = useState('');
    const [renting, setRenting] = useState(false);



    useEffect(() => {
        getMovieDetails(in_title)
            .then(movieData => getMovieData(movieData))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [in_title]);

    const handleRental = async (e) => {
        e.preventDefault();
        setRenting(true);
        setMessage('');

        try {
            const result = await createRental(customerID, movieData.film_id);
            setMessage(result.message);
            setCustomerID('');

        } catch (error) { 
            let errorMessage = 'Failed to rent movie';

            const backendMessage = error.response?.data?.Failed || error.response?.data?.message || '';

            if (backendMessage.includes('not available')) {
                errorMessage = 'No more copies available';
            } else if (backendMessage.includes('customer_id') || backendMessage.includes('foreign key constraint') || backendMessage.includes('Cannot add or update')) {
                errorMessage = 'Customer does not exist';
            } else if (backendMessage) {
                errorMessage = backendMessage;
            }

            setMessage(`Error: ${errorMessage}`);
        }finally {
            setRenting(false);
        } 

    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>✕</button>

                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                       <h2>{movieData.title} ({movieData.release_year})</h2>
                       <p>ID: {movieData.film_id}</p>
                       <hr style={styles.horizontalLine}></hr>

                       <p style={styles.descriptiontext}>{movieData.description}</p>
                       <p>{movieData.genre} | {movieData.rating} | {movieData.length} min</p>
                       <p>Rental duration: {movieData.rental_duration} months @ ${movieData.rental_rate}/month</p>
                       <p>Replacement cost: ${movieData.replacement_cost}</p>
                       <p>Special features: {movieData.special_features}</p>
                       <p>Language: {movieData.lang}</p>

                        <hr style={styles.horizontalLine}></hr>
                       <form onSubmit={handleRental}>
                           <label>Enter Customer ID 1-599: </label>
                           <input
                               type="text"
                               value={customerID}
                               onChange={(e) => setCustomerID(e.target.value)}
                               placeholder="Customer ID"
                               required
                               pattern="[0-9]{1,3}"
                           />
                           <button 
                               type="submit" 
                               disabled={renting}
                           >
                               {renting ? 'Renting...' : 'Rent Film'}
                           </button>
                       </form>

                       {rentalMessage && (
                           <div>
                               {rentalMessage}
                           </div>
                       )}
                    </div>
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
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
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

    horizontalLine: {
        border: 'none',
        borderTop: '3px solid #e50914',
        width: '100%',
        margin: '10px auto',
    },

    descriptiontext: {
        
    },
}

export default MoviePopup