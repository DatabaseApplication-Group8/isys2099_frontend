"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import { login } from "@/api/auth.api";
import { ILoginProps } from "@/types/user";
import axios from "axios";
import { useUserContext } from "@/app/context";
import Link from 'next/link';

export default function Login() {
  const { user } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in both fields.");
      setLoading(false);
      return;
    }

    const loginData: ILoginProps = { email, password };

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username: loginData.email,
        password: loginData.password,
      });
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("accessToken", response.data.access_token);
      console.log(response.data);
      
      if (response.data.access_token) {
        if (response.data.role === 1) {
          window.location.href = "/admin/dashboard";
        } else if (response.data.role === 2) {
          window.location.href = "/staff";
        } else if (response.data.role === 3) {
        window.location.href = "/profile";
      } else {
        setError(response.data?.message || "Invalid email or password.");
        }
      }
    } catch (error) {
      const statusCode: string | undefined = error?.toString().split("AxiosError: Request failed with status code ")[1];
      console.log(statusCode);
      if (statusCode === "401") {
        setError("Invalid Email/ Password");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="login min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-col flex-grow bg-white p-8 justify-center items-center">
        <div className="container p-12 rounded-md w-[50%] bg-[#BFD2F8] bg-opacity-[50%] shadow-md">
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold mb-8 text-[#1F2B6C]">Login to your account</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-3">
              <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-3 border border-gray-300 text-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] w-full"
                required
              />
            </div>

            <div className="flex flex-col space-y-3">
              <label htmlFor="password" className="text-sm font-semibold text-[#1F2B6C]">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="p-3 border text-black border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] w-full"
                  required
                />
                <div
                  onClick={handleShowPassword}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.48 19.48C17.6152 20.9015 15.3445 21.6889 13 21.7273C5.36364 21.7273 1 13 1 13C2.35697 10.4712 4.23906 8.26176 6.52 6.52001M10.7091 4.53455C11.46 4.35878 12.2288 4.27092 13 4.27273C20.6364 4.27273 25 13 25 13C24.3378 14.2388 23.5481 15.4052 22.6436 16.48M15.3127 15.3127C15.0131 15.6343 14.6518 15.8922 14.2503 16.071C13.8489 16.2499 13.4155 16.3461 12.9761 16.3539C12.5367 16.3616 12.1002 16.2808 11.6927 16.1162C11.2852 15.9516 10.915 15.7066 10.6042 15.3958C10.2934 15.085 10.0484 14.7149 9.88383 14.3073C9.71923 13.8998 9.63839 13.4633 9.64615 13.0239C9.6539 12.5845 9.75008 12.1511 9.92896 11.7497C10.1078 11.3482 10.3657 10.9869 10.6873 10.6873"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M1 1L25 25"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1 9.72727C1 9.72727 5.36364 1 13 1C20.6364 1 25 9.72727 25 9.72727C25 9.72727 20.6364 18.4545 13 18.4545C5.36364 18.4545 1 9.72727 1 9.72727Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12.9998 13C14.8073 13 16.2725 11.5348 16.2725 9.72732C16.2725 7.91984 14.8073 6.45459 12.9998 6.45459C11.1923 6.45459 9.72705 7.91984 9.72705 9.72732C9.72705 11.5348 11.1923 13 12.9998 13Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex flex-col justify-center items-center">
              <button
                type="submit"
                disabled={loading}
                className="h-[45px] w-full mt-4 border border-[#C5DCFF] rounded-md
                          bg-[#1F2B6C] text-white
                          hover:bg-[#1D3F7F] hover:shadow-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="flex justify-center items-center mt-3">
              <Link href="/register" className="text-[#1F2B6C] hover:text-[#1D3F7F] text-sm">
                Don’t have an account? <span className="text-red-500">Register</span>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
