import { useState } from "react";
import axios from "axios";

function Search() {
    const [title, setTitle] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    const do_search = async () => {
        setLoading(true);
        try {
            const resp = await axios.get("http://localhost:5000/api/movies", { params: { title }})
            setMovies(resp.data);
        }

        catch (error) {
            console.error(error);
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search for a movie"    
            />
            <button onClick={do_search}>Search</button>

            {loading && <p>Loading...</p>}

            {movies.map((movie) => (
                <div key={movie.film_id}>
                    <h3>{movie.title} ({movie.release_year})</h3>
                    <p>{movie.description}</p>
                    <p>Rating: {movie.rating} | Length: {movie.length} min</p>
                </div>
            ))}
        </div>
    );
}

export default Search;