import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../services/operation/CreateCoursesApi";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { LuIndianRupee } from "react-icons/lu";
import { TbClockPlus } from "react-icons/tb";
import { IoIosShareAlt } from "react-icons/io";
import TextField from '@mui/material/TextField';
import { duration } from "@mui/material/styles";
import Sections from './Sections'
import Avatar from '@mui/material/Avatar';
import { buyCourse } from "../../services/operation/BuyCourse";
import { useDispatch, useSelector } from "react-redux";
import {addToCart} from "../../slice/cartSlice"
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/comman/ConfirmationModal";
import toast from "react-hot-toast";
import copy from 'copy-to-clipboard';  

export default function Course() {
    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };
    const { Course_Id } = useParams();
    const [course, setCourse] = useState(null);
    const value = course?.averageRating;
    const totalRatings = course?.totalRatings;
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(Course_Id);
                setCourse(data.course);
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };
        fetchCourse();
    }, [Course_Id]);

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const time = {
            hour: 'numeric',
            minute: 'numeric'

        }

        return date.toLocaleDateString('en-US', options, { timeZone: 'UTC' }) + ' I ' + date.toLocaleTimeString('en-US', time);
    };
    let lectureCount;
    let courseLength;
    if (course) {
        lectureCount = course?.sections.map(section => section.subsections.length).reduce((acc, count) => acc + count, 0);
        console.log("Lecture count:", lectureCount);
        courseLength = course?.sections.map(section => section.subsections.map(subsection => subsection.duration));
        // Flatten the array and add all the durations
        courseLength = courseLength.flat().reduce((acc, duration) => acc + parseFloat(duration), 0);
        
        console.log("Course length:", courseLength);
    }
    
        function secondsToHms(seconds) {
            if (!seconds) return '';
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return `${h}h ${m}m ${s}s`;
        }
    // }

    const [confirmationModal , setConfirmationModal] = useState(null);

    const handleBuyNow = () => {
        // Handle the buy now action
        if(token && user ) {
            buyCourse([Course_Id], token, user, navigate, dispatch);
            return ;
        }
        setConfirmationModal({
            text1 : "Are you sure you want to buy this course ?",
            text2: "Please login to continue",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        })
    }

    const handleAddToCart = () => {
        // Handle the add to cart action
        if(token && user) {
            dispatch(addToCart(course, token, user, navigate, dispatch));
            return ;
        }
        setConfirmationModal({
            text1 : "Are you sure you want to add this course in your cart ?",
            text2: "Please login to continue",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        });

    }
    const handleShare =()=>{
        copy(window.location.href);
        toast.success("Course link copied to clipboard");
    }

    console.log("Course data:", course);

    return (
        <div>
            {course ? (
                <div>
                    <div className="w-full h-[400px] bg-gray-800 relative">
                        <div className="flex flex-col items-start h-full gap-3 ml-[200px] pt-[100px]">
                            <p className="text-5xl text-white">{course.courseName}</p>
                            <p className="text-xl text-gray-400">{course?.category.name}</p>
                            <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
                                <p className="text-xl text-white mr-2">{course?.averageRating}</p>
                                <Rating
                                    name="text-feedback"
                                    value={value}
                                    readOnly
                                    precision={0.5}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <Box sx={{ ml: 2 }} className="text-sm text-gray-500 flex"><p className="text-gray-300 text-xl">{labels[value]}</p></Box>
                                <span className="flex text-xl ml-2 text-gray-300"><p className="mr-2">{`(${totalRatings} `}</p> reviews)</span>
                                <span className="flex text-xl ml-2 text-gray-300">{course?.enrollmentCount}</span>
                                <span className="text-xl ml-2 text-gray-300" >students </span>
                                <span className="text-xl ml-1 text-gray-300" >enrolled </span>
                            </Box>
                            <p className="text-gray-200 text-lg flex gap-2">    <Avatar alt="Remy Sharp" src={course?.instructorId?.additionalInfo?.profilePicture} /> <span className="text-gray-300 text-lg mr-2 mt-1">By {course?.instructorId.fullName}</span></p>
                            <p className="text-gray-200 text-xl flex gap-3 relative ml-7"><TbClockPlus className="absolute -left-7 top-1" /> Created on {formatDate(course?.createdAt)}</p>
                        </div>

                        <div className=" relative w-full h-[ bg-gray-900">
                            <div className="absolute -top-[300px] right-[250px] bg-white w-[400px] rounded-lg p-4 shadow-lg flex flex-col gap-2">

                                <img src={course?.image} alt={course?.courseName} className="w-[380px] h-30 object-cover shadow-lg shadow-slate-700 rounded-lg" />
                                <span className="pt-2 text-3xl text-gray-800 font-bold"><LuIndianRupee className="inline " /> {course?.price}</span>
                                {
                                    user && user.courses.includes(course._id) ? (
                                        <Link to={"/dashboard/enrolled-courses"} className="mt-2 bg-green-500 text-white py-2 mx-4 rounded text-xl font-bold"><p className="ml-[110px]">Go to Course</p></Link>
                                    ) : (
                                    <>
                                        <button onClick={() => handleBuyNow()} className="mt-2 bg-yellow-400 text-black py-2 mx-4 rounded text-xl font-bold">Buy Now</button>
                                        <button onClick={() => handleAddToCart()} className="mt-2 bg-blue-500 text-white py-2 mx-4 rounded text-xl font-bold">Add to Cart</button>
                                    </>
                                    )
                                }
                                <p className="pt-2 pl-20 text-gray-600 text-sm">10-Day Money Back Guarantee</p>
                                <button onClick={() => handleShare()} className=" relative pl-[130px]  text-green-500 hover:text-green-700 flex"> <IoIosShareAlt className=" absolute text-2xl top-1 " /> <p className="ml-8 text-xl">Share </p></button>

                            </div>

                            <div className="flex flex-col items-start h-full gap-3 ml-[200px] pt-[100px]">
                                <div className="w-[600px] text-white">
                                    <TextField
                                        label="Description"
                                        color="success"
                                        focused
                                        value={course?.description}
                                        multiline

                                        minRows={2}
                                        // rows={7}
                                        readOnly
                                        sx={{
                                            width: '100%',
                                            marginBottom: '20px',
                                            // minHeight: '250px',
                                            '& .MuiInputBase-input': {
                                                color: 'white',
                                                padding: '16px',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#4ade80',
                                                },
                                            }
                                        }}
                                    />
                                </div>
                                <div className="w-[600px] min-h-[150px] border-2 border-gray-300 rounded-sm pl-4">
                                    <p className="text-gray-300 text-2xl p-4">What you'll learn</p>
                                    <p className="text-gray-200 text-xl pl-6">{course.learnInCourse}</p>
                                </div>
                                <div className="">
                                    <p className="text-gray-300 text-2xl p-1">Course Content</p>
                                    <div className="flex gap-2 p-1">
                                        <p className="text-gray-200 text-xl pl-4">{course.sectionCount} section(s)</p>
                                        <p className="text-gray-200 text-xl pl-4">{lectureCount} lecture(s)</p>
                                        <p className="text-gray-200 text-xl pl-4">{secondsToHms(courseLength)}</p>
                                        <button className="text-gray-200 text-xl ">Collapse all sections</button>
                                    </div>
                                    {
                                        course.sections.map((section, index) => (
                                            <Sections key={index} content={section} />
                                        ))
                                    }
                                </div>

                            </div>
                        </div>
                    {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
                    </div>
                </div>
            ) : (
                <div>
                    <p>Loading...</p>
                </div>
            )
            }
        </div>
    )
}
