import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/quicktime'];

export const useVideoUpload = () => {
    const [videoPreview, setVideoPreview] = useState(null);
    const [videoDuration, setVideoDuration] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [fileError, setFileError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = useCallback((file) => {
        if (!file) return { valid: true, error: null };

        if (file.size > MAX_FILE_SIZE) {
            return { valid: false, error: 'File size must be less than 100MB' };
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return { valid: false, error: 'Please upload a valid video file (MP4, AVI, MOV, MKV, or WebM)' };
        }

        return { valid: true, error: null };
    }, []);

    const handleFileChange = useCallback((file) => {
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.valid) {
            setFileError(validation.error);
            toast.error(validation.error);
            return;
        }

        setUploadStatus('uploading');
        setFileError(null);

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
    }, [validateFile]);

    const removeVideoPreview = useCallback(() => {
        setVideoPreview(null);
        setVideoDuration(null);
        setUploadStatus('idle');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const formatDuration = useCallback((seconds) => {
        if (!seconds) return '';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }, []);

    return {
        videoPreview,
        videoDuration,
        uploadStatus,
        fileError,
        isDragging,
        setIsDragging,
        fileInputRef,
        handleFileChange,
        removeVideoPreview,
        formatDuration,
        setVideoPreview,
        setVideoDuration,
        setUploadStatus
    };
};
