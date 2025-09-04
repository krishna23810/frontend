import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CliButton from '../components/core/HomePage/CusButton';
import HomeVideo from "../assets/homedata/home_codeing.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter, IoLogoLinkedin } from "react-icons/io5";
import Codingontable from '../assets/homedata/video_2025-08-05_15-46-13.mp4';
import { FaUserTie } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { GrSchedulePlay } from "react-icons/gr";
import Teacher from '../assets/homedata/teacher.jpg';
import Futter from '../components/comman/futter';
import { Explore } from '../components/core/HomePage/Explor';
import Logo from '../assets/comman/logo-full-white.png'
import ReviewSlider from '../components/comman/ReviewSlider';

const Home = () => {
    return (
        <div>
            {/* section 1 */}
            <div className='flex relative mx-auto flex-col w-11/12 items-center text-white'>
                <Link to={"/signup"}>
                    <div className='flex flex-row items-center justify-center mt-5 gap-10'>
                        <img src={Logo} alt="Logo" className="h-[180px] w-[250px] object-cover" loading='lazy' />
                        <div className='mt-6 flex items-center justify-center gap-2 fonst-bold bg-gray-500 text-gray-300 px-4 py-2 
                    transition-all duration-300 hover:bg-red-700 hover:text-white hover:scale-105 rounded-full'>
                            <div className='flex items-center gap-2 flex-row gap- rounded-full '>
                                <p>Become a Instructor</p>
                                <FaArrowRight />
                            </div>
                        </div>
                    </div>
                </Link>

                <div className='mt-5 text-center text-4xl font-bold'>
                    Empower your future with
                    <HighlightText text={"Coding Skills"} />
                </div>

                <div className='mt-6 text-center text-2xl font-semibold text-gray-400'>
                    Learn from the best instructors in the industry and take your skills to the next level
                </div>

                <div className='mt-10 flex items-center justify-center gap-4'>
                    <CliButton Linkto={"/signup"} active={false}>
                        Learn M ore
                    </CliButton>
                    <CliButton Linkto={"/login"} active={true}>
                        Book a Demo
                    </CliButton>
                </div>

                <div className='mt-10 mx-3 my-10 w-8/12 h-[500px] relative border-2 border-indigo-400 shadow-2xl shadow-indigo-500/50 z-10 '>
                    <div className='mt-3 mx-3 my-4 bg-white w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-20'></div>
                    <video autoPlay muted loop className='w-full h-full object-cover  overflow-hidden z-20'>
                        <source src={HomeVideo} type='video/mp4' />
                    </video>
                    <div className='absolute top-80 left-60 flex items-center justify-center z-30 text-white text-4xl font-bold'>
                        <div className='text-white text-4xl font-bold'>
                            <p>Learn to code</p>
                            <p>gather skills for your future.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center'>
                <CodeBlocks
                    position={"lg:flex-row"}
                    Heading={<div className='text-4xl font-bold'>
                        unlock your future with
                        <HighlightText text={"Us"} />
                        with our courses
                    </div>}
                    subHeading={"Our courses are designed to help you learn to code and build your skills"}
                    butt1={{
                        text: "try it yourself",
                        link: "/signup",
                        active: true
                    }}
                    butt2={{
                        text: "learn more",
                        link: "/login",
                        active: false
                    }}
                    codeblock={
                        `<<!Doctype html>>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8"/>
                        <title>Document</title>
                        </head>
                        <body>
                        <h1>Hello World</h1>
                        </body>
                        </html>`
                    }
                    backgroundgradient={"from-black to-gray-900"}
                    codeColor={"text-yellow-400"}
                />
            </div>
            <div className='flex flex-col items-center justify-center'>
                <CodeBlocks
                    position={"lg:flex-row-reverse"}
                    Heading={<div className='text-4xl font-bold'>
                        Start your journey with
                        <HighlightText text={"Experts"} />
                    </div>}
                    subHeading={"Go ahead, give it a try. From zero to hero with our expert instructors"}
                    butt1={{
                        text: "continue",
                        link: "/login",
                        active: true
                    }}
                    butt2={{
                        text: "learn more",
                        link: "/login",
                        active: false
                    }}
                    codeblock={
                        `import React from "react";
                        import ReactDOM from "react-dom/client";
                        function Hello(props) {
                            return <h1>Hello World!</h1>;
                            }
                            
                            const container = document.getElementById('root');
                            const root = ReactDOM.createRoot(container);
                            root.render(<Hello />);`
                    }
                    backgroundgradient={"from-black to-gray-900"}
                    codeColor={"text-blue-500"}
                />
            </div>

            <div className='flex flex-col items-center justify-center my-10 font-semibold'>
                <p className='text-4xl text-white'>Unlock the <HighlightText text={"Power of Code"} /></p>
                <p className='text-xl text-gray-400'>Learn to Build Anything You Can Imagine </p>
                <Explore />
            </div>

            {/* section 2 */}
            <div className=' flex flex-col items-center justify-center bg-white shadow-2xl rounded-lg '>
                <div className='homepage_bg h-[300px] w-11/12 relative'>
                    <div className='absolute top-16 left-1/2 transform -translate-x-1/2 flex flex-row gap-10 justify-center items-center h-full text-white '>

                        <CliButton Linkto={"/signup"} active={true}>
                            <div className='flex flex-row gap-2 items-center'>
                                <p>Explore Full Catalog</p>
                                <FaArrowRight />
                            </div>
                        </CliButton>
                        <CliButton Linkto={"/signup"} active={false}>
                            <div className='flex flex-row gap-2 items-center'>
                                <p>Learn More</p>
                            </div>
                        </CliButton>
                    </div>
                </div>

                <div className='flex flex-row items-center w-11/12 justify-center gap-20 my-10'>

                    <div >
                        <div className='text-2xl font-bold text-center'>
                            <HighlightText text={"Why Choose Us?"} />
                        </div>
                        <div className='text-center text-lg text-gray-500'>
                            <div className='text-4xl font-bold'>
                                <p>Get the sikill you need for a
                                    <HighlightText text={"Job"} /> </p>
                                <p> in the tech industry</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center my-6">
                        <p className="text-xl text-gray-700 font-semibold ">KK TECHSOLUTION is your gateway to mastering tech skills with expert-led courses.</p>
                        <p className="text-lg text-gray-500 mb-4">Join us to accelerate your learning and build a successful career in technology.</p>
                        <CliButton Linkto={"/signup"} active={true}>
                            <div className='flex flex-row gap-2 items-center'>
                                <p>Learn More</p>
                            </div>
                        </CliButton>
                    </div>

                </div>
                <div className='flex flex-col items-center lg:flex-row justify-center w-11/12  gap-10'>

                    <div className='flex  gap-10 justify-center items-start w-11/12 my-10'>
                        <div className='flex flex-row lg:flex-col gap-10 justify-center items-start relative'>
                            <div className='flex flex-col items-start justify-center gap-4'>
                                <div className='flex flex-row gap-3'>
                                    <FaUserTie className='text-2xl font-bold text-blue-900' />
                                    <div className='text-2xl font-bold'>Expert Instructors</div>
                                </div>
                                <pre className='text-lg text-gray-500 font-serif'>         Learn from industry experts with years of experience </pre>
                            </div>
                            <div className='flex flex-col items-start justify-center gap-4'>
                                <div className='flex flex-row gap-3'>
                                    <FaLaptopCode className='text-2xl font-bold  text-green-500' />
                                    <div className='text-2xl font-bold'>Hands-on Learning</div>
                                </div>
                                <pre className='text-lg text-gray-500 font-serif' >         Practical projects to build your portfolio </pre>
                            </div>
                            <div className='flex flex-col items-start justify-center gap-4'>
                                <div className='flex flex-row gap-3'>
                                    <GrSchedulePlay className='text-2xl font-bold  text-red-500' />
                                    <div className='text-2xl font-bold'>Responsibility</div>
                                </div>
                                <pre className='text-lg text-gray-500 font-serif'>         Studends will always be our top priority </pre>
                            </div>
                            <div className='flex flex-col items-start justify-center gap-4'>
                                <div className='flex flex-row gap-3'>
                                    <GrSchedulePlay className='text-2xl font-bold  text-violet-700' />
                                    <div className='text-2xl font-bold'>Solve the problem</div>
                                </div>
                                <pre className='text-lg text-gray-500 font-serif'>         Code your way to success</pre>
                            </div>

                            <div className='flex flex-col items-start justify-center gap-4'>
                                <div className='flex flex-row gap-3'>
                                    <GrSchedulePlay className='text-2xl font-bold  text-yellow-600' />
                                    <div className='text-2xl font-bold'>Flexible Schedule</div>
                                </div>
                                <pre className='text-lg text-gray-500 font-serif'>         Learn at your own pace, anytime, anywhere</pre>
                            </div>
                        </div>
                    </div>
                    <div className='relative z-30'>
                        <div className='absolute inset-10 -left-10 border-4 border-solid border-blue-300 rounded-full w-[900px] -z-10 opacity-60 ring-2 ring-blue-500'></div>
                        <div className='absolute inset-10 left-32  border-4 border-solid border-blue-300 rounded-full w-[610px] -z-10  rotate-90 opacity-60 ring-2 ring-blue-500'></div>

                        <video className='object-cover rounded-lg overflow-hidden shadow-xl shadow-gray-900/30 z-20' autoPlay muted loop>
                            <source src={Codingontable} type='video/mp4' />
                        </video>
                        <div className='absolute top-[400px] left-[160px] h-28 w-[500px] z-30 text-white text-4xl font-bold flex flex-row gap-20 bg-green-800 justify-center rounded-lg shadow-2xl '>
                            <div className='text-2xl font-bold text-center mt-4 flex flex-row gap-4 items-center'>
                                <h1 className='py-2'>2</h1>
                                <pre>{`Years of \n Experience`}</pre>
                            </div>
                            <div className='text-2xl font-bold text-center mt-4 flex flex-row gap-4 items-center'>
                                <h1>20</h1>
                                <pre>{`Types of \n Courses`}</pre>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            {/* section 3 */}
            <div className='flex flex-col items-center justify-center bg-gray-400 shadow-2xl '>
                <div className='flex items-center justify-center gap-20 w-11/12 my-10'>

                    <div className='w-[40%]'>
                        <img src={Teacher} alt="Teacher" className='w-full h-[500px] object-cover rounded-t-lg border-t-8 border-l-8 border-spacing-72 border-black border-opacity-50' />
                    </div>

                    <div className='flex flex-col items-start justify-center gap-4 w-[50%]'>
                        <div>
                            <div className='text-4xl'>
                                <h1 className='font-bold text-white underline decoration-sky-500'>Become an</h1>
                                <HighlightText text={"Instructor"} />
                            </div>
                        </div>
                        <div>
                            <p className='text-xl text-gray-600'> Instructor from Around the world. Teach millions of students on. KK  TechSolution. We provide the tools and skills. To teach what you love. </p>
                        </div>
                        <br />

                        <CliButton Linkto={"/signup"} active={true}>
                            <div className='flex flex-row gap-2 items-center'>
                                <p>Start Teaching Today</p>
                                <FaArrowRight />
                            </div>
                        </CliButton>

                    </div>
                </div>
            
            </div>
            <ReviewSlider />
            {/* section 4 */}

            {/* section 5  footer*/}
            <Futter className='mt-10 text-gray-400' />
        </div>
    )
}

export default Home;