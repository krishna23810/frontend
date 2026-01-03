import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaClock, FaBook, FaPlayCircle, FaGraduationCap } from "react-icons/fa";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../../../services/operation/CoursesApi";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const UserEnrolledCourses = async () => {
        try {
            setLoading(true);
            console.log("token ",token);
            const response = await getUserEnrolledCourses(token, setEnrolledCourses);
            setEnrolledCourses(response?.allprogressData || []);
        } catch (error) {
            console.log('Error fetching enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        UserEnrolledCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-slate-700 rounded w-48 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-slate-800 rounded-xl p-6">
                                    <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    console.log("enrolledCourses", enrolledCourses);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        My Learning Journey
                    </h1>
                    <p className="text-slate-400 text-lg">
                        {enrolledCourses?.length || 0} courses enrolled • Keep learning and growing
                    </p>
                </div>

                {/* Course Grid */}
                {enrolledCourses?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course, index) => (
                            <div 
                                key={index} 
                                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
                            >
                                {/* Course Image */}
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={course?.courseId?.image} 
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                                        alt={course?.courseId?.courseName} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {course.progress ? course.progress : 0}% Complete
                                        </span>
                                    </div>
                                </div>

                                {/* Course Content */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                            {course?.courseId?.courseName}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-3">
                                            {course?.courseId?.description}
                                        </p>
                                    </div>

                                    {/* Course Details */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-slate-300">
                                            <FaClock className="mr-2 text-blue-400" />
                                            <span className="text-sm">{course?.courseId?.courseDuration}</span>
                                        </div>
                                        <div className="flex items-center text-slate-300">
                                            <FaBook className="mr-2 text-green-400" />
                                            <span className="text-sm">Enrolled</span>
                                        </div>
                                    </div>

                                    {/* Progress Section */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-400">Progress</span>
                                            <span className="text-sm font-semibold text-white">{course.progress}%</span>
                                        </div>
                                        <div className="relative">
                                            <ProgressBar
                                                completed={course.progress}
                                                bgColor="#3b82f6"
                                                isLabelVisible={false}
                                                height="8px"
                                                borderRadius="4px"
                                                baseBgColor="#374151"
                                                transitionTimingFunction="ease-out"
                                                animateOnRender
                                            />
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                    onClick={()=>{navigate(`/view-course/${course?.courseId?.id}/section/${course?.courseId?.sections[0]._id}/sub-section/${course?.courseId?.sections[0]?.subsections[0]?._id}`)}}
                                     className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                        <FaPlayCircle className="mr-2" />
                                        Continue Learning
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-center">
                            <FaGraduationCap className="text-6xl text-slate-600 mb-4 mx-auto" />
                            <h3 className="text-2xl font-bold text-white mb-2">No Courses Enrolled Yet</h3>
                            <p className="text-slate-400 mb-6 max-w-md">
                                Start your learning journey by enrolling in courses that interest you. 
                                Explore our catalog and find the perfect course for your goals.
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                                Browse Courses
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourses;
