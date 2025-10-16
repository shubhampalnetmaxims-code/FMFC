
import React from 'react';

interface UnderDevelopmentPageProps {
    pageName: string;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({ pageName }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen text-center px-4">
             <div className="text-6xl mb-4">🚧</div>
            <h1 className="text-2xl font-bold text-zinc-200 mb-2">Coming Soon!</h1>
            <p className="text-zinc-400 max-w-md">
                The <span className="font-semibold text-amber-400">{pageName}</span> section is currently under development. 
                We're working hard to bring you this feature. Please check back later!
            </p>
        </div>
    );
};

export default UnderDevelopmentPage;