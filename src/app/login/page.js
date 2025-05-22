'use client';

// import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const result = await signIn('credentials', {
    //   redirect: false,
    //   username,
    //   password,
    // });
    try {
    const result = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    console.log('Login response:', result);
    const data = await result.json();
    console.log('Login data:', data);
    if (result.ok && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', username);
      alert('Login successful!');
    
      router.push('/');
    }
    else {
      alert('Login failed. Please check your credentials.');
      console.error('Login failed:', data);
      setError(data.message || 'Invalid credentials');
    }
  } catch (error) {
    alert('Login failed. Please check your credentials.');
    console.error('Error during login:', error);
    setError('An error occurred. Please try again.');
  }}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Please sign in to your account</p>
        </div>
        
        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              User Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}