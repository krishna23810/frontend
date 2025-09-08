import { useForm } from "react-hook-form";
import { login } from "../services/operation/AuthApi"
import { useDispatch } from "react-redux"
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../assets/comman/logo-full-white.png"

export default function Login() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        dispatch(login(data.email, data.password, navigate));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const preventPaste = (e) => {
        e.preventDefault();
        toast.error("Pasting password is disabled for security reasons.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            {/* Main login form */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 border border-white/20">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src={Logo}
                        alt="KK TechSolution"
                        className="h-[200px] mt-[-60px] mb-[-40px] w-auto object-cover"
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                                     transition-all duration-200 hover:bg-white/15"
                        />
                        {errors.email && (
                            <span className="text-red-300 text-sm mt-1 block">
                                This field is required
                            </span>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: true })}
                                placeholder="Enter your password"
                                onPaste={preventPaste}
                                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                                         transition-all duration-200 hover:bg-white/15 pr-10"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/80 hover:text-white focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-red-300 text-sm mt-1 block">
                                This field is required
                            </span>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg
                                 font-semibold hover:from-blue-600 hover:to-purple-600
                                 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2
                                 focus:ring-blue-400"
                    >
                        Login
                    </button>

                    {/* Links */}
                    <div className="text-center space-y-2">
                        <Link
                            to="/forgot-password"
                            className="text-blue-300 hover:text-blue-200 transition-colors duration-200 text-sm"
                        >
                            Forgot Password?
                        </Link>

                        <div className="text-white/80 text-sm">
                            <span>Don't have an account? </span>
                            <Link
                                to="/signup"
                                className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
