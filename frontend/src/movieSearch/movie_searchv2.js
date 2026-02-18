import { useState } from "react";
import axios from "axios";

function Search2() {
    const [query, setQuery] = useState("");
    const [searchType, setType] = useState("title");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const do_search2 = async () => {
        setLoading(true);
        setError("")
        setMovies([])

        try {
            const resp = await axios.get("http://localhost:5000/api/movies", {
                params: { [searchType]: query } 
            }); 
            setMovies(resp.data);
        }

        catch(error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setError("No movies found!");
            }
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{textAlign:"center"}}>
            <select value={searchType} onChange={(e) => setType(e.target.value)}>
                <option value="title">Title</option>
                <option value="actor">Actor</option>
                <option value="genre">Genre</option>
            </select>

            <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, actor, or genre..."  
            />

            <button onClick={do_search2}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

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

export default Search2;