import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  BookOpen, 
  Upload, 
  Save, 
  Clock, 
  Tag, 
  DollarSign, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Eye,
  Edit3
} from "lucide-react";
import { updateCourse } from "../../../../../services/operation/CreateCoursesApi";
import { getAllInstructorCourses } from "../../../../../services/operation/CoursesApi";
import { setCourse } from "../../../../../slice/courseSlice";

export default function UpdateCourseForm() {
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const { myCourses } = useSelector((state) => state.course);
  const { category } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [courseData, setCourseData] = useState(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const courseId = location.pathname.split("/").at(-1).split("=").at(-1);

  // Watch form values for real-time updates
  const watchedValues = watch();

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
      setValue("category", courseData.category?._id || "");
      setValue("tags", Array.isArray(courseData.tags) ? courseData.tags.join(", ") : courseData.tags || "");
      setValue("courseLevel", courseData.courseLevel || "");
      setValue("courseDuration", courseData.courseDuration || "");
      setValue("courseType", courseData.courseType || "");
      setValue("learnInCourse", courseData.learnInCourse || "");
      setValue("status", courseData.status || "draft");
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

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Only append changed fields to reduce payload
    const changedFields = {};
    
    if (data.courseName !== courseData.courseName) {
      formData.append("courseName", data.courseName);
      changedFields.courseName = data.courseName;
    }
    if (data.description !== courseData.description) {
      formData.append("description", data.description);
      changedFields.description = data.description;
    }
    if (data.price !== courseData.price) {
      formData.append("price", data.price);
      changedFields.price = data.price;
    }
    if (data.category !== courseData.category?._id) {
      formData.append("categoryID", data.category);
      changedFields.category = data.category;
    }
    if (data.tags !== (Array.isArray(courseData.tags) ? courseData.tags.join(", ") : courseData.tags)) {
      const tagsArray = data.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      formData.append("tags", JSON.stringify(tagsArray));
      changedFields.tags = tagsArray;
    }
    if (data.courseLevel !== courseData.courseLevel) {
      formData.append("courseLevel", data.courseLevel);
      changedFields.courseLevel = data.courseLevel;
    }
    if (data.courseDuration !== courseData.courseDuration) {
      formData.append("courseDuration", data.courseDuration);
      changedFields.courseDuration = data.courseDuration;
    }
    if (data.courseType !== courseData.courseType) {
      formData.append("courseType", data.courseType);
      changedFields.courseType = data.courseType;
    }
    if (data.learnInCourse !== courseData.learnInCourse) {
      formData.append("learnInCourse", data.learnInCourse);
      changedFields.learnInCourse = data.learnInCourse;
    }
    if (data.status !== courseData.status) {
      formData.append("status", data.status);
      changedFields.status = data.status;
    }
    if (thumbnailFile) {
      formData.append("image", thumbnailFile);
      changedFields.image = "Updated";
    }

    // If no changes, show message
    if (Object.keys(changedFields).length === 0 && !thumbnailFile) {
      toast.error("No changes detected to update");
      return;
    }

    try {
      setLoading(true);
      
      const response = await updateCourse(
        data.category,
        data.courseDuration,
        data.courseLevel,
        data.courseName,
        data.courseType,
        data.description,
        data.learnInCourse,
        data.price,
        data.tags,
        thumbnailFile,
        token,
        dispatch,
        setLoading,
        courseId
      );

      if (response?.success) {
        toast.success("Course updated successfully");
        
        // Refresh the courses list
        await dispatch(getAllInstructorCourses(token));
        
        // Reset file states
        setThumbnailPreview(null);
        setThumbnailFile(null);
        
        // Optional: Navigate back to courses list
        // navigate("/dashboard/my-courses");
      }
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
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  const calculateProgress = () => {
    const totalFields = 9;
    let filledFields = 0;
    
    if (watchedValues.courseName?.trim()) filledFields++;
    if (watchedValues.description?.trim()) filledFields++;
    if (watchedValues.price !== undefined) filledFields++;
    if (watchedValues.category) filledFields++;
    if (watchedValues.courseLevel) filledFields++;
    if (watchedValues.courseDuration) filledFields++;
    if (watchedValues.courseType) filledFields++;
    if (watchedValues.learnInCourse?.trim()) filledFields++;
    if (watchedValues.tags?.trim()) filledFields++;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard/my-courses")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to My Courses
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isPreviewMode ? "Edit Mode" : "Preview Mode"}
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Update Course: {courseData.courseName}
                </h1>
                <p className="text-gray-600">Update your course details and content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Completion Progress</span>
              <span className="text-sm text-gray-500">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Course Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Status</h3>
            <select
              {...register("status")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Thumbnail Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Image className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Course Thumbnail</h3>
                <p className="text-sm text-gray-600">Upload a compelling image that represents your course</p>
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
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  {thumbnailPreview || courseData.image ? (
                    <div className="relative group">
                      <img
                        src={thumbnailPreview || courseData.image}
                        alt="Course thumbnail"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-gray-600">Click to upload or drag and drop</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name *
                </label>
                <input
                  {...register("courseName", { required: "Course name is required" })}
                  placeholder="Enter course name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.courseName && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={4}
                  placeholder="Describe your course"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What will students learn?
                </label>
                <textarea
                  {...register("learnInCourse")}
                  rows={3}
                  placeholder="List key learning outcomes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Course Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {category?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    {...register("price", { min: 0 })}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Level
                </label>
                <select
                  {...register("courseLevel")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (months)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    {...register("courseDuration")}
                    placeholder="3"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Type
                </label>
                <select
                  {...register("courseType")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("tags")}
                    placeholder="React, JavaScript, Web Development"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Course Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Course Statistics</h3>
              <button
                type="button"
                onClick={() => setShowStats(!showStats)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {showStats ? "Hide" : "Show"} Stats
              </button>
            </div>

            {showStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{courseData.enrollmentCount || 0}</p>
                  <p className="text-sm text-gray-600">Enrollments</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{courseData.totalRatings || 0}</p>
                  <p className="text-sm text-gray-600">Ratings</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{courseData.averageRating || 0}</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">{courseData.sections?.length || 0}</p>
                  <p className="text-sm text-gray-600">Sections</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Updating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" />
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
