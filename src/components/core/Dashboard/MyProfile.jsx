import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CuButton from "../HomePage/CusButton";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

const MyProfile = () => {

    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    console.log("we are in my profile", user);

    return (
        <div className="w-11/12 flex flex-col gap-4  pl-16">
            <h1 className="text-white text-2xl">My Profile</h1>

            {/* section 1 */}
            <div className="flex  items-center gap-4 ml-10 p-4 justify-between rounded shadow-md bg-gray-800  text-white">
                <div className="flex  items-center gap-4 w-[800px]">
                    <img src={user?.additionalInfo?.profilePicture} alt="Profile"
                        className="aspect-square w-[100px] h-[100px] rounded-full object-cover" />
                    <div>
                        <p>{user?.firstName + " " + user?.lastName}</p>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                </div>
                <CuButton Linkto={"/dashboard/settings"} active={true}>
                    <div className="flex items-center gap-2">
                        Edit 
                        <FaEdit />
                    </div>
                </CuButton>
            </div>

            {/* section 2 */}
            <div className="flex flex-col gap-4 p-4 ml-10 rounded shadow-md bg-gray-800 text-white">
                <div className="flex justify-between items-center">
                    <p>About</p>
                    <CuButton Linkto={"/dashboard/settings"} active={true}><div className="flex items-center gap-2">
                        Edit 
                        <FaEdit />
                    </div></CuButton>
                </div>
                {
                    user?.additionalInfo?.about ? (
                        <div>
                            <p className="text-gray-400">{user?.additionalInfo?.about}</p>
                        </div>
                    ) : (
                        <p className="text-gray-400">Write something about yourself</p>
                    )
                }
            </div>

            {/* section 3 */}

            <div className="flex flex-col gap-4 p-4 ml-10 rounded shadow-md bg-gray-800 text-white">
                <div className="flex justify-between items-center">
                    <p>Personal Details</p>
                    <CuButton Linkto={"/dashboard/settings"} active={true}><div className="flex items-center gap-2">
                        Edit 
                        <FaEdit />
                    </div></CuButton>
                </div>
                <div className="flex w-full gap-4">

                    <div className="flex flex-col gap-10 w-[50%]">
                        <div className="flex flex-col">
                            <p className="text-gray-400">First Name</p>
                            {user?.firstName}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-400">Email</p>
                            {user?.email}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-400">Gender</p>
                            {user?.additionalInfo?.gender
                                ? user?.additionalInfo?.gender
                                : "Not provided"}
                        </div>

                    </div>

                    <div className="flex flex-col gap-10 w-[50%]">
                        <div className="flex flex-col">
                            <p className="text-gray-400">Last Name</p>
                            {user?.lastName}
                        </div>

                        <div className="flex flex-col">
                            <p className="text-gray-400">Phone Number</p>
                            {user?.additionalInfo?.phoneNumber
                                ? user?.additionalInfo?.phoneNumber
                                : "Not provided"}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-400">Date of Birth</p>
                            {user?.additionalInfo?.dateOfBirth ? new Date(user?.additionalInfo?.dateOfBirth).toISOString().split('T')[0] : 'Not provided'}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5" >
                    <p className="text-gray-400">Address</p>
                    {user?.additionalInfo?.address
                        ? user?.additionalInfo?.address
                        : "Not provided"}
                </div>

                <div className="flex flex-col gap-4 ">
                    <p className="text-gray-400">Social Links</p>
                    <div className="flex gap-10">
                        <FaFacebook className="text-blue-600 text-4xl" />
                        <div className="border-2  p-2 rounded flex items-center justify-between">
                            {
                                user?.additionalInfo?.socialLinks?.facebook ? (
                                    <a href={user?.additionalInfo?.socialLinks?.facebook} target="_blank" rel="noopener noreferrer">
                                        <p className="text-blue-600">{
                                            user?.additionalInfo?.socialLinks?.facebook
                                        }</p>
                                    </a>
                                ) : (
                                    <p className="text-gray-500 px-8">Not provided</p>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex gap-10">

                        <FaTwitter className="text-blue-400 text-4xl" />
                        <div className="border-2 p-2 rounded flex items-center justify-between">
                            {
                                user?.additionalInfo?.socialLinks?.twitter ? (
                                    <a href={user?.additionalInfo?.socialLinks?.twitter} target="_blank" rel="noopener noreferrer">
                                        <p className="text-blue-600">
                                            {
                                                user?.additionalInfo?.socialLinks?.twitter
                                            }
                                        </p>
                                    </a>
                                ) : (
                                    <p className="text-gray-500 px-8">Not provided</p>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex gap-10">

                        <FaLinkedin className="text-blue-700 text-4xl" />
                        <div className="border-2  p-2 rounded flex items-center justify-between">
                            {
                                user?.additionalInfo?.socialLinks?.linkedin ? (
                                    <a href={user?.additionalInfo?.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
                                        <p className="text-blue-600">
                                            {user?.additionalInfo?.socialLinks?.linkedin}
                                        </p>
                                    </a>
                                ) : (
                                    <p className="text-gray-500 px-8">Not provided</p>
                                )
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
};

export default MyProfile;