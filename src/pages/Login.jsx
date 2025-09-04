import { useForm } from "react-hook-form";
import { login } from "../services/operation/AuthApi"
import { useDispatch } from "react-redux"
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

    // Generate floating particles
    const generateParticles = () => {
        const particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push({
                id: i,
                size: Math.random() * 15 + 5,
                x: Math.random() * 100,
                y: Math.random() * 100,
                duration: Math.random() * 20 + 10,
                delay: Math.random() * 5,
                opacity: Math.random() * 0.3 + 0.1,
                color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, `
            });
        }
        return particles;
    };

    const [particles] = useState(generateParticles());

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 via-pink-900 via-orange-900 to-indigo-900 animate-gradient-x">
            {/* Enhanced animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full animate-float"
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animationDuration: `${particle.duration}s`,
                            animationDelay: `${particle.delay}s`,
                            opacity: particle.opacity,
                            background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`
                        }}
                    />
                ))}

                {/* Glowing orbs */}
                <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-r from-pink-400/15 to-orange-400/15 rounded-full animate-pulse blur-xl delay-2000"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-400/25 to-blue-400/25 rounded-full animate-pulse blur-xl delay-1000"></div>

                {/* Animated grid pattern */}
                <div className="absolute inset-0 opacity-10 animate-grid-move">
                    <div className="grid-pattern"></div>
                </div>
            </div>

            {/* Main login form */}
            <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 border border-white/30 border-opacity-30">
                {/* Glow effect around form */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

                {/* Logo */}
                <div className="flex justify-center mb-8 relative z-20">
                    <img
                        src={Logo}
                        alt="KK TechSolution"
                        className="h-20 w-auto filter drop-shadow-2xl"
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-20">
                    {/* Email Input */}
                    <div className="relative">
                        <label className="block text-white/90 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 
                                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                                     transition-all duration-300 hover:bg-white/15 backdrop-blur-sm"
                        />
                        {errors.email && (
                            <span className="text-red-300 text-sm mt-1 block animate-pulse">
                                This field is required
                            </span>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <label className="block text-white/90 text-sm font-medium mb-2">
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
                                         transition-all duration-300 hover:bg-white/15 backdrop-blur-sm pr-10"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/80 hover:text-white focus:outline-none transition-colors duration-200"
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-red-300 text-sm mt-1 block animate-pulse">
                                This field is required
                            </span>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg 
                                 font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 
                                 transition-all duration-300 shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-2 
                                 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-purple-900 backdrop-blur-sm"
                    >
                        Login
                    </button>

                    {/* Links */}
                    <div className="text-center space-y-3">
                        <Link
                            to="/forgot-password"
                            className="text-blue-300 hover:text-blue-200 transition-colors duration-200 text-sm 
                                     hover:underline hover:underline-offset-2"
                        >
                            Forgot Password?
                        </Link>

                        <div className="text-white/80 text-sm">
                            <span>Don't have an account? </span>
                            <Link
                                to="/signup"
                                className="text-blue-300 hover:text-blue-200 transition-colors duration-200 
                                         hover:underline hover:underline-offset-2 ml-1"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            {/* Enhanced Custom CSS */}
            <style jsx>{`
                @keyframes gradient-x {
                    0% { 
                        background-position: 0% 50%;
                        background: linear-gradient(135deg, #1e3a8a 0%, #7e22ce 25%, #be185d 50%, #ea580c 75%, #3730a3 100%);
                    }
                    25% { 
                        background-position: 50% 100%;
                        background: linear-gradient(135deg, #7e22ce 0%, #be185d 25%, #ea580c 50%, #3730a3 75%, #1e3a8a 100%);
                    }
                    50% { 
                        background-position: 100% 50%;
                        background: linear-gradient(135deg, #be185d 0%, #ea580c 25%, #3730a3 50%, #1e3a8a 75%, #7e22ce 100%);
                    }
                    75% { 
                        background-position: 50% 0%;
                        background: linear-gradient(135deg, #ea580c 0%, #3730a3 25%, #1e3a8a 50%, #7e22ce 75%, #be185d 100%);
                    }
                    100% { 
                        background-position: 0% 50%;
                        background: linear-gradient(135deg, #3730a3 0%, #1e3a8a 25%, #7e22ce 50%, #be185d 75%, #ea580c 100%);
                    }
                }
                
                @keyframes float {
                    0% {
                        transform: translateY(0px) rotate(0deg);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(0px) rotate(360deg);
                        opacity: 0.7;
                    }
                }

                @keyframes grid-move {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: 50px 50px;
                    }
                }

                .animate-gradient-x {
                    background-size: 400% 400%;
                    animation: gradient-x 20s ease infinite;
                    background: linear-gradient(135deg, #1e3a8a 0%, #7e22ce 25%, #be185d 50%, #ea580c 75%, #3730a3 100%);
                }

                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }

                .animate-grid-move {
                    animation: grid-move 20s linear infinite;
                }

                .grid-pattern {
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 50px 50px;
                    width: 100%;
                    height: 100%;
                }

                .shadow-3xl {
                    box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}
