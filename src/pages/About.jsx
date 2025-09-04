import React from "react";
import HighlightText from "../components/core/HomePage/HighlightText";
import Image1 from "../assets/about/photo_2025-08-08_23-43-40 (2).jpg"
import Image2 from "../assets/about/photo_2025-08-08_23-43-40.jpg"
import Image3 from "../assets/about/photo_2025-08-08_23-43-48.jpg"
import Image4 from "../assets/about/photo_2025-08-08_23-43-49.jpg"
import Image5 from "../assets/about/2.jpg"
import Image6 from "../assets/about/photo_2025-08-08_23-43-40 (2).jpg"
import StateCompa from "../components/core/About/StateCompa";
import LearningGrid from "../components/core/About/LearningGrid";
import ContactForm from "../components/core/About/ContactForm";
import ReviewSlider from "../components/comman/ReviewSlider"; 

import Futter from "../components/comman/futter"

const About = () => {
    return (
        <div>
            <section className="relative h-[1100px]">
                <div className="flex flex-col gap-5 w-1/2 items-center justify-center absolute top-[300px] left-[400px] transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-7xl text-gray-700">Divining innovation in Online Education for a
                        <HighlightText text="Bright Future." /> </p>
                    <p className="text-xl text-gray-500">KK tech Solution Forefront of driving innovating in online education. We're passionate about creating a brighter future by
                        offering cutting-edge courses, leveraging emerging technologies </p>
                </div>
                <img src={Image4} alt="About Us 5" className="w-full h-full object-cover" />
                <div className="absolute top-[950px] h- bg-black opacity-80 w-full ">
                    <p className="pl-80 left-10 text-4xl text-gray-300 w-[1300px] p-10">We are passionate about revolutionizing the way we learn. Our innovative platform <HighlightText text="combines technology, expertise," /> and community to create an unparalleled educational experience.</p>
                </div>
            </section>

            <section className="bg-gray-700 h-[1070px] flex flex-col gap-10 items-center">
                <div className="flex pt-60 gap-10">
                    <div className="p-10 flex flex-col gap-5 w-[50%]">
                        <p className="text-4xl text-gray-300"><HighlightText text="Our Founding Story" /></p>
                        <p className="text-xl text-gray-400">Our e-learning platform was born out of a shared view and passion for transforming education. It all began with a problem which I have faced, no proper guidance and resources were available to help me learn effectively. Frustrated by the limitations of traditional education, we set out to create a solution that would empower learners everywhere.</p>

                        <p className="text-xl text-gray-400">We are a diverse team of educators, technologists, and learners who recognized the need for excessively flexible and high-quality learning opportunities in a rapidly evolving digital world.</p>
                    </div>
                    <img src={Image3} className="object-cover ring-4 ring-indigo-500/40 ring-offset-2 ring-offset-lime-600 shadow-sm " alt="" />
                </div>

                <div className="flex gap-10 items-center justify-center mt-10 mb-5">
                    <div className="flex flex-col gap-5 w-[50%] p-10">
                        <p className="text-5xl text-gray-300"><HighlightText text="Our Vision" /></p>
                        <p className="text-xl text-gray-300">With this vision in mind, we set out on a journey to create an E-learning 
                            platform that would revolutionize the way people learn. Our team of dedicated expert working timelessly to develop a robust and intuitive platform that combines cutting-edges technologies with Engaging contents, fostering a dynamic and interactive learning experience. </p>
                    </div>
                    <div className="flex flex-col gap-5 w-[50%] p-10">
                        <p className="text-5xl text-gray-200"><HighlightText text="Our Mission" /></p>
                        <p className="text-xl text-gray-300">Our mission goes beyond just delivering courses online.
                             We wanted to create a vibrant community of learning where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through formal live sessions and networking opportunities.</p>
                    </div>
                </div>
            </section>


            <section className="bg-gray-800 h-[1730px] w-full flex flex-col gap-16 items-center">
                <div className=" bg-gray-500 p-10 mb-10 w-full">
                    <StateCompa />
                </div>
                    <LearningGrid />
            <div className="p-10 mb-10 ">

                    <ContactForm />
            </div>
            </section>
            <ReviewSlider />
            <Futter/>
        </div >
    );
};

export default About;