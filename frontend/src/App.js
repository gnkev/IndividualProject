import React from 'react';
import CustomerPage from './pages/CustomerPage';
import Search2 from './movieSearch/movie_searchv2';

function app(){
    return(
        <div>
          <h1>Movie Rental Site</h1>
          <CustomerPage />
          <Search2 />

        </div>

    );
}


export default app;
