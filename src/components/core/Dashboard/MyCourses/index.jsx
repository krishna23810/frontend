import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllInstructorCourses } from "../../../../services/operation/CoursesApi";
import { useDispatch } from "react-redux";
import { MdModeEdit, MdDelete, MdAccessTime, MdCurrencyRupee, MdOutlinePublish, MdOutlineDrafts } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ConfirmationModal from '../../../comman/ConfirmationModal'
import {deleteCourse} from "../../../../services/operation/CreateCoursesApi";
import {resetCourseState,setStep} from "../../../../slice/courseSlice";
// import { useDispatch } from "react-redux";
// Loading Skeleton Component
const CourseSkeleton = () => (
    <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
                <div className="flex gap-6">
                    <div className="w-48 h-32 bg-slate-700 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-slate-700 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-slate-700 rounded animate-pulse w-full" />
                        <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6" />
                        <div className="flex gap-4 mt-4">
                            <div className="h-8 bg-slate-700 rounded animate-pulse w-24" />
                            <div className="h-8 bg-slate-700 rounded animate-pulse w-24" />
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
    </div>
);

// Empty State Component
const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20"
    >
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <MdOutlinePublish className="text-4xl text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Courses Yet</h3>
        <p className="text-slate-400 text-center max-w-sm mb-6">
            Start creating your first course to share your knowledge with students around the world.
        </p>
        <Link
            // onClick={() => resetCourseState()}
            to="/dashboard/add-course"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
            <button onClick={() => resetCourseState()}></button>
            Create Your First Course
        </Link>
    </motion.div>
);

// Course Status Badge
const StatusBadge = ({ status }) => {
    const statusConfig = {
        Published: {
            icon: <MdOutlinePublish className="w-4 h-4" />,
            color: "bg-green-500/20 text-green-400 border-green-500/30",
            text: "Published"
        },
        Draft: {
            icon: <MdOutlineDrafts className="w-4 h-4" />,
            color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            text: "Draft"
        }
    };

    const config = statusConfig[status] || statusConfig.Draft;

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
            {config.icon}
            {config.text}
        </span>
    );
};


// Course Card Component
const CourseCard = ({ course, index, setConfirmationModal, handleDeleteSection, loading ,dispatch}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50"
    >
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Course Image */}
            <div className="relative group">
                <img
                    src={course?.image}
                    alt={course?.courseName}
                    className="w-full lg:w-64 h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Course Details */}
            <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{course?.courseName}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                            {course?.description}
                        </p>
                    </div>
                    <StatusBadge status={course?.status} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                        <MdAccessTime className="w-4 h-4" />
                        <span>{course?.courseDuration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <MdCurrencyRupee className="w-4 h-4" />
                        <span className="flex font-semibold text-green-400">{course?.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <span>Type:</span>
                        <span className="text-blue-400">{course?.courseType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <span>Level:</span>
                        <span className="text-purple-400">{course?.courseLevel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <span>Total Sections:</span>
                        <span className="text-amber-400">{course?.sections.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <span>Total Students:</span>
                        <span className="text-pink-500">{course?.totalStudents}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Created: {new Date(course?.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated: {new Date(course?.updatedAt).toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                    <Link
                    onClick={() => dispatch(resetCourseState())}
                        to={`/dashboard/my-courses/editCourse/courseId=${course.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                        <button onClick={() => dispatch(resetCourseState())}></button>
                        <MdModeEdit
                         onClick={() => dispatch(resetCourseState())}
                         className="w-4 h-4" />
                        Edit
                    </Link>
                    <button
                        disabled={loading}
                        onClick={(e) => {
                            e.preventDefault();
                            setConfirmationModal({
                                text1: "Delete this Course?",
                                text2: "All the lectures in this course will be deleted.",
                                btn1Text: "Delete",
                                btn2Text: "Cancel",
                                courseId: course.id,
                                btn1Handler: () => handleDeleteSection(course.id),
                                btn2Handler: () => setConfirmationModal(null)
                            });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors duration-200">
                        <MdDelete className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function MyCourses() {

    const { token } = useSelector((state) => state.auth);
    const { myCourses } = useSelector((state) => state.course);
    const { step } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    console.log("step", step);

    const [instructorCourses, setInstructorCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInstructorCourses = async () => {
        try {
            setLoading(true);
            const response = await getAllInstructorCourses(token, dispatch);
            setInstructorCourses(myCourses?.courses || []);
        } catch (error) {
            console.log('Error fetching instructor courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        resetCourseState();
        if (!myCourses || myCourses?.courses?.length === 0) {
            fetchInstructorCourses();
        } else {
            setInstructorCourses(myCourses?.courses || []);
            setLoading(false);
        }
    }, [myCourses,instructorCourses]);

    const [confirmationModal, setConfirmationModal] = useState(null);
    const handleDeleteSection = async (courseId) => {
        console.log("token:", token);
        // Dispatch delete course action
        console.log("Deleting course with ID:", courseId);
        const result = await deleteCourse(courseId, token, dispatch);
        if (result) {
            console.log("Course deleted successfully:", result);
            fetchInstructorCourses(); // Refresh the course list
        } else {
            console.error("Failed to delete course");
        }
        setConfirmationModal(null);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">My Courses</h1>
                    <p className="text-slate-400">Manage and track all your created courses</p>
                </motion.div>

                {loading ? (
                    <CourseSkeleton />
                ) : instructorCourses.length > 0 ? (
                    <div className="space-y-6">
                        {instructorCourses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index}  setConfirmationModal={setConfirmationModal} handleDeleteSection={handleDeleteSection} loading={loading} dispatch={dispatch}/>
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
            
            {/* Confirmation Modal */}
            <ConfirmationModal modalData={confirmationModal} />
        </div>
    );
}
