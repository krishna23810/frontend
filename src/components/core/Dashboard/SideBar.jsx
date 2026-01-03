import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../../../services/operation/AuthApi";
import { useDispatch } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import { useSelector } from "react-redux";
import SidebarLink from "./SideBarLinks";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);

    if (authLoading || profileLoading) return <div>Loading...</div>;


    const handleLogout = () => {
        dispatch(logout(navigate));
    };


    return (
        <div className="min-w-max h-[calc(100vh -4rem)] bg-gray-800 text-white ">
            <div className="p-4">
                <h2 className="text-xl font-bold">Dashboard</h2>
                <p className="text-sm">Welcome, {user ? user.name : "User"}</p>
            </div>
            <div className="flex flex-col space-y-2 p-4">
                {
                    sidebarLinks.map((link) => {
                        if (link.type && user?.accountType !== link.type) return null;

                        return (
                            <SidebarLink key={link.id} link={link} iconName={link.icon} />
                        );
                    })}
                <div className="py-3"></div>
                <div className="flex items-center flex-col space-y-2 h-[1px] bg-gray-500 "></div>
                <div className="py-3"></div>
                <SidebarLink key="settings" link={{ name: "Settings", path: "dashboard/settings" }} iconName="VscSettingsGear" />
                <button onClick={handleLogout} className="mt-2 text-sm text-gray-400 hover:text-white">
                    Logout
                </button>

            </div>
        </div>
    );
};

export default SideBar;
