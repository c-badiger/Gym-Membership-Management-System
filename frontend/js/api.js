const API_URL = 'http://localhost:5000/api';

const fetchAPI = async (endpoint, options = {}) => {
    const token = localStorage.getItem('gym_token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            if(response.status === 401) {
                // Unauthorized, redirect to login
                localStorage.removeItem('gym_token');
                window.location.href = '/frontend/pages/login.html';
            }
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    window.location.href = '/frontend/pages/login.html';
};

const checkAuth = () => {
    const token = localStorage.getItem('gym_token');
    if (!token && !window.location.href.includes('login.html')) {
        window.location.href = '/frontend/pages/login.html';
    }
    
    if(document.getElementById('user-name')) {
        const user = JSON.parse(localStorage.getItem('gym_user') || '{}');
        document.getElementById('user-name').textContent = user.username || 'Admin';
    }
};

const showNotification = (message, type = 'success') => {
    // Simple alert for now, could be enhanced to toast
    alert(message);
};
