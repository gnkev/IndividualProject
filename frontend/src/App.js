import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomerPage from './pages/CustomerPage';
import Search2 from './movieSearch/movie_searchv2';

function app(){
    return(
        <Router>
            <nav style={styles.nav}>
                <h2 style={styles.logo}> Movie Rental Site</h2>
                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Home</Link>
                    <Link to="/movies" style={styles.link}>Movie Search</Link>
                    <Link to="/customers" style={styles.link}>Customer List</Link>
                </div>
            </nav>
       <div style={styles.content}>
                <Routes>
                    <Route path="/" element={<HomePage />} />  
                    <Route path="/movies" element={<Search2 />} />
                    <Route path="/customers" element={<CustomerPage />} />
                </Routes>
            </div>
        </Router>

    );
}


const styles = {
    nav: {
        backgroundColor: '#800c049f',
        padding: '15px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        color: 'black',
        margin: 0,
    },
    links: {
        display: 'flex',
        gap: '20px',
    },
    link: {
        color: 'black',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    content: {
        padding: '20px',
    },
};

export default app;