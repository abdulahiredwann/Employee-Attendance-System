import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdLock, IoMdMail } from "react-icons/io";
import logo from "../../../public/ABD tech company logo.png";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import AdminLoginService from "../../Services/adminLoginService";

// Define validation schema with zod
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(30, { message: "Password must be at most 30 characters" }),
});

// Define TypeScript types from the schema
type LoginFormData = z.infer<typeof schema>;

const AdminLogin: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPageLoaded, setPageLoaded] = useState<boolean>(false); // New state for page loading

  const navigate = useNavigate();
  // Initialize form handling with react-hook-form and zod resolver
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  // Simulate a slow network or page loading
  useEffect(() => {
    // Simulate a delay for loading
    const timer = setTimeout(() => {
      setPageLoaded(true); // Set page loaded to true after delay
    }, 1000); // Adjust the time to match the actual loading time

    return () => clearTimeout(timer);
  }, []);

  // Handle form submission
  const run: SubmitHandler<LoginFormData> = async (data) => {
    try {
      setLoading(true);
      await AdminLoginService(data);

      navigate(`/admin`);
    } catch (error: any) {
      setLoading(false);
      console.error("Login failed:", error); // Add this line
      toast.error(error.response?.data || error.message || "Something Wrong"); // Handle error response safely
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {!isPageLoaded ? (
          <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col items-center mb-6">
              <Skeleton circle={true} height={48} width={48} />
              <Skeleton height={40} width={200} className="mt-4" />
            </div>
            <div className="space-y-6">
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col items-center mb-6">
              <img className="h-12 mb-2" src={logo} alt="Company Logo" />
              <h1 className="text-2xl font-semibold text-gray-800">
                Admin Login
              </h1>
            </div>
            <form
              onSubmit={handleSubmit((data) => {
                run(data);
                reset();
              })}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={`input input-bordered w-full ${
                      errors.email ? "input-error" : ""
                    }`}
                  />
                  <IoMdMail
                    className="absolute top-3 right-3 text-gray-500"
                    size={20}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`input input-bordered w-full ${
                      errors.password ? "input-error" : ""
                    }`}
                  />
                  <IoMdLock
                    className="absolute top-3 right-3 text-gray-500"
                    size={20}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className={`w-full py-2 px-4 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <div className="flex items-center justify-center">
                  {isLoading && (
                    <span className="loading loading-infinity loading-lg mr-2"></span>
                  )}
                  <div className="flex items-center justify-center space-x-2">
                    {isLoading ? "Loading..." : "Login"}
                    <CiLogin className="ml" size={25} />
                  </div>
                </div>
              </button>
            </form>
            <div className="mt-6 text-center">
              <a
                href="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-500 hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminLogin;
