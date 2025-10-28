import React, { useState, useMemo } from 'react';
import { FoodSearchItem } from '../types';
import { FOOD_DATA } from '../data/foodData';
import Icon from '../components/Icon';

interface FoodSearchPageProps {
    initialQuery: string;
    onClose: () => void;
    onSelectFood: (food: FoodSearchItem) => void;
}

const FoodSearchPage: React.FC<FoodSearchPageProps> = ({ initialQuery, onClose, onSelectFood }) => {
    const [query, setQuery] = useState(initialQuery);

    const searchResults = useMemo(() => {
        if (!query.trim()) return [];
        const lowercasedQuery = query.toLowerCase();
        return FOOD_DATA.filter(item => item.description.toLowerCase().includes(lowercasedQuery));
    }, [query]);

    return (
        <div className="fixed inset-0 bg-zinc-950 z-[60] flex flex-col font-sans text-zinc-200">
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-800">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <Icon type="arrow-left" className="w-6 h-6 text-zinc-400" />
                </button>
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        autoFocus
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                </div>
            </header>

            <main className="flex-grow overflow-y-auto">
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSelectFood(item)}
                                    className="w-full text-left p-4 border-b border-zinc-800 hover:bg-zinc-900 transition-colors"
                                >
                                    <p className="text-zinc-200">{item.description}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-8 text-zinc-500">
                        <p>No results found for "{query}"</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FoodSearchPage;
