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


export default api;