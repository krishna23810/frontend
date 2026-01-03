import React from "react";
import { Link } from "react-router-dom";
import {logout} from "../../services/operation/AuthApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileDropDown = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const handleLogout = () => {
        // Perform logout logic here
        dispatch(logout(navigate));
    };

    return (
        <div className="absolute -right-0 mt-2 w-30 top-8 bg-white text-gray-600 border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-2">
                <button onClick={() => navigate("/dashboard/enrolled-courses")}>
                <li className="px-4 py-2 hover:bg-gray-100">Dashbord</li>
                </button>
                <button onClick={() => navigate("/dashboard/my-profile")}>
                <li className="px-4 py-2 hover:bg-gray-100">Profile</li>
                </button>
                <button onClick={handleLogout}>
                <li className="px-4 py-2 hover:bg-gray-100">Logout</li>
                </button>
            </ul>
        </div>
    );
};

export default ProfileDropDown;
