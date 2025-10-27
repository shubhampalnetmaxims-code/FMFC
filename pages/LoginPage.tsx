import React, { useState } from 'react';
import { ADMIN_USER, TEST_USER } from '../constants';
import type { User } from '../types';
import Icon from '../components/Icon';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email.toLowerCase() === 'shubham@gmail.com' && password === '123456') {
            onLogin(TEST_USER);
        } else if (email.toLowerCase() === 'admin@gmail.com' && password === '123456') {
            onLogin(ADMIN_USER);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-block bg-zinc-900 p-4 rounded-full mb-4">
                        <Icon type="community" className="w-12 h-12 text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-100">FMFC</h1>
                    <p className="text-zinc-400 mt-2 uppercase text-sm tracking-wider">Sign in to Forge Your Fitness</p>
                </div>

                <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-zinc-400 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="bg-zinc-800 border-zinc-700 border shadow-sm rounded-lg w-full py-3 px-4 text-zinc-200 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-zinc-400 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                           className="bg-zinc-800 border-zinc-700 border shadow-sm rounded-lg w-full py-3 px-4 text-zinc-200 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                     <div className="text-center mt-4 text-xs text-zinc-500">
                        <p>Use <span className="font-mono text-amber-300">Shubham@gmail.com</span> or <span className="font-mono text-amber-300">admin@gmail.com</span></p>
                        <p>Password: <span className="font-mono text-amber-300">123456</span></p>
                    </div>
                </form>
                <p className="text-center text-zinc-600 text-xs">
                    &copy;2024 FMFC. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;