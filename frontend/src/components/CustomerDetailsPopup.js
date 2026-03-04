import React, { useState, useEffect } from 'react'; 
import { getCustomerDetails, getCustomerRentals, returnRental } from '../services/api'; 


function CustomerDetailsPopup({customerId, onClose }) { 
    const [customerData, setCustomerData ] = useState(null);
    const [rentals, setRentals ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [returningRental, setReturningRental] = useState(null);

     useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                const [customer, rentalHistory] = await Promise.all([
                    getCustomerDetails(customerId),
                    getCustomerRentals(customerId)
                ]);
                setCustomerData(customer);
                setRentals(rentalHistory);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [customerId]);

    const handleReturn = async (rentalId) => {
        try {
            setReturningRental(rentalId);
            await returnRental(rentalId);
            
            const rentalHistory = await getCustomerRentals(customerId);
            setRentals(rentalHistory);
        } catch (error) {
            console.error(error);
            alert('Failed to return film');
        } finally {
            setReturningRental(null);
        }
    };
    

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>✕</button>

                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <>
                        <h2 style={styles.customerName}>
                            {customerData.first_name} {customerData.last_name}
                        </h2>
                        <p style={styles.customerId}>Customer ID: {customerData.customer_id}</p>

                        <div style={styles.infoSection}>
                            <p><strong>Email:</strong> {customerData.email}</p>
                            <p><strong>Phone:</strong> {customerData.phone}</p>
                            <p><strong>Address:</strong> {customerData.address}, {customerData.district}</p>
                            <p><strong>City:</strong> {customerData.city}, {customerData.postal_code}</p>
                            <p><strong>Country:</strong> {customerData.country}</p>
                            <p><strong>Active:</strong> {customerData.active ? 'Yes' : 'No'}</p>
                        </div>

                        <h3 style={styles.subtitle}>Rental History ({rentals.length} rentals)</h3>

                        {rentals.length === 0 ? (
                            <p style={styles.noRentals}>No rental history</p>
                        ) : (
                            <div style={styles.rentalsList}>
                                {rentals.map(rental => (
                                    <div key={rental.rental_id} style={styles.rentalItem}>
                                        <div style={styles.rentalTitle}>{rental.title}</div>
                                        <div style={styles.rentalDetails}>
                                            <span>Rented: {new Date(rental.rental_date).toLocaleDateString()}</span>
                                            <span style={rental.status === 'Active' ? styles.activeStatus : styles.returnedStatus}>
                                                {rental.status}
                                            </span>
                                            {rental.status === 'Active' && (
                                                    <button 
                                                        onClick={() => handleReturn(rental.rental_id)}
                                                        disabled={returningRental === rental.rental_id}
                                                        style={styles.returnButton}
                                                    >
                                                        {returningRental === rental.rental_id ? 'Returning film...' : 'Return'}
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
    customerName: {
        textAlign: 'center',
        color: '#000000',
        marginBottom: '5px',
    },
    customerId: {
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        marginBottom: '25px',
    },
    infoSection: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        lineHeight: '1.8',
    },
    subtitle: {
        textAlign: 'center',
        color: '#005b8b',
        marginBottom: '20px',
        fontSize: '18px',
    },
    rentalsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    rentalItem: {
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    rentalTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '8px',
    },
    rentalDetails: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#666',
        alignItems: 'center',
    },
    statusContainer: {  
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    activeStatus: {
        color: '#d4a500',
        fontWeight: 'bold',
    },
    returnedStatus: {
        color: '#28a745',
        fontWeight: 'bold',
    },
    returnButton: {  
        padding: '5px 12px',
        backgroundColor: '#800c04',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    noRentals: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
    },
};

export default CustomerDetailsPopup;
