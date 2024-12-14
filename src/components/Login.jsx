import React, { useState } from 'react';
import backgroundImage from '../assets/Rectangle 18.png';
import googleIcon from '../assets/google.png'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setLoading(true); 

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        
        throw new Error(data.message || 'Something went wrong');
      }

     
      console.log('Login successful:', data);

      localStorage.setItem('token', data.token);
      navigate('/');
     
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div
      className="flex items-center justify-between  h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Left Section: LOGO */}
      <div className="flex flex-col justify-center items-center w-1/2 h-full text-white">
        <span className="text-5xl font-bold">LOGO</span>
      </div>

      {/* Right Section: Login Form */}
      <div className="flex justify-center items-center w-1/2 h-full">
        <div className="bg-white w-full max-w-md p-12 rounded-lg shadow-lg h-[550px]">
          {/* Login Form */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in</h2>
          <p className="text-gray-600 mb-6">
            New user?{' '}
            <a href="#create-account" className="text-blue hover:underline">
              Create an account
            </a>
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full mr-auto bg-blue text-white py-2 px-4 border border-blue rounded-full hover:bg-blue hover:border-blue transition"
              disabled={loading} // Disable the button while loading
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Show error message */}
          {error && (
            <p className="text-red-500 text-sm mt-4">
              {error}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-sm text-gray-600">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Continue with Google */}
          <button className="w-full border border-gray-300 border border-blue rounded-full flex items-center justify-center py-2 px-4 rounded hover:bg-gray-100 transition">
            <img
              src={googleIcon} // Using the imported Google icon here
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bg-blue bottom-0 text-center w-full">
        <p className="text-white text-sm">&copy; 2024. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
