import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/core/Dashboard/SideBar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {

    const {loading: authLoading} = useSelector((state) => state.auth);
    const { loading: profileLoading} = useSelector((state) => state.profile);

    if(authLoading || profileLoading){
        return (
            <div className="my-10">
                Loading...
            </div>
        )
    }

    return (
        <div className="relative flex min-h-[calc(100vh-4rem)] ">
            <Sidebar/>
            <div className="h-[calc(100vh -4rem)] overflow-auto">
                <div className="mx-auto w-11/12 py-10 flex flex-col gap-4 items-start">
                    <Outlet />
                </div>
            </div>
        </div>
    )

}

export default Dashboard;