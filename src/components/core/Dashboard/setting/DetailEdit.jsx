import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { setUser } from "../../../../slice/profileSlice";
import { getProfileDetails, updateProfileDetails} from "../../../../services/operation/UpdateData";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const DetailEdit = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.profile);
    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm();

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                about: user.additionalInfo?.about || '',
                dateOfBirth: user.additionalInfo?.dateOfBirth ? new Date(user.additionalInfo.dateOfBirth).toISOString().split('T')[0] : '',
                phoneNumber: user.additionalInfo?.phoneNumber || '',
                address: user.additionalInfo?.address || '',
                facebook: user.additionalInfo?.socialLinks?.facebook || '',
                twitter: user.additionalInfo?.socialLinks?.twitter || '',
                linkedin: user.additionalInfo?.socialLinks?.linkedin || '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            // Optimistic update
            const updatedUser = {
                ...user,
                firstName: data.firstName || user.firstName,
                lastName: data.lastName || user.lastName,
                additionalInfo: {
                    ...user.additionalInfo,
                    about: data.about || user.additionalInfo?.about,
                    dateOfBirth: data.dateOfBirth || user.additionalInfo?.dateOfBirth,
                    phoneNumber: data.phoneNumber || user.additionalInfo?.phoneNumber,
                    address: data.address || user.additionalInfo?.address,
                    socialLinks: {
                        facebook: data.facebook || user.additionalInfo?.socialLinks?.facebook,
                        twitter: data.twitter || user.additionalInfo?.socialLinks?.twitter,
                        linkedin: data.linkedin || user.additionalInfo?.socialLinks?.linkedin
                    }
                }
            };

            // Update UI immediately
            dispatch(setUser(updatedUser));

            // Then make API call
            await dispatch(updateProfileDetails(data));

        } catch (error) {
            toast.error("Update failed");
            // Revert on error
            dispatch(getProfileDetails());
        }
    };

    const handleDiscard = () => {
        reset();
    };

    return (
        <div className="flex w-[800px] flex-col gap-4 p-4 ml-10 rounded shadow-md bg-gray-800 text-white">
            <h1>Edit Details</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="relative flex  gap-4">
                <div className="flex gap-4 w-[50%] flex-col">
                    <div className="flex flex-col gap-2">
                        <label>First Name</label>
                        <input
                            type="text"
                            className="border p-1 rounded text-black text-xl"
                            {...register("firstName")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Last Name</label>
                        <input
                            type="text"
                            className="border p-1 rounded text-black text-xl"
                            {...register("lastName")}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>About</label>
                        <textarea
                            className="border p-1 rounded text-black text-xl h-[225px]"
                            {...register("about")}
                        />
                    </div>
                </div>
                <div className="flex gap-4 w-[50%] flex-col">
                    <div className="flex flex-col gap-2">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            className="border p-1 rounded text-black text-xl"
                            {...register("dateOfBirth")}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="border p-1 rounded text-black text-xl"
                            {...register("phoneNumber")}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Address</label>
                        <input
                            type="text"
                            className="border p-1 rounded text-black text-xl"
                            {...register("address")}
                        />
                    </div>
                    <div>
                        <label>Social Links</label>
                        <div className="flex flex-col gap-4 text-3xl ">
                            <div className="flex gap-4">
                                <FaFacebook className="text-blue-600" />
                                <input
                                    type="text"
                                    className="border p-1 rounded text-black text-xl"
                                    placeholder="Facebook URL"
                                    {...register("facebook")}
                                />
                            </div>
                            <div className="flex gap-4">
                                <FaTwitter className="text-blue-400" />
                                <input
                                    type="text"
                                    className="border p-1 rounded text-black text-xl"
                                    placeholder="Twitter URL"
                                    {...register("twitter")}
                                />
                            </div>
                            <div className="flex gap-4">
                                <FaLinkedin className="text-blue-700" />
                                <input
                                    type="text"
                                    className="border p-1 rounded text-black text-xl"
                                    placeholder="LinkedIn URL"  
                                    {...register("linkedin")}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex absolute gap-3 top-[450px] right-0">
                        <button type="submit" className="  bg-yellow-500 text-black py-2 px-4 rounded">Save Changes</button>

                        <button type="button" onClick={handleDiscard} className="  bg-red-500 text-black py-2 px-4 rounded">Discard Changes</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DetailEdit;
