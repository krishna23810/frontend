import { useCallback } from 'react';

export const useFormValidation = () => {
    const validateTitle = useCallback((value) => {
        if (!value || value.trim().length === 0) {
            return 'Title is required';
        }
        if (value.length < 3) {
            return 'Title must be at least 3 characters';
        }
        if (value.length > 100) {
            return 'Title must be less than 100 characters';
        }
        return null;
    }, []);

    const validateDescription = useCallback((value) => {
        if (!value || value.trim().length === 0) {
            return 'Description is required';
        }
        if (value.length < 10) {
            return 'Description must be at least 10 characters';
        }
        if (value.length > 500) {
            return 'Description must be less than 500 characters';
        }
        return null;
    }, []);

    const validateVideoFile = useCallback((files, isRequired = true) => {
        if (!files || files.length === 0) {
            return isRequired ? 'Video file is required' : null;
        }

        const file = files[0];
        const maxSize = 100 * 1024 * 1024; // 100MB
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/quicktime'];

        if (file.size > maxSize) {
            return 'File size must be less than 100MB';
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Please upload a valid video file (MP4, AVI, MOV, MKV, or WebM)';
        }

        return null;
    }, []);

    return {
        validateTitle,
        validateDescription,
        validateVideoFile
    };
};
