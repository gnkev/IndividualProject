import axios from 'axios';

const api = axios.create({
    baseURL:'http://localhost:5000/api',
    headers: { 
        'Content-type': 'application/json',
    },

});

export const getCustomers = async( page = 1, usersPerPage = 10) => {
    const response = await api.get('/users', { 
        params: {page, per_page: usersPerPage}

    });
    return response.data;
}

export const getTop5Actors = async () => {
    const response = await api.get('/top5actors');
    return response.data;
};

export const getTop5Movies = async () => {
    const response = await api.get('/top5movies');
    return response.data;
}

export const getActorDetails = async (actorName) => {
    const response = await api.get('/actors', { params: { actor: actorName } });
    return response.data;
};

export const getMovieDetails = async (in_title) => {
    const response = await api.get('/movies', { params: { title: in_title } });
    return response.data[0];
};

export const createRental = async (customerID, filmID) => { 
    const response = await api.post('/rentals', { 
        customer_id: customerID, 
        film_id: filmID
    });
    return response.data;
};

export const getCustomerDetails = async (customerId) => { 
    const response = await api.get(`/customers/${customerId}`);
    return response.data;
};

export const getCustomerRentals = async (customerId) => { 
    const response = await api.get(`/customers/${customerId}/rentals`);
    return response.data;
};

export const returnRental = async (rentalId) => {
    const response = await api.put(`/rentals/${rentalId}/return`);
    return response.data;
};

export const deleteCustomer = async (customerId) => {
    const response = await api.delete(`/customers/${customerId}`);
    return response.data;
};

export const createCustomer = async (data) => {
    const response = await api.post('/customers', data);
    return response.data;
};

export const updateCustomer = async (customerId, data) => {
    const response = await api.post(`/customers/${customerId}`, data);
    return response.data;
};

export default api;