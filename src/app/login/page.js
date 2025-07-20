// pages/login.js or components/Login.jsx (if used as a component)
'use client';
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Assuming lucide-react is installed
import axios from "axios";
import { useRouter } from "next/navigation"; // For client-side navigation in Next.js 13+ app directory
import Link from "next/link"; // For client-side routing in Next.js
// import { useDispatch } from "react-redux"; // Assuming Redux is set up in your Next.js app
// import { loggedin } from "../state/counter/counterSlice"; // Adjust path as needed

// Environment variables in Next.js are prefixed with NEXT_PUBLIC_ for client-side access
const API_BASE_URL = process.env.NEXT_PUBLIC_API_NODE;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_BASE_URL) {
  console.error("NEXT_PUBLIC_API_NODE is not defined in .env");
  // In a production app, you might want to throw an error or handle this more gracefully.
  // For now, we'll just log it.
}
if (!API_KEY) {
  console.error("NEXT_PUBLIC_API_KEY is not defined in .env");
  // Same as above.
}

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const dispatch = useDispatch();
  const router = useRouter(); // Initialize useRouter hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            apikey: API_KEY, // Use NEXT_PUBLIC_API_KEY
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login response:", response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", username);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      localStorage.setItem("id", response.data.user.id);
      // localStorage.setItem("user_metadata", JSON.stringify(response.data.user.user_metadata));

      // Call the success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(username);
      }
      
      // Dispatch Redux action
      // dispatch(loggedin(true));
      
      // Navigate using Next.js router
      router.push("/company");
    } catch (err) {
      // Access error message safely
      setError(err.response?.data?.message || "Invalid login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username or Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10 transition duration-150 ease-in-out"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <p className="text-sm text-right">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>

          <p className="text-sm text-center text-gray-600">
            Not registered yet?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
