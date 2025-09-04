import React from 'react'
import * as Icons from "react-icons/vsc"
import { matchPath, useLocation } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { NavLink} from 'react-router-dom';




const SidebarLink = ({ link, iconName }) => {

    // console.log("Rendering SidebarLink:", link.name);

    const Icon = Icons[iconName];
    const location = useLocation();
    // const dispatch = useDispatch();

    const matchRoute = (route, pathname) => {
        return matchPath({path : route}, location.pathname);
    };



    return (
        <NavLink
            to={link.path}
            className={`relative px-8 py-2 text-sm font-medium ${matchRoute(link.path) ? "bg-yellow-600 bg-opacity-70 " : " bg-opacity-0"}`}
        >
            <span
                className={`absolute inset-y-0 left-0 w-[0.25rem] bg-yellow-300 transition-all duration-300 ease-in-out
                ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}
            >
            </span>
            <div className="flex items-center gap-x-2">
                <Icon className="text-lg" />
                <span className="ml-2">{link.name}</span>
            </div>
        </NavLink>
    )
}
export default SidebarLink