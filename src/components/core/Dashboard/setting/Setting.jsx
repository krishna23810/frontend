import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { updateProfilePicture } from "../../../../services/operation/UpdateData"
import { useDispatch } from "react-redux";
import DetailEdit from "./DetailEdit";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount } from "../../../../services/operation/UpdateData";
import { RiDeleteBinFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import {changePassword} from "../../../../services/operation/AuthApi"

const Setting = () => {
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            // Here you would typically upload the file to your server
            console.log("Uploading file:", selectedFile);
            dispatch(updateProfilePicture(selectedFile));
            // Reset after upload
            setSelectedFile(null);
            setPreview(null);
        }
    };

    const handleDeleteAccount = () => {
        dispatch(deleteUserAccount(navigate));
    };

    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm();

    const onSubmit = (data) => {
        console.log("Form data:", data);
        dispatch(changePassword(data.oldPassword, data.newPassword, data.confirmNewPassword, reset));
    };

     const handleDiscard = () => {
        reset();
    };
    return (
        <div className="w-full  flex flex-col gap-4  pr-16">
            <div className="mx-auto w-full py-10 flex flex-col gap-4 items-start">


                <h1 className="text-white text-2xl">Edit Profile</h1>

                {/* section 1 */}
                <div className="flex w-[800px] gap-4 p-4 ml-10 rounded shadow-md bg-gray-800 text-white">
                    <img
                        src={preview || user?.additionalInfo?.profilePicture}
                        alt="Profile"
                        className="aspect-square w-[100px] h-[100px] rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-400">Profile Picture</p>

                        <div className="flex items-center gap-2">

                            <button
                                className="mt-2 bg-gray-700 text-white py-1 px-2 rounded hover:bg-gray-600 transition-colors"
                                onClick={handleButtonClick}
                            >
                                Change Picture
                            </button>

                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {selectedFile && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-300">
                                        Selected: {selectedFile.name}
                                    </p>
                                    <button
                                        className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
                                        onClick={handleUpload}
                                    >
                                        Upload
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* section 2 */}
                <DetailEdit />
            </div>

            {/* <ResetPassword /> */}
            <div className="flex relative flex-col gap-4 w-[800px] p-4 ml-10 rounded shadow-md bg-gray-800 text-white">
                <h1 className="text-white text-2xl">Reset Password</h1>
                {/* <div className="flex  w-full gap-4 p-4 rounded shadow-md bg-gray-800 text-white"> */}

                <form onSubmit={handleSubmit(onSubmit)} className="flex  gap-4 rounded shadow-md bg-gray-800 text-white">
                    <div className="flex flex-col gap-2 w-[60%] justify-between ">
                        <input type="text" placeholder="Old Password"  className="w-full text-black p-2 rounded-md"
                        {...register("oldPassword" ,{ required: true }) }/>
                        {errors.oldPassword && <span className="text-red-500">Old Password is required</span>}
                        <input type="text" placeholder="New Password" className="w-full text-black p-2 rounded-md"
                        {...register("newPassword" ,{ required: true }) }/>
                        {errors.newPassword && <span className="text-red-500">New Password is required</span>}
                        <input type="text" placeholder="Confirm New Password" className="w-full text-black p-2 rounded-md"
                        {...register("confirmNewPassword" ,{ required: true }) }/>
                        {errors.confirmNewPassword && <span className="text-red-500">Confirm New Password is required</span>}
                    </div>
                    <div className="flex flex-col  gap-3 w-[40%] items-center top-[109px] right-4">
                        <button type="submit" className="  bg-yellow-500 text-black py-2  px-4 rounded">Save Changes</button>

                        <button type="button" onClick={handleDiscard} className="  bg-red-500 text-black py-2 px-4 rounded">Discard Changes</button>
                    </div>
                </form>
                        {/* </div> */}
            </div>

            <div className="flex w-[800px] gap-4 mt-10 p-4 ml-10 rounded shadow-md bg-gray-800 text-white">
                <RiDeleteBinFill className="text-red-600 text-4xl" />
                <div className="flex flex-col gap-2 items-start">
                        <p>Delete Account</p>
                        <p>Would you like to delete your account?</p>
                        <p>This account may contain Paid Courses. Deleting your account is permanent and cannot be undone.</p>
                        <button onClick={handleDeleteAccount} className=" text-red-600 py-2 rounded">
                            I want to delete my account</button>
                </div>
            </div>
        </div>
    );
};

export default Setting;
