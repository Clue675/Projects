import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const navigate = useNavigate();
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFade(true);
            setTimeout(() => navigate('/login'), 500); // Adjust time for fade effect
        }, 3000); // Adjust time to display the splash screen

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.5s' }}>
            {/* Your permacore content here */}
            <h1>Permacore</h1>
        </div>
    );
};

export default SplashScreen;
