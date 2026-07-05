import React from 'react';

const LegalLayout = ({ title, children }) => {
    return (
        <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg my-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-4">{title}</h1>
            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                {children}
            </div>
        </div>
    );
};

export default LegalLayout;