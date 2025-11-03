import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProtectedPage = () => {
    const [data, setData] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProtectedData();
    }, []);

    const fetchProtectedData = async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        if (!token) {
            setError('No token found. Please log in.');
            console.log('Token is missing!');  // Logging to confirm token is missing
            return;
        }

        console.log('Sending token:', token); // Log the token being sent in the request

        try {
            const response = await axios.get('http://localhost:5000/api/users/protected', {
                headers: { Authorization: `Bearer ${token}` }, // Send token in request header
            });
            setData(response.data.message);
        } catch (error) {
            setError(error.response?.data || 'Something went wrong');
            console.log('Error fetching protected data:', error); // Log the error if any
        }
    };

    return (
        <div>
            <h2>Protected Data</h2>
            {error ? <p style={{ color: 'red' }}>{error}</p> : <p>{data}</p>}
        </div>
    );
};

export default ProtectedPage;
