import { useState } from "react";
import axios from "axios";
import CustomerDetailsPopup from '../components/CustomerDetailsPopup.js';


function CustomerSearch() {
    const [query, setQuery] = useState("");
    const [searchType, setType] = useState("customer_id");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);

    const do_customerSearch = async () => {
        setLoading(true);
        setError("");
        setCustomers([]);

        try {
            const resp = await axios.get("http://localhost:5000/api/searchcustomers", {
                params: { [searchType]: query }
            });
            setCustomers(Array.isArray(resp.data) ? resp.data : [resp.data]);
        }

        catch(error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setError("No customers found!");
            }

            else if(error.response && error.response.status === 400) {
                setError("Invalid input!");
            }
        }

        finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div>
                <select
                    value={searchType}
                    onChange={(e) => setType(e.target.value)}
                    >
                        <option value="customer_id">Customer ID</option>
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                </select>

                <input
                    type="text"
                    placeholder="Search for customers"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key == 'Enter' && do_customerSearch()}
                />
                <button onClick={do_customerSearch}>
                    {loading ? 'Searching':"Search"}
                </button>
            </div>

            {error && <p>{error}</p>}

            {customers.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <hr></hr>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr 
                                key={customer.customer_id}
                                onClick={() => setSelected(customer)}
                                >
                                    <td>{customer.customer_id}</td>
                                    <td>{customer.first_name}</td>
                                    <td>{customer.last_name}</td>
                                    <td>{customer.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selected && (
                <CustomerDetailsPopup
                    customerId = {selected.customer_id}
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


export default CustomerSearch