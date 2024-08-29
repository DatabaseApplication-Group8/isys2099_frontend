"use client";
import { useState } from 'react';
import Header from '@/components/Header/Header';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!email || !password) {
            setError('Please fill in both fields.');
            setLoading(false);
            return;
        }

        try {
            // Example login request (replace with actual API call)
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Redirect to the dashboard or home page
                window.location.href = '/dashboard';
            } else {
                setError('Invalid email or password.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login min-h-screen flex flex-col">
            <Header />
            <main className="flex flex-col flex-grow bg-white p-8 justify-center items-center">
                <div className='container p-20 rounded-md w-[50%] bg-[#BFD2F8] bg-opacity-[50%] shadow-md'>
                    <div className="flex justify-center">
                        <h1 className="text-3xl font-bold mb-8 text-[#1F2B6C]">Login to your account</h1>
                    </div>
                    <form onSubmit={handleLogin} className="container-content flex flex-col space-y-4">
                        <div className="text-lg flex flex-col space-y-3">
                            <div>
                                <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="p-3 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-semibold text-[#1F2B6C]">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="p-3 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] w-full"
                                    required
                                />
                            </div>

                            {error && <div className="text-red-500 text-sm">{error}</div>}

                            <div className="flex justify-center items-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="h-[45px] w-full mt-4 border-solid border-[3px] border-[#C5DCFF]
                                        text-[#1F2B6C] bg-white items-center justify-center
                                        hover:bg-[#1F2B6C] hover:text-white hover:border-0
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {loading ? 'Logging in...' : 'Log In'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
