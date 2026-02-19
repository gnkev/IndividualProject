import { useState } from "react";
import axios from "axios";
import MoviePopup from "../components/moviepopup";
import { getTop5Movies } from "../services/api";

function Search2() {
    const [query, setQuery] = useState("");
    const [searchType, setType] = useState("title");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);

    const do_search2 = async () => {
        setLoading(true);
        setError("");
        setMovies([]);

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

            else if(error.response && error.response.status === 400) {
                setError("Invalid input! Format: firstname lastname")
            }
        }

        finally {
            setLoading(false);
        }
    };

    const setTop5Movies = async () => {
        setLoading(true);
        setMovies([]);
        setError("");

        try {
            const resp = await getTop5Movies();
            setMovies(resp);
        }

        catch(error) {
            console.error(error);
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
                placeholder="Find movies..."  
            />

            <button onClick={do_search2}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p style={styles.errormsg}>{error}</p>}

            <p style={styles.smallmsg}>Leave blank to search for every movie...</p>
            <button onClick={setTop5Movies}> Or see current top five movies</button>

            {movies.map((movie) => (
                <div key={movie.film_id}
                    onClick={() => setSelected(movie.title)}>
                        <h3>{movie.title} ({movie.release_year})</h3>
                        <p>{movie.description}</p>
                        <p>Rating: {movie.rating} | Length: {movie.length} min | {movie.genre}</p>
                        <hr></hr>
                </div>
            ))}

            {selected && (
                <MoviePopup
                    in_title={selected}
                    onClose={() => setSelected(null)}
                />
            )}
      </div>
    );
}

const styles = {
    smallmsg : {
        fontSize:'11px',
        color:'gray'
    },

    errormsg : {
        color:'red'
    }
};

export default Search2;