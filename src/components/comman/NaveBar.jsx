import React, { useState, useEffect, useRef} from 'react';
import { Link, matchPath } from 'react-router-dom';
import Logo from '../../assets/comman/logo-full-white.png';
import { NavbarLinks } from '../../data/naveBar-kinl';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdShoppingCart } from "react-icons/md";
import { apiConnector } from "../../services/apiconnector"
import { categoriesApi } from "../../services/apis";
import { IoCaretDownCircleOutline } from "react-icons/io5";
import ProfileDropDown from './profileDropDown';
import { useDispatch } from 'react-redux';
import {setCategory} from '../../slice/profileSlice';
import {logout} from "../../services/operation/AuthApi";
import { useNavigate } from 'react-router-dom';
// import ProfilePic from  '../../assets/profilePic/WIN_20250803_14_51_50_Pro.jpg'


const NavBar = () => {
    const { token } = useSelector((state) => state.auth);
    const {category} = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.profile);
    const profilePic = user?.additionalInfo?.profilePicture ;
    const account = "Instructor";
    const navigate = useNavigate();
    // console.log("User data:", user);
    // console.log("Token:", token);
    // console.log("Profile ", account);

    // console.log("Profile Picture: ", profilePic);

    const [sublinks, setSublinks] = useState([]);
   const handleLogout = () => {
        dispatch(logout(navigate)); 
    }
    function loginDropDown (){
        return (
            <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
                <Link to="/profile" className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Profile</Link>
                <button 
                onClick={handleLogout}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                    Logout
                </button>
            </div>
        );
    }

    const dispatch = useDispatch();
    const getCategories = async () => {
        try {
            const result = await apiConnector("GET", categoriesApi.CATEGORIES_API)
            console.log("Category API result:", result?.data?.categories);
            if (result.status === 200) {
                dispatch(setCategory(result.data.categories));
                localStorage.setItem("category", JSON.stringify(result.data.categories));
                setSublinks  (result.data.categories);
                console.log("sublink result : ", sublinks);
                console.log("Categories from profile slice", category);

            } else {
                setSublinks([]);
                console.error("Failed to fetch categories or invalid data");
            }
        }
        catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getCategories();
    }, [])

    const refProfile = useRef();

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const profileDropDown = () => {
        setIsProfileOpen(!isProfileOpen);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refProfile.current && !refProfile.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    const location = useLocation();
    const currentPage = (route) => {
        return matchPath({ path: route, end: true }, location.pathname);
    }
    return (
        <div className="h-[80px] flex items-center justify-center bg-gray-600 border-b-2 border-gray-500">
            <div className="w-11/12 text-white p-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    <img src={Logo} alt="Logo" className="h-[68px] w-[200px] object-cover" loading='lazy' />
                </Link>

                <nav>
                    <ul>
                        {NavbarLinks.map((link, index) => (
                            <li key={index} className="inline-block mx-4">
                                {
                                    link.title === "Catalog" ? (
                                        <div className="flex group text-lg font-semibold px-4 py-2 hover:bg-gray-500 rounded relative ">
                                            {link.title}
                                            <IoCaretDownCircleOutline className="ml-1 mt-1 h-6 w-6" />

                                            <div className='invisible absolute -left-[50px] top-[63px]  flex flex-col rounded-md bg-white p-4 text-black
                                            opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[250px] z-10'>

                                                <div className='invisible absolute left-[109px] -top-[5px]  flex flex-col rounded-md bg-white p-4 text-black -rotate-45
                                            opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[60px] lg:h-[40px] -z-10'>

                                                </div>

                                                {
                                                    category.length ? (
                                                        <div className='flex flex-col items-center w-full'>{
                                                            category.map((sublink, index) => (
                                                                <Link key={index} to={`/catalog/${sublink.name.split(" ").join("-").toLowerCase()}`} className="text-lg font-semibold py 2 hover:bg-yellow-300 rounded mb-2 px-3 py-2">
                                                                    <p> {sublink.name}</p>
                                                                </Link>
                                                            )
                                                            )
                                                        }
                                                        </div>) : (<div></div>)
                                                }
                                            </div>


                                        </div>
                                    ) : (
                                        <Link to={link.path} className={`text-lg font-semibold px-4 py-2 hover:bg-gray-500 rounded ${currentPage(link?.path) ? 'bg-yellow-500 text-black hover:bg-yellow-500    ' : ''}`}>
                                            {link.title}
                                        </Link>
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* login / sing up / dashbord  */}
                <div className='flex space-x-4 relative'>
                    {
                        token && user?.accountType != account ? (<div>
                            <Link to="/dashboard/cart" className="text-lg font-semibold px-4 py-2 relative">
                                <MdShoppingCart className='text-white inline-block mr-2' />
                                {
                                    totalItems > 0 ? (
                                        <span className=' text-gray-400 absolute'>{totalItems}</span>
                                    ) : ""
                                }
                            </Link>
                        </div>) : (<div className='flex space-x-4'>
                            <Link to="/signup" className="text-lg font-semibold px-4 py-2 border-2 hover:bg-gray-500 rounded">
                                Sign Up
                            </Link>
                            <Link to="/login" className="text-lg font-semibold px-4 py-2 border-2 hover:bg-gray-500 rounded">
                                Login
                            </Link>
                        </div>)
                    }
                    {
                        token && user ? (< >
                        <button onClick={profileDropDown}> 
                            <img src={profilePic} className='w-14 h-8 left-11 -top-0 absolute rounded-full object-cover' />
                        </button>
                        <div className={`profileDrop ${isProfileOpen ? 'visible' : 'invisible'}`} ref={refProfile}>
                        <ProfileDropDown  />
                        </div>
                        </>):(<>
                        
                        </>)

                    }

                </div>

            </div>
        </div>
    );
};

export default NavBar;
