import { useForm, Controller } from "react-hook-form"
import { sendOtpApi, signup } from "../services/operation/AuthApi"
import { useDispatch } from "react-redux"
import OtpInput from 'react-otp-input';
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../assets/comman/logo-full-white.png"

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    console.log(data)
    dispatch(signup(
      data.accountType,
      data.firstname,
      data.lastname,
      data.email,
      data.password,
      data.confirmPassword,
      data.otp,
      data.gender,
      data.contactNum
      , navigate)
    )
  }

  return (
    <div className="pt-[100px] min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Main signup form */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-lg mx-4 border border-white/20">
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

          {/* First Name Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              {...register("firstname", { required: true })}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200 hover:bg-white/15"
            />
            {errors.firstname && (
              <span className="text-red-300 text-sm mt-1 block">
                This field is required
              </span>
            )}
          </div>

          {/* Last Name Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastname", { required: true })}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200 hover:bg-white/15"
            />
            {errors.lastname && (
              <span className="text-red-300 text-sm mt-1 block">
                This field is required
              </span>
            )}
          </div>

          {/* Contact Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              {...register("contactNum", { required: true, minLength: 10, maxLength: 10 })}
              placeholder="Enter your contact number"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200 hover:bg-white/15"
            />
            {errors.contactNum && (
              <span className="text-red-300 text-sm mt-1 block">
                This field is required and must be 10 digits
              </span>
            )}
          </div>

          {/* Gender and Account Type */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white text-sm font-medium mb-2">
                Gender
              </label>
              <select
                {...register("gender", { required: true })}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                         transition-all duration-200 hover:bg-white/15"
              >
                <option value="" className="text-black">Select Gender</option>
                <option value="Male" className="text-black">Male</option>
                <option value="Female" className="text-black">Female</option>
                <option value="Other" className="text-black">Other</option>
              </select>
              {errors.gender && (
                <span className="text-red-300 text-sm mt-1 block">
                  This field is required
                </span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-white text-sm font-medium mb-2">
                Account Type
              </label>
              <select
                {...register("accountType", { required: true })}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                         transition-all duration-200 hover:bg-white/15"
              >
                <option value="" className="text-black">Select Type</option>
                <option value="student" className="text-black">Student</option>
                <option value="instructor" className="text-black">Instructor</option>
              </select>
              {errors.accountType && (
                <span className="text-red-300 text-sm mt-1 block">
                  This field is required
                </span>
              )}
            </div>
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
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                         transition-all duration-200 hover:bg-white/15 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", { required: true })}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                         transition-all duration-200 hover:bg-white/15 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/80 hover:text-white focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-300 text-sm mt-1 block">
                This field is required
              </span>
            )}
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              OTP
            </label>
            <div className="flex items-center gap-4">
              <Controller
                name="otp"
                control={control}
                rules={{ required: true, minLength: 6, maxLength: 6 }}
                render={({ field: { onChange, value } }) => (
                  <OtpInput
                    value={value || ''}
                    onChange={onChange}
                    numInputs={6}
                    renderSeparator={<span className="text-white">-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      width: '3rem',
                      height: '3rem',
                      margin: '0 0.25rem',
                      fontSize: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => {
                  const email = watch("email");
                  if (!email) {
                    alert("Please enter a valid email before requesting OTP");
                    return;
                  }
                  dispatch(sendOtpApi(email));
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Send OTP
              </button>
            </div>
            {errors.otp && (
              <span className="text-red-300 text-sm mt-1 block">
                OTP is required and must be 6 digits
              </span>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg
                     font-semibold hover:from-blue-600 hover:to-purple-600
                     transition-all duration-200 shadow-lg focus:outline-none focus:ring-2
                     focus:ring-blue-400"
          >
            Sign Up
          </button>

          {/* Links */}
          <div className="text-center">
            <div className="text-white/80 text-sm">
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
