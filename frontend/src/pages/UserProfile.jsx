// src/pages/UserProfile.jsx
import React from 'react';
import BankLinker from '../components/BankLinker';

const UserProfile = () => {
    // ... logic for profile (name, email, avatar)
    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            {/* ... other profile sections */}
            
            <section className="mt-8 border-t pt-4">
                <BankLinker />
            </section>
        </div>
    );
};