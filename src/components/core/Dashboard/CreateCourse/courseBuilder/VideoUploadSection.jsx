import React, { memo } from 'react';
import { ImCross } from 'react-icons/im';
import { FiUploadCloud, FiVideo, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useVideoUpload } from '../../../../hooks/useVideoUpload';

const VideoUploadSection = memo(({ 
    view = false, 
    modalData = null, 
    register, 
    errors, 
    onFileChange, 
    showChangeButton = false,
    onChangeVideo = null 
}) => {
    const {
        videoPreview,
        videoDuration,
        uploadStatus,
        fileError,
        isDragging,
        setIsDragging,
        fileInputRef,
        handleFileChange,
        removeVideoPreview,
        formatDuration
    } = useVideoUpload();

    const handleFileChangeWrapper = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileChange(file);
            if (onFileChange) onFileChange(file);
        }
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
            handleFileChange(file);
            if (onFileChange) onFileChange(file);
        }
    };

    return (
        <div className="space-y-4">
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
                        <button
                            type="button"
                            onClick={removeVideoPreview}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                        >
                            <ImCross className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-richblack-400">
                        <span>Video Duration: {formatDuration(videoDuration)}</span>
                        <span className="text-green-400">✓ Ready to upload</span>
                    </div>
                </div>
            )}

            {/* Show current video when viewing */}
            {view && modalData?.videoUrl && (
                <div className="relative">
                    <div className="relative overflow-hidden rounded-lg border border-richblack-600">
                        <video controls className="w-full">
                            <source src={modalData.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="mt-2 text-sm text-richblack-400">
                        Video Duration: {formatDuration(modalData.duration)}
                    </div>
                </div>
            )}

            {/* Show current video info when editing with change button */}
            {showChangeButton && modalData?.videoUrl && !videoPreview && (
                <div className="p-4 bg-gradient-to-r from-richblack-700 to-richblack-600 rounded-lg border border-richblack-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-richblack-600 rounded-lg flex items-center justify-center">
                                <FiVideo className="w-6 h-6 text-yellow-50" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-richblack-5">Current Video</p>
                                <p className="text-xs text-richblack-400">Duration: {formatDuration(modalData.duration)}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onChangeVideo}
                            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                        >
                            Change Video
                        </button>
                    </div>
                </div>
            )}

            {/* File input - shown when adding or when change is clicked */}
            {(!showChangeButton || !modalData?.videoUrl || !videoPreview) && !view && (
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
                                        isDragging ? 'text-yellow-400' : 'text-richblack-400'
                                    }`} />
                                </div>
                                <p className={`mb-2 text-sm transition-colors duration-300 ${
                                    isDragging ? 'text-yellow-400' : 'text-richblack-400'
                                }`}>
                                    <span className="font-semibold text-yellow-400">Click to upload</span> or drag and drop
                                </p>
                                <p className={`text-xs transition-colors duration-300 ${
                                    isDragging ? 'text-yellow-400' : 'text-richblack-400'
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
                                    required: !view && !modalData?.videoUrl && !videoPreview,
                                    validate: {
                                        fileSize: (files) => {
                                            if (!files || files.length === 0) return true;
                                            return files[0].size <= 100 * 1024 * 1024 || 'File size must be less than 100MB';
                                        },
                                        fileType: (files) => {
                                            if (!files || files.length === 0) return true;
                                            const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/quicktime'];
                                            return allowedTypes.includes(files[0].type) || 'Please upload a valid video file';
                                        }
                                    }
                                })}
                                onChange={handleFileChangeWrapper}
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
    );
});

export default VideoUploadSection;
