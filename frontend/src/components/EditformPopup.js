import { useState, useEffect } from "react";
import { getCustomerDetails, updateCustomer } from '../services/api';

function EditFormPopup({ customerId, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        store_id: '',
        first_name: '',
        last_name: '',
        email: '',
        address_id: '',
        active: 1,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                const customer = await getCustomerDetails(customerId);
                setFormData({
                    store_id: customer.store_id ?? '',
                    first_name: customer.first_name ?? '',
                    last_name: customer.last_name ?? '',
                    email: customer.email ?? '',
                    address_id: customer.address_id ?? '',
                    active: customer.active ?? 1,
                });
            } catch (err) {
                console.error(err);
                setError(err.response?.status + ': ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);

        const { store_id, first_name, last_name, email, address_id } = formData;
        if (!store_id || !first_name || !last_name || !email || !address_id) {
            setError('All fields are required.');
            return;
        }

        try {
            setSaving(true);
            await updateCustomer(customerId, {
                ...formData,
                store_id: Number(formData.store_id),
                address_id: Number(formData.address_id),
                active: Number(formData.active),
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.status + ': ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>✕</button>

                <h2 style={styles.title}>Edit Customer</h2>
                <p style={styles.subtitle}>Customer ID: {customerId}</p>

                {loading ? (
                    <p style={styles.loadingText}>Loading customer data...</p>
                ) : (
                    <>
                        <div style={styles.formSection}>
                            <div style={styles.row}>
                                <div style={styles.field}>
                                    <label style={styles.label}>First Name</label>
                                    <input
                                        style={styles.input}
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="e.g. John"
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Last Name</label>
                                    <input
                                        style={styles.input}
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Doe"
                                    />
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Email</label>
                                <input
                                    style={styles.input}
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. john.doe@email.com"
                                />
                            </div>

                            <div style={styles.row}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Store ID</label>
                                    <input
                                        style={styles.input}
                                        name="store_id"
                                        type="number"
                                        value={formData.store_id}
                                        onChange={handleChange}
                                        placeholder="e.g. 1"
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Address ID</label>
                                    <input
                                        style={styles.input}
                                        name="address_id"
                                        type="number"
                                        value={formData.address_id}
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                    />
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Status</label>
                                <select
                                    style={styles.input}
                                    name="active"
                                    value={formData.active}
                                    onChange={handleChange}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>

                        {error && <p style={styles.errorText}>{error}</p>}

                        <div style={styles.actions}>
                            <button style={styles.cancelButton} onClick={onClose} disabled={saving}>
                                Cancel
                            </button>
                            <button style={styles.submitButton} onClick={handleSubmit} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '520px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        backgroundColor: '#800c04',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        fontSize: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    title: {
        textAlign: 'center',
        color: '#000000',
        marginBottom: '5px',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        marginBottom: '25px',
    },
    loadingText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        padding: '20px 0',
    },
    formSection: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    row: {
        display: 'flex',
        gap: '12px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '5px',
    },
    label: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#444',
    },
    input: {
        padding: '9px 12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: 'white',
    },
    errorText: {
        color: '#800c04',
        fontSize: '13px',
        textAlign: 'center',
        marginBottom: '15px',
        fontWeight: 'bold',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    cancelButton: {
        padding: '9px 20px',
        backgroundColor: 'white',
        color: '#444',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    submitButton: {
        padding: '9px 20px',
        backgroundColor: '#800c04',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
};

export default EditFormPopup;