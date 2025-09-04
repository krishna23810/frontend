import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BookOpen, Upload, Save, Clock, Tag, DollarSign, Users, Image, X, CheckCircle, AlertCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { updateCourse } from "../../../../../services/operation/CreateCoursesApi";
import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { setCourse, setFromMyCourse, setStep } from "../../../../../slice/courseSlice";

export default function WideUpdateCourse() {
    const [loading, setLoading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const { myCourses } = useSelector((state) => state.course);
    const { category } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const [courseData, setCourseData] = useState(null);
    const { step } = useSelector((state) => state.course);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm();

    const location = useLocation();
    const courseId = location.pathname.split("/").at(-1).split("=").at(-1);

    useEffect(() => {
        if (myCourses) {
            const foundCourse = myCourses?.courses.find((c) => c._id === courseId);
            if (foundCourse) {
                setCourseData(foundCourse);
            }
        }
    }, [myCourses, courseId]);

    useEffect(() => {
        if (courseData) {
            setValue("courseName", courseData.courseName || "");
            setValue("description", courseData.description || "");
            setValue("price", courseData.price || 0);
            setValue("category", courseData.category || "");
            setValue("tags", Array.isArray(courseData.tags) ? courseData.tags.join(", ") : courseData.tags || "");
            setValue("courseLevel", courseData.courseLevel || "");
            setValue("courseDuration", courseData.courseDuration || "");
            setValue("courseType", courseData.courseType || "");
            setValue("learnInCourse", courseData.learnInCourse || "");
            setValue("image", courseData.image || "");
        }
    }, [courseData, setValue]);

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setThumbnailPreview(null);
        setThumbnailFile(null);
    };

    const dispatch = useDispatch();
    const onSubmit = async (data) => {
        const formData = new FormData();

        // Only append changed fields
        if (data.courseName !== courseData.courseName) formData.append("courseName", data.courseName);
        if (data.description !== courseData.description) formData.append("description", data.description);
        if (data.price !== courseData.price) formData.append("price", data.price);
        if (data.category !== courseData.category) formData.append("categoryID", data.category);
        if (data.tags !== courseData.tags.join(", ")) formData.append("tags", JSON.stringify(data.tags.split(",").map(tag => tag.trim())));
        if (data.courseLevel !== courseData.courseLevel) formData.append("courseLevel", data.courseLevel);
        if (data.courseDuration !== courseData.courseDuration) formData.append("courseDuration", data.courseDuration);
        if (data.courseType !== courseData.courseType) formData.append("courseType", data.courseType);
        if (data.learnInCourse !== courseData.learnInCourse) formData.append("learnInCourse", JSON.stringify(data.learnInCourse));
        if (thumbnailFile) formData.append("image", thumbnailFile);

        try {
            setLoading(true);
            await updateCourse(formData, courseId, token, dispatch);
            toast.success("Course updated successfully");
            setThumbnailPreview(null);
            setThumbnailFile(null);
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    if (!courseData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600">Loading myCourses data...</p>
                </div>
            </div>
        );
    }
    
    console.log("Current step:", step);
    const updateDataOnClick = () => {
        dispatch(setCourse(courseData));
        dispatch(setStep(2));
        dispatch(setFromMyCourse(true));
        console.log("Current update step:", step);
        localStorage.setItem("course", JSON.stringify(courseData));
    }

    return (
        <div className="min-h-screen w-[1200px] mr-14 bg-gradient-to-br from-gray-500 to-blue-200">
            <div className="container max-w-full mx-auto py-8 px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <BookOpen className="h-12 w-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-gray-800 mb-2">
                                Update Course: {courseData.courseName}
                            </h1>
                            <p className="text-gray-600 text-xl">
                                Enhance your myCourses with updated content and details
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Progress Indicator */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Update Progress</h3>
                                <p className="text-lg text-gray-600">Track your changes</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isDirty ? (
                                    <span className="flex items-center gap-1 text-yellow-600 text-lg">
                                        <AlertCircle className="h-5 w-5" />
                                        Unsaved changes
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-green-600 text-lg">
                                        <CheckCircle className="h-5 w-5" />
                                        All changes saved
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Section */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Image className="h-8 w-8 text-blue-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Course Thumbnail</h3>
                                <p className="text-lg text-gray-600">Upload a compelling image that represents your course</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                    id="thumbnail-upload"
                                />
                                <label
                                    htmlFor="thumbnail-upload"
                                    className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                                >
                                    {thumbnailPreview || courseData.image ? (
                                        <div className="relative group">
                                            <img
                                                src={thumbnailPreview || courseData.image}
                                                alt="Course thumbnail"
                                                className="w-full h-80 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeThumbnail}
                                                className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload className="h-20 w-20 text-gray-400 mb-4" />
                                            <span className="text-xl text-gray-600">Click to upload or drag and drop</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Form Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm p-10">
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Basic Information</h3>
                                <p className="text-lg text-gray-600">Core details about your course</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label htmlFor="courseName" className="block text-lg font-medium text-gray-700 mb-2">
                                        myCourses Name *
                                    </label>
                                    <input
                                        id="courseName"
                                        {...register("courseName", { required: "Course name is required" })}
                                        placeholder="Enter an engaging myCourses title"
                                        className="w-full px-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    {errors.courseName && (
                                        <p className="text-red-500 text-lg mt-1">{String(errors.courseName?.message)}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                                        myCourses Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        {...register("description", { required: "Course description is required" })}
                                        rows={8}
                                        placeholder="Describe what students will learn and achieve..."
                                        className="w-full px-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-lg mt-1">{String(errors.description?.message)}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="learnInCourse" className="block text-lg font-medium text-gray-700 mb-2">
                                        What will students learn?
                                    </label>
                                    <textarea
                                        id="learnInCourse"
                                        {...register("learnInCourse")}
                                        rows={6}
                                        placeholder="List key skills or knowledge students will gain"
                                        className="w-full px-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        {...register("category", { required: "Category is required" })}
                                        className="w-full px-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select a category</option>
                                        {category.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 text-lg mt-1">{String(errors.category?.message)}</p>
                                    )}
                                </div>


                            </div>
                        </div>

                        {/*myCoursesDetails */}
                        <div className="bg-white rounded-xl shadow-sm p-10">
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Course Details</h3>
                                <p className="text-lg text-gray-600">Pricing, level, and technical specifications</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label htmlFor="price" className="block text-lg font-medium text-gray-700 mb-2">
                                        Price (₹) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <DollarSign className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <input
                                            id="price"
                                            type="number"
                                            {...register("price", {
                                                min: { value: 0, message: "Price must be positive" },
                                                valueAsNumber: true
                                            })}
                                            placeholder="2999"
                                            className="w-full pl-12 pr-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="text-red-500 text-lg mt-1">{String(errors.price?.message)}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="courseLevel" className="block text-lg font-medium text-gray-700 mb-2">
                                        myCoursesLevel *
                                    </label>
                                    <select
                                        id="courseLevel"
                                        {...register("courseLevel", { required: "Course level is required" })}
                                        className="w-full px-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select difficulty level</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    {errors.courseLevel && (
                                        <p className="text-red-500 text-lg mt-1">{String(errors.courseLevel?.message)}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="courseDuration" className="block text-lg font-medium text-gray-700 mb-2">
                                        Duration *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Clock className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <input
                                            id="courseDuration"
                                            type="number"
                                            {...register("courseDuration", { required: "Course duration is required" })}
                                            placeholder="3"
                                            className="w-full pl-12 pr-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                            <span className="text-gray-500 text-xl">months</span>
                                        </div>
                                    </div>
                                    {errors.courseDuration && (
                                        <p className="text-red-500 text-lg mt-1">{String(errors.courseDuration?.message)}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="courseType" className="block text-lg font-medium text-gray-700 mb-2">
                                        myCoursesType *
                                    </label>
                                    <select
                                        id="courseType"
                                        {...register("courseType", { required: "Course type is required" })}
                                        className="w-full px-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select pricing model</option>
                                        <option value="free">Free</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                    {errors.courseType && (
                                        <p className="text-red-500 text-lg mt-1">{String(errors.courseType?.message)}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="tags" className="block text-lg font-medium text-gray-700 mb-2">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        id="tags"
                                        {...register("tags")}
                                        placeholder="React, JavaScript, Frontend"
                                        className="w-full px-6 py-5 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*myCoursesStatistics */}
                    <div className="bg-white rounded-xl shadow-sm p-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800">Course Statistics</h3>
                                <p className="text-lg text-gray-600">Current performance metrics</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowStats(!showStats)}
                                className="text-xl text-blue-600 hover:text-blue-700"
                            >
                                {showStats ? 'Hide' : 'Show'} Stats
                            </button>
                        </div>

                        {showStats && (
                            <div className=" relative grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="bg-blue-50 rounded-lg p-8 text-center">
                                    <p className="text-4xl font-bold text-blue-600">{courseData.enrollmentCount || 0}</p>
                                    <p className="text-xl text-gray-600">Enrollments</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-8 text-center">
                                    <p className="text-4xl font-bold text-green-600">{courseData.totalRatings || 0}</p>
                                    <p className="text-xl text-gray-600">Total Ratings</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-8 text-center">
                                    <p className="text-4xl font-bold text-purple-600">{courseData.averageRating || 0}</p>
                                    <p className="text-xl text-gray-600">Average Rating</p>
                                </div>
                                <div className=" bg-orange-50 rounded-lg p-8 text-center">
                                    <p className="text-4xl font-bold text-orange-600">{courseData.sectionCount || 0}</p>
                                    <p className="text-xl text-gray-600">Sections</p>
                                </div>
                                <Link to={`/dashboard/add-course`} className="absolute top-28 right-12">
                                    <button
                                        onClick={updateDataOnClick}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 text-xl rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">Edit section</button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-8">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                reset();
                                setThumbnailPreview(null);
                                setThumbnailFile(null);
                            }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-5 px-10 text-xl rounded-lg transition-colors"
                        >
                            Reset Changes
                        </button>
                        {/* Update Course */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-5 px-10 text-xl rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                                    Updating Course...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Save className="h-6 w-6" />
                                    Update Course
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
