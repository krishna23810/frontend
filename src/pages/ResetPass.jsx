import React from "react";
import { resetPassword } from "../services/operation/AuthApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";



const ResetPass = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { loading } = useSelector((state) => state.auth);
    const location = useLocation();
    const token = location.pathname.split("/").at(-1);
    console.log('Reset password token:', token);
    const dispatch = useDispatch();
    const [passwordUpdate, setPasswordUpdate] = useState(false);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword(token, newPassword, confirmPassword, navigate, setPasswordUpdate));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4 text-lg">
            {
                loading ? (
                    <div>Loading...</div>

                ) : (
                    <div>
                        {
                            passwordUpdate ? (
                                
                                <div className="flex flex-col items-center gap-5">
                                    <p className= "text-4xl text-green-500">Password reset successfully!</p>

                                    <p className="text-2xl">Redirecting to login...</p>
                                </div>
                            ) : (
                                <div className="bg-white p-4 rounded-md shadow-md flex flex-col gap-5" >
                                    <h2 className="text-2xl font-bold">Reset Password</h2>
                                    <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                                            Reset Password
                                        </button>
                                    </form>

                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}

export default ResetPass;