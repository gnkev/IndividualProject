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

export default api;