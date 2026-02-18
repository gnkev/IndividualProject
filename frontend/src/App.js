import React from 'react';
import CustomerPage from './pages/CustomerPage';
import Search from './movieSearch/movie_search';

function app(){
    return(
        <div>
          <h1>Movie Rental Site</h1>
          <CustomerPage />
          <Search />

        </div>

    );
}


export default app;
