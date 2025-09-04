import React from "react";
import { useForm } from "react-hook-form";
import { contactUs } from "../../../services/operation/OpenApi";
import { useDispatch } from "react-redux";
import { data } from "react-router-dom";
import { useState, useEffect } from "react";
import CountryCode from "../../../data/countryCode.json";


const ContactForm = () => {

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, isSubmitSuccessful },
    } = useForm()

    useEffect(() => {
        if (isSubmitSuccessful) {
            // Reset form fields or perform any other actions
            reset({
                firstName: "",
                lastName: "",
                email: "",
                countryCode: "+91",
                phone: "",
                message: ""
            })
        }
    }, [reset, isSubmitSuccessful])

    const dispatch = useDispatch();
    let mphone = (watch("countryCode") || "+91") + watch("phone");
    const onSubmit = (data) => {
        console.log(data)
        console.log("mphone", mphone);
        dispatch(contactUs(data.firstName, data.lastName, mphone, data.email, data.message, setLoading));
    }



    return (
        <div className="bg-gray-700 p-10 flex flex-col items-center  border-2 border-slate-50 ">
            <h2 className="text-3xl text-gray-300 mb-5">Contact Us</h2>
            <p className="text-xl text-gray-400">We'd love to hear from you! Please fill out the form below.</p>
            <form className="flex flex-col gap-4 mt-5 items-center" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-4">

                    <div className="flex flex-col gap-4">

                        <label htmlFor="firstName" className="text-gray-300">First Name</label>
                        <input type="text" id="firstName"
                            placeholder="First Name" className="p-2 rounded"
                            {...register("firstName", { required: true })}
                        />
                        {errors.firstName && <span className="text-red-500">First name is required</span>}
                    </div>
                    <div className="flex flex-col gap-4">
                        <label htmlFor="lastName" className="text-gray-300">Last Name</label>
                        <input type="text" id="lastName"
                            placeholder="Last Name" className="p-2 rounded"
                            {...register("lastName", { required: true })}
                        />
                        {errors.lastName && <span className="text-red-500">Last name is required</span>}
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-4 ">

                        <label htmlFor="email" className="text-gray-300">Email</label>
                        <input type="email" id="email"
                            placeholder="Email" className="p-2 rounded w-full"
                            {...register("email", { required: true })}
                        />
                    </div>
                    <div>

                        {errors.email && <span className="text-red-500">Email is required</span>}
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2">

                        <label htmlFor="phone" className="text-gray-300">Phone Number</label>
                        <div className=" flex gap-2 w-full">
                            <div className="">

                                <select id="countryCode"
                                    placeholder="+91"
                                    className="p-2 rounded text-black w-[70px]"
                                    {...register("countryCode", { required: true })}
                                >
                                    {
                                        CountryCode.map((element, index) => {
                                            return (
                                                <option key={index} value={element.code}>
                                                    {element.code} -{element.name}
                                                </option>
                                            )
                                        })
                                    }
                                    {errors.countryCode && <span className="text-red-500">Country code is required</span>}
                                </select>
                            </div >
                            <input type="tel" id="phone"
                                placeholder="Phone" className="p-2 rounded w-full"
                                {...register("phone", { required: true })}
                            />
                        </div>
                    </div>
                    {errors.phone && <span className="text-red-500">Phone number is required</span>}
                </div>
                <div className="w-full">
                    <label htmlFor="message" className="text-gray-300">Message</label>
                    <textarea id="message" placeholder="Your message" className="p-2 rounded w-full h-[200px]"
                        {...register("message", { required: true })}
                    />
                    {errors.message && <span className="text-red-500">Message is required</span>}
                </div>
                <button type="submit" className="bg-yellow-400 w-full text-black p-2 rounded">Submit</button>
            </form>
        </div>
    );
};

export default ContactForm;
