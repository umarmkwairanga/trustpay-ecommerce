import React from 'react';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Groceries', 'Automotive'];

const CategoryFilter = ({ onSelectCategory }) => {
    return (
        <div className="flex gap-4 p-4 overflow-x-auto">
            {categories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => onSelectCategory(cat)}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-sm font-semibold transition"
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;