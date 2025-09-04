    import React, { useEffect, useState, useRef } from 'react';
    import { useForm } from 'react-hook-form';
    import toast from 'react-hot-toast';
    import { useDispatch, useSelector } from 'react-redux';
    import { setCourse } from '../../../../../slice/courseSlice';
    import { ImCross } from "react-icons/im";
    import { FiUploadCloud, FiVideo, FiCheck, FiAlertCircle, FiEdit3, FiEye, FiPlus } from "react-icons/fi";
    import { MdDragIndicator, MdOutlineDelete, MdOutlineFileUpload } from "react-icons/md";
    import {createSubsection ,updateSubSection} from "../../../../../services/operation/CreateCoursesApi"

    export default function SubSectionModal({ modaData, setModalData, add = false, view = false, edit = false }) {
        // console.log("SubSectionModal mounted with data:", modaData);
        console.log("add", add);
        const {
            register,
            handleSubmit,
            formState: { errors },
            setValue,
            getValues,
            watch,
            reset
        } = useForm();

        const dispatch = useDispatch();
        const [loading, setLoading] = useState(false);
        const [showVideoUpload, setShowVideoUpload] = useState(false);
        const [videoDuration, setVideoDuration] = useState(null);
        const [videoPreview, setVideoPreview] = useState(null);
        const [uploadProgress, setUploadProgress] = useState(0);
        const [fileError, setFileError] = useState(null);
        const [isDragging, setIsDragging] = useState(false);
        const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
        const fileInputRef = useRef(null);
        const { token } = useSelector((state) => state.auth);
        const { course } = useSelector((state) => state.course);

        const watchedTitle = watch('title', '');
        const watchedDescription = watch('description', '');

        useEffect(() => {
            if (view || edit) {
                setValue('title', modaData.title);
                setValue('description', modaData.description);
                setValue('content', modaData.content);
                setValue('videoFile', modaData.videoUrl);
                setVideoPreview(modaData.videoUrl);
                setVideoDuration(modaData.duration);
            }
        }, []);

        const isFormUpdated = () => {
            const currentValue = getValues();
            if (currentValue.title !== modaData.title ||
                currentValue.description !== modaData.description ||
                currentValue.content !== modaData.content ||
                currentValue.videoFile !== modaData.videoUrl) {
                return true;
            }
            return false;
        };

        const validateFile = (file) => {
            const maxSize = 100 * 1024 * 1024; // 100MB
            const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/quicktime'];
            
            if (!file) return true;
            
            if (file.size > maxSize) {
                setFileError('File size must be less than 100MB');
                return false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                setFileError('Please upload a valid video file (MP4, AVI, MOV, MKV, or WebM)');
                return false;
            }
            
            setFileError(null);
            return true;
        };

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!validateFile(file)) {
                e.target.value = null;
                return;
            }
            setValue('videoFile', file);

            setUploadStatus('uploading');
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;
                setVideoDuration(duration);
                setVideoPreview(URL.createObjectURL(file));
                setUploadStatus('success');
                toast.success('Video loaded successfully!');
            };
            
            video.onerror = () => {
                setVideoDuration(null);
                setVideoPreview(null);
                setUploadStatus('error');
                toast.error('Error loading video file');
            };
            
            video.src = URL.createObjectURL(file);
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            setIsDragging(false);
        };

        const handleDrop = (e) => {
            e.preventDefault();
            setIsDragging(false);
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('video/')) {
                if (validateFile(file)) {
                    handleFileChange({ target: { files: [file] } });
                }
            } else {
                toast.error('Please drop a valid video file');
            }
        };

        const formatDuration = (seconds) => {
            if (!seconds) return '';
            
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            }
        };

        const handleEditSubSection = async (data) => {
            console.log("we are editing data", data);

            const formData = new FormData();
            const currentValue = getValues();

            // console.log("sectionId", modaData.sectionId);
            console.log("subsectionId", modaData._id);

            // formData.append("sectionId", modaData.sectionId);
            // formData.append("subSectionId", modaData._id);
            
            if (currentValue.title !== modaData.title)
                formData.append("title", currentValue.title);

            if (currentValue.description !== modaData.description)
                formData.append("description", currentValue.description);

            // Check if a new video file was uploaded
            // const videoFileInput = document.querySelector('input[name="videoFile"]');
            // const fileInput = videoFileInput || fileInputRef.current;
            // console.log("fileInput", fileInput);
            const newFile = new File([data.videoFile], "video.mp4", { type: "video/mp4" });
            // formData.append("videoFile", newFile);
            console.log("newFile", newFile);
            if (data.videoFile) {
                formData.append("videoFile", newFile);
            }

            if (videoDuration && videoDuration !== modaData.duration)
                formData.append("duration", videoDuration);
                
            //console form
    console.log("now printing data");
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            try {
                const response = await updateSubSection(formData, modaData._id, course._id, token);
                dispatch(setCourse(response));
                toast.success("Lecture updated successfully");
                return response;
            } catch (error) {
                console.error("Error updating lecture:", error);
                toast.error("Failed to update lecture");
                throw error;
            }
        };

        const onSubmit = async (data) => {
            if (view) return;

            setLoading(true);

            try {
                if (edit) {
                    if (!isFormUpdated()) {
                        toast.error("No changes detected");
                        setLoading(false);
                        return;
                    }
                    await handleEditSubSection(data);
                } else {
                    // Validate video file exists
                    if (!data.videoFile) {
                        toast.error("Please select a video file");
                        setLoading(false);
                        return;
                    }

                    const formData = new FormData();
                    formData.append("sectionId", modaData);
                    formData.append("title", data.title);
                    formData.append("description", data.description);
                    
                    // Handle video file correctly - could be File object or FileList
                    const videoFile = data.videoFile instanceof FileList 
                        ? data.videoFile[0] 
                        : data.videoFile instanceof File 
                        ? data.videoFile 
                        : null;
                    
                    if (!videoFile) {
                        toast.error("Please select a valid video file");
                        setLoading(false);
                        return;
                    }
                    
                    formData.append("videoFile", videoFile);
                    formData.append("duration", videoDuration || 0);

                    const response = await createSubsection(formData, modaData, course._id, token);
                    dispatch(setCourse(response));
                    toast.success("Lecture created successfully");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("Something went wrong");
            }

            setLoading(false);
            setModalData(null);
        };

        const getModalTitle = () => {
            if (view) return (
                <span className="flex items-center gap-2">
                    <FiEye className="w-5 h-5" />
                    View Lecture
                </span>
            );
            if (edit) return (
                <span className="flex items-center gap-2">
                    <FiEdit3 className="w-5 h-5" />
                    Edit Lecture
                </span>
            );
            if (add) return (
                <span className="flex items-center gap-2">
                    <FiPlus className="w-5 h-5" />
                    Add New Lecture
                </span>
            );
            return "Lecture Details";
        };

        const removeVideoPreview = () => {
            setVideoPreview(null);
            setVideoDuration(null);
            setUploadStatus('idle');
            setValue('videoFile', null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        };

        return (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                <div className="w-full max-w-2xl max-h-[90vh] bg-richblack-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-in">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-richblack-700 to-richblack-600 border-b border-richblack-600">
                        <h2 className="text-2xl font-bold text-yellow-50">
                            {getModalTitle()}
                        </h2>
                        <button
                            onClick={() => (!loading ? setModalData(null) : null)}
                            className="p-2 text-richblack-400 hover:text-richblack-200 transition-all duration-200 rounded-full hover:bg-richblack-600 hover:rotate-90"
                            disabled={loading}
                        >
                            <ImCross className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Video File Upload */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-richblack-5">
                                    Video File
                                    {view && <span className="text-xs text-richblack-400 ml-2">(Preview)</span>}
                                </label>
                                
                                {/* Video Preview */}
                                {videoPreview && !view && (
                                    <div className="relative group">
                                        <div className="relative overflow-hidden rounded-lg border border-richblack-600">
                                            <video 
                                                controls 
                                                className="w-full"
                                                src={videoPreview}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    type="button"
                                                    onClick={removeVideoPreview}
                                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                                                >
                                                    <ImCross className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-sm text-richblack-400">
                                            <span>Video Duration: {formatDuration(videoDuration)}</span>
                                            <span className="text-green-400">✓ Ready to upload</span>
                                        </div>
                                    </div>
                                )}

                                {/* Show current video when viewing */}
                                {view && modaData?.videoUrl && (
                                    <div className="relative">
                                        <div className="relative overflow-hidden rounded-lg border border-richblack-600">
                                            <video controls className="w-full">
                                                <source src={modaData.videoUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div className="mt-2 text-sm text-richblack-400">
                                            Video Duration: {formatDuration(modaData.duration)}
                                        </div>
                                    </div>
                                )}

                                {/* Show current video info when editing with change button */}
                                {edit && modaData?.videoUrl && !showVideoUpload && !videoPreview && (
                                    <div className="p-4 bg-gradient-to-r from-richblack-700 to-richblack-600 rounded-lg border border-richblack-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-richblack-600 rounded-lg flex items-center justify-center">
                                                    <FiVideo className="w-6 h-6 text-yellow-50" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-richblack-5">Current Video</p>
                                                    <p className="text-xs text-richblack-400">Duration: {formatDuration(modaData.duration)}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowVideoUpload(true)}
                                                className="px-4 py-2 text-sm font-medium text-yellow-50 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all duration-200"
                                            >
                                                Change Video
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* File input - shown when adding or when change is clicked */}
                                {(!edit || showVideoUpload || !modaData?.videoUrl || !videoPreview) && !view && !videoPreview && (
                                    <div className="relative">
                                        <div 
                                            className={`flex items-center justify-center w-full transition-all duration-300 ${
                                                isDragging ? 'scale-105' : ''
                                            }`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <label 
                                                htmlFor="videoFile" 
                                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                                                    isDragging 
                                                        ? 'border-yellow-500 bg-yellow-500/10 scale-105' 
                                                        : fileError 
                                                        ? 'border-red-500 bg-red-900/20' 
                                                        : 'border-richblack-600 hover:border-yellow-500 hover:bg-richblack-700/50'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className={`p-3 rounded-full mb-3 transition-all duration-300 ${
                                                        isDragging ? 'bg-yellow-500/20' : 'bg-richblack-700'
                                                    }`}>
                                                        <FiUploadCloud className={`w-8 h-8 transition-colors duration-300 ${
                                                            isDragging ? 'text-yellow-400' : fileError ? 'text-red-400' : 'text-richblack-400'
                                                        }`} />
                                                    </div>
                                                    <p className={`mb-2 text-sm transition-colors duration-300 ${
                                                        isDragging ? 'text-yellow-400' : fileError ? 'text-red-400' : 'text-richblack-400'
                                                    }`}>
                                                        <span className="font-semibold text-yellow-400">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className={`text-xs transition-colors duration-300 ${
                                                        isDragging ? 'text-yellow-400' : fileError ? 'text-red-400' : 'text-richblack-400'
                                                    }`}>
                                                        MP4, AVI, MOV, MKV, or WebM (MAX. 100MB)
                                                    </p>
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    id="videoFile"
                                                    type="file"
                                                    accept="video/*"
                                                    {...register("videoFile", { 
                                                        required: !view && !edit && !videoPreview,
                                                        validate: {
                                                            fileSize: (files) => {
                                                                if (!files || files.length === 0 || !files[0]) return true;
                                                                return files[0].size <= 100 * 1024 * 1024 || 'File size must be less than 100MB';
                                                            },
                                                            fileType: (files) => {
                                                                if (!files || files.length === 0) return true;
                                                                const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/quicktime'];
                                                                return allowedTypes.includes(files[0].type) || 'Please upload a valid video file';
                                                            }
                                                        }
                                                    })}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    disabled={view}
                                                />
                                            </label>
                                        </div>
                                        {fileError && (
                                            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                                <FiAlertCircle className="w-4 h-4" />
                                                {fileError}
                                            </p>
                                        )}
                                        {errors.videoFile && (
                                            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                                <FiAlertCircle className="w-4 h-4" />
                                                {errors.videoFile.message || 'Video file is required'}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-richblack-5">
                                    Title <span className="text-red-400">*</span>
                                    <span className={`text-xs ml-2 ${watchedTitle.length > 90 ? 'text-red-400' : 'text-richblack-400'}`}>
                                        ({watchedTitle.length}/100)
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="title"
                                        type="text"
                                        {...register("title", { 
                                            required: !view && "Title is required",
                                            minLength: {
                                                value: 3,
                                                message: "Title must be at least 3 characters"
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "Title must be less than 100 characters"
                                            }
                                        })}
                                        className={`w-full px-4 py-3 bg-richblack-700 border ${
                                            errors.title ? 'border-red-500' : 'border-richblack-600'
                                        } rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                                            view ? 'cursor-not-allowed opacity-50' : 'hover:border-richblack-500'
                                        }`}
                                        placeholder="Enter lecture title"
                                        disabled={view}
                                    />
                                    {watchedTitle.length > 0 && !errors.title && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <FiCheck className="w-4 h-4 text-green-400" />
                                        </div>
                                    )}
                                </div>
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-richblack-5">
                                    Description <span className="text-red-400">*</span>
                                    <span className={`text-xs ml-2 ${watchedDescription.length > 450 ? 'text-red-400' : 'text-richblack-400'}`}>
                                        ({watchedDescription.length}/500)
                                    </span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        {...register("description", { 
                                            required: !view && "Description is required",
                                            minLength: {
                                                value: 10,
                                                message: "Description must be at least 10 characters"
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: "Description must be less than 500 characters"
                                            }
                                        })}
                                        rows={4}
                                        className={`w-full px-4 py-3 bg-richblack-700 border ${
                                            errors.description ? 'border-red-500' : 'border-richblack-600'
                                        } rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none ${
                                            view ? 'cursor-not-allowed opacity-50' : 'hover:border-richblack-500'
                                        }`}
                                        placeholder="Enter a detailed description of the lecture"
                                        disabled={view}
                                    />
                                    {watchedDescription.length > 0 && !errors.description && (
                                        <div className="absolute right-3 top-3">
                                            <FiCheck className="w-4 h-4 text-green-400" />
                                        </div>
                                    )}
                                </div>
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            {!view && (
                                <div className="flex justify-end gap-4 pt-8">
                                    <button
                                        type="button"
                                        onClick={() => setModalData(null)}
                                        className="px-6 py-3 text-sm font-medium text-richblack-300 bg-richblack-700 border border-richblack-600 rounded-lg hover:bg-richblack-600 hover:text-richblack-100 hover:border-richblack-500 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 text-sm font-medium text-richblack-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[140px] hover:scale-105 active:scale-95"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-richblack-900 border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <>
                                                {edit ? (
                                                    <span className="flex items-center gap-2">
                                                        <FiEdit3 className="w-4 h-4" />
                                                        Update Lecture
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <FiPlus className="w-4 h-4" />
                                                        Create Lecture
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
