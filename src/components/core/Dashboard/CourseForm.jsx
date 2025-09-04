import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { createCourse, updateCourse } from "../../../services/operation/CreateCoursesApi";
import { toast } from "react-hot-toast";
import { ImCancelCircle } from "react-icons/im";
import { setCourse, setStep } from "../../../slice/courseSlice";

export default function CourseForm({ onSuccess }) {
    console.log("CourseForm mounted");
    // console.log("CourseForm props:", { onSuccess });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful }
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const { category } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const courseType = watch("courseType");

  // Reset form when editCourse changes
  useEffect(() => {
    if (editCourse && course && category) {
      // Populate form for editing
      setValue("courseName", course.courseName);
      setValue("description", course.description);
      setValue("courseType", course.courseType);
      setValue("price", course.price);
      setValue("courseLevel", course.courseLevel);
      
      const matchedCategory = category.find((cat) => cat._id === course.category?._id);
      if (matchedCategory) {
        setValue("categoryID", matchedCategory._id);
      }
      
      const tagsString = Array.isArray(course.tags) ? course.tags.join(", ") : course.tags || "";
      setValue("tags", tagsString);
      
      setValue("learnInCourse", course.learnInCourse);
      setValue("courseDuration", course.courseDuration);
      
      if (course.image) {
        setPreview(course.image);
      }
    } else {
      // Reset for new course creation
      setValue("courseName", "");
      setValue("description", "");
      setValue("courseType", "");
      setValue("price", "");
      setValue("courseLevel", "");
      setValue("categoryID", "");
      setValue("tags", "");
      setValue("learnInCourse", "");
      setValue("courseDuration", "");
      setPreview(null);
      setSelectedFile(null);
    }
  }, [editCourse, course, category, setValue]);

  // Handle price based on course type
  useEffect(() => {
    if (courseType === "free") {
      setValue("price", 0);
    } else if (courseType === "paid") {
      setValue("price", "");
    }
  }, [courseType, setValue]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

    const onSubmit = async (data) => {
        setLoading(true);
        console.log("course", course);
        let status ;
        if(course){
          status = course.status;
        } 

        try {
            const courseData = {
                categoryID: data.categoryID,
                courseDuration: data.courseDuration,
                courseLevel: data.courseLevel,
                courseName: data.courseName,
                courseType: data.courseType,
                description: data.description,
                learnInCourse: data.learnInCourse,
                price: data.price,
                tags: data.tags.split(",").map(tag => tag.trim()),
                image: selectedFile,
                token,
                dispatch,
                setLoading,
                status: status  
            };

            if (editCourse && course) {
                // Update existing course
                const result = await updateCourse(
                    courseData.categoryID,
                    courseData.courseDuration,
                    courseData.courseLevel,
                    courseData.courseName,
                    courseData.courseType,
                    courseData.description,
                    courseData.learnInCourse,
                    courseData.price,
                    courseData.tags,
                    courseData.image,
                    courseData.token,
                    courseData.dispatch,
                    courseData.setLoading,
                    course._id,
                    courseData.status
                );
                
                if (onSuccess) {
                    onSuccess(result);
                }
            } else {
                // Create new course
                const result = await createCourse(
                    courseData.categoryID,
                    courseData.courseDuration,
                    courseData.courseLevel,
                    courseData.courseName,
                    courseData.courseType,
                    courseData.description,
                    courseData.learnInCourse,
                    courseData.price,
                    courseData.tags,
                    courseData.image,
                    courseData.token,
                    courseData.dispatch,
                    courseData.setLoading,
                    courseData.status
                );
                
                if (onSuccess) {
                    onSuccess(result);
                }
            }
        } catch (error) {
            console.error('Error submitting course:', error);
            toast.error(editCourse ? 'Failed to update course' : 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editCourse ? "Update Course" : "Create New Course"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course name"
                  {...register("courseName", {
                    required: "Course name is required",
                    minLength: { value: 3, message: "Course name must be at least 3 characters" }
                  })}
                />
                {errors.courseName && (
                  <p className="mt-1 text-sm text-red-400">{errors.courseName.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe your course in detail"
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 10, message: "Description must be at least 10 characters" }
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                )}
              </div>

              {/* Course Type and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Type *
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    {...register("courseType", { required: "Course type is required" })}
                  >
                    <option value="">Select course type</option>
                    <option value="paid">Paid Course</option>
                    <option value="free">Free Course</option>
                  </select>
                  {errors.courseType && (
                    <p className="mt-1 text-sm text-red-400">{errors.courseType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 0, message: "Price must be 0 or greater" }
                    })}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>
                  )}
                </div>
              </div>

              {/* Course Level and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Level *
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    {...register("courseLevel", { required: "Course level is required" })}
                  >
                    <option value="">Select course level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.courseLevel && (
                    <p className="mt-1 text-sm text-red-400">{errors.courseLevel.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    {...register("categoryID", { required: "Category is required" })}
                  >
                    <option value="">Select category</option>
                    {category?.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryID && (
                    <p className="mt-1 text-sm text-red-400">{errors.categoryID.message}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tags separated by commas"
                  {...register("tags", { required: "At least one tag is required" })}
                />
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-400">{errors.tags.message}</p>
                )}
              </div>

              {/* Learn in Course */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What You'll Learn *
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="List the key skills and concepts students will learn"
                  {...register("learnInCourse", { required: "What you'll learn is required" })}
                />
                {errors.learnInCourse && (
                  <p className="mt-1 text-sm text-red-400">{errors.learnInCourse.message}</p>
                )}
              </div>

              {/* Course Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (in months) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course duration"
                  {...register("courseDuration", {
                    required: "Duration is required",
                    min: { value: 0.1, message: "Duration must be at least 0.1 months" }
                  })}
                />
                {errors.courseDuration && (
                  <p className="mt-1 text-sm text-red-400">{errors.courseDuration.message}</p>
                )}
              </div>

              {/* Course Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/70 transition-colors">
                    {preview ? (
                      <>
                        <img src={preview} alt="Preview" className="object-cover w-full h-full rounded-lg" />
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-2xl text-red-500 hover:text-red-400"
                          onClick={handleRemoveImage}
                        >
                          <ImCancelCircle />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span>
                          </p>
                          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? "Processing..." : (editCourse ? "Update Course" : "Create Course")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
