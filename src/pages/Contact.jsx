import React from "react";
import ContactForm from "../components/core/About/ContactForm";
import { RiChatSmileAiFill } from "react-icons/ri";
import { PiMapPinAreaFill } from "react-icons/pi";
import { MdOutlineAlternateEmail } from "react-icons/md";

const ContactUS = () =>{
return(
     <div className=" flex items-center justify-center  gap-10 p-10 bg-gray-700 text-gray-400 ">
        <div className="flex flex-col gap-1 w-[500px] bg-gray-600 rounded-lg border-2 border-black">
            <div className="text-center text-2xl font-bold my-5 mx-5 flex flex-col items-start">
                <p><RiChatSmileAiFill className="inline-block mr-2 text-gray-300" />Chat with us</p>
                <p>Our friendly team is here to help you!</p>
            </div>
             <div className="text-center text-2xl font-bold my-5 mx-5 flex flex-col items-start">
                <p><PiMapPinAreaFill className="inline-block mr-2 text-gray-300" />Visit us</p>
                <p>Come and say hello at our office!</p>
                <p>Gandhi Chowk, multai(mp) ,460661</p>
            </div>
             <div className="text-center text-2xl font-bold my-5 mx-5 flex flex-col items-start">
                <p><MdOutlineAlternateEmail className="inline-block mr-2 text-gray-300" />Email us</p>
                <p>kktechsolution23@gmail.com</p>
            </div>
        </div>
        <ContactForm />
    </div>
)
}
export default ContactUS;