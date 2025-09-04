import React from "react";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter, IoLogoLinkedin } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { GrSchedulePlay } from "react-icons/gr";
import { Link } from "react-router-dom";

const Futter = () => {
    return (
        <div >
            <div className=' bg-gray-900 text-white flex flex-col justify-center items-center' >
                <div className=' flex flex-wrap flex-row gap-20 justify-center items-start mx-10 py-10'>

                    <div className='flex flex-col justify-center gap-4 items-start'>
                        <p className='text-2xl font-bold'>Compny</p>
                        <Link to={"/about"}>
                            <p className='text-lg text-gray-400'>About</p>
                        </Link>
                        <Link to={"/contact"}>
                            <p className='text-lg text-gray-400'>Contact</p>
                        </Link>
                        <Link to={"/affiliate"}>
                            <p className='text-lg text-gray-400'>Affiliate</p>
                        </Link>

                        <div className='flex flex-row items-center justify-center gap-2'>
                            <Link to={"/facebook"}>
                                <IoLogoFacebook className='text-xl' />
                            </Link>
                            <Link to={"/instagram"}>
                                <IoLogoInstagram className='text-xl' />
                            </Link>
                            <Link to={"/twitter"}>
                                <IoLogoTwitter className='text-xl' />
                            </Link>
                            <Link to={"/linkedin"}>
                                <IoLogoLinkedin className='text-xl' />
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center gap-4 items-start'>
                        <p className='text-2xl font-bold'>Privacy Policy</p>
                        <Link to={"/terms"}>
                            <p className='text-lg text-gray-400'>Terms of Service</p>
                        </Link>
                        <Link to={"/refund"}>
                            <p className='text-lg text-gray-400'>Refund Policy</p>
                        </Link>
                        <Link to={"/copyright"}>
                            <p className='text-lg text-gray-400'>Copyright Policy</p>
                        </Link>
                        <br />

                        <p className='text-2xl font-bold'>Support</p>
                        <Link to={"/help"}>
                            <p className='text-lg text-gray-400'>Help Center</p>
                        </Link>
                        <Link to={"/faq"}>
                            <p className='text-lg text-gray-400'>FAQ</p>
                        </Link>
                        <Link to={"/contact"}>
                            <p className='text-lg text-gray-400'>Contact Us</p>
                        </Link>

                    </div>
                    <div className='flex flex-col justify-center gap-4 items-start'>
                        <p className='text-2xl font-bold'>Subjects</p>
                        <p className='text-lg text-gray-400'>AI/ML</p>
                        <p className='text-lg text-gray-400'>Web Development</p>
                        <p className='text-lg text-gray-400'>Data Science</p>
                        <p className='text-lg text-gray-400'>Cyber Security</p>
                        <p className='text-lg text-gray-400'>Blockchain</p>
                        <p className='text-lg text-gray-400'>Cloud Computing</p>
                        <p className='text-lg text-gray-400'>DevOps</p>
                        <p className='text-lg text-gray-400'>UI/UX Design</p>
                        <p className='text-lg text-gray-400'>Game Development</p>
                    </div>
                    <div className='flex flex-col justify-center gap-4 items-start'>
                        <p className='text-2xl font-bold'>Languages</p>
                        <p className='text-lg text-gray-400'>Python</p>
                        <p className='text-lg text-gray-400'>JavaScript</p>
                        <p className='text-lg text-gray-400'>Java</p>
                        <p className='text-lg text-gray-400'>C++</p>
                        <p className='text-lg text-gray-400'>C#</p>
                        <p className='text-lg text-gray-400'>PHP</p>
                        <p className='text-lg text-gray-400'>SQL</p>
                    </div>
                    <div className='flex flex-col justify-center gap-4 items-start'>
                        <p className='text-2xl font-bold'>Career building</p>
                        <p className='text-lg text-gray-400'>Career path</p>
                        <p className='text-lg text-gray-400'>Career services</p>
                        <p className='text-lg text-gray-400'>Resume building</p>
                        <p className='text-lg text-gray-400'>Interview preparation</p>
                        <p className='text-lg text-gray-400'>Job search</p>
                        <p className='text-lg text-gray-400'>Job placement</p>
                        <p className='text-lg text-gray-400'>Job training</p>
                        <p className='text-lg text-gray-400'>Job placement</p>
                    </div>
                </div>
            <div className="w-8/12 border-[1px] border-gray-500 mb-4"></div>
                <div className='flex gap-60 mb-4 items-center flex-wrap'>
                    <p className='text-lg text-gray-400 w-[50% ]'>Copyright © 2025 KK TECHSOLUTION. All rights reserved.</p>
                    <p className='text-lg '>Made with ❤️ by Krishna</p>
                </div>
            </div>
        </div>

    )
}
export default Futter;