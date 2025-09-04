import React from 'react'
import { Link } from 'react-router-dom';

const Button = ({ children,Linkto,active}) => {
    return (
        <Link to={Linkto}>
            <div className={`${active ? "bg-yellow-400 text-black" : "bg-gray-800"} px-6 py-3 
            rounded-md gap-2 font-bold transition-all duration-300 hover:scale-105`}>
                {children}
            </div>
        </Link>
    )
}

export default Button;