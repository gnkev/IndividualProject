import React, { useState, useEffect} from 'react';
import {getCustomers} from '../services/api.js'; 

function CustomerPage() {
    const [customers, setCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage]);

    const fetchCustomers = async (page) => { 
        try{
            setLoading(true);
            const data = await getCustomers(page, 10);
            setCustomer(data.customers);
            setPagination(data.pagination);
        } catch (err) {
            setError('Failed to load customer data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h2>Loading Customer Data...</h2>
    if (error) return <h2>{error}</h2>; 

    return (
        <div> 
            <h1 style={styles.title}>Customer List</h1>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>First Name</th>
                        <th style={styles.th}>Last Name</th>
                        <th style={styles.th}>Email</th>
                        

                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key = {customer.customer_id}>
                            <td style={styles.td}>{customer.customer_id}</td>
                            <td style={styles.td}>{customer.first_name}</td>
                            <td style={styles.td}>{customer.last_name}</td>
                            <td style={styles.td}>{customer.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {pagination && (
                <div style={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(currentPage-1) }
                        disabled={!pagination.has_prev}
                        style={styles.button}
                    >
                        Previous 
                    </button>

                     <span style={styles.pageInfo}>
                        Page {pagination.current_page} of {pagination.total_pages}  
                        
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.has_next}
                        style={styles.button}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {

    title: {
        color: "black",
        textAlign: 'center',
        fontSize: '30px',
    },
    table: {
        width: '1000px',  
        borderCollapse: 'collapse',
        marginTop: '20px',
        marginLeft: '500px',
        marginBottom: '20px',
    },
    th: {
        backgroundColor: '#800c04',
        color: 'white',
        padding: '12px',
        textAlign: 'left',
        borderBottom: '2px solid #000000',
    },
    td: {
        padding: '10px',
        borderBottom: '1px solid #000000',
    },
    pagination: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '100px',
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#800c04',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    pageInfo: {
        fontSize: '14px',
    },
};


export default CustomerPage;