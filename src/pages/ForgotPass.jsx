import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { resetPasswordToken } from "../services/operation/AuthApi";

const ForgotPass = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [emailId, setEmailId] = useState("");
    const { loading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        // Here you would typically dispatch an action to send the email
        dispatch(resetPasswordToken(emailId, setEmailSent));

    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4 text-lg">
            {
                loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-white p-4 rounded-md shadow-md flex flex-col w-6/12 gap-5" >
                        <h1>
                            {
                                emailSent ? "Check email" : "Reset your password"
                            }
                        </h1>
                        <p>
                            {
                                emailSent ? `We have sent you an email with a link to reset your password at ${emailId}.`
                                    : "Have no fear, we will help you reset your password. We'll send you an email with instructions to reset your password. If you don't receive the email, please check your spam folder."

                            }
                        </p>
                        <form onSubmit={handleOnSubmit}>
                            {
                                !emailSent && (
                                    <div>
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={emailId}
                                            onChange={(e) => setEmailId(e.target.value)}
                                            required
                                            placeholder="Enter your email"
                                        />

                                    </div>

                                )
                            }
                            <button
                                className="bg-yellow-400 text-black px-4 py-2 rounded mt-4"
                                type="submit"
                            >{
                                    emailSent ? "Resend Reset Link" : "Send Reset Link"
                                }
                            </button>
                        </form>
                        <div className="mt-4 text-lg flex items-center">
                            <TiArrowBack />
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </div>
                )
            }
        </div>

    );
};

export default ForgotPass;
