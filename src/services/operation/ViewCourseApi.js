import toast from 'react-hot-toast';
import { ViewCourseApi } from '../apis'
import { apiConnector } from '../apiconnector';

const { GET_COURSE_DETAILS_API, CREATE_RATING_API ,LECTURE_COMPLETE_API} = ViewCourseApi;


export async function getViewCourse(courseId, token) {
    const toastId = toast.loading('Loading course details...');

    try {
        const response = await apiConnector("GET",GET_COURSE_DETAILS_API(courseId), {
            Authorization: `Bearer ${token}`
        });

        if (response) {
            toast.success('Course details loaded successfully');
            // console.log('View Course Details:', response);
            return response?.data;
        }
    } catch (error) {
        toast.error('Failed to load course details');
        console.error('Error fetching view course details:', error);
    } finally {
        toast.dismiss(toastId);
    }
}

export async function submitCourseRating(ratingData, token) {
    const toastId = toast.loading('Submitting your review...');

    try {
        const response = await apiConnector("POST", CREATE_RATING_API, ratingData, 
            {
            Authorization: `Bearer ${token}`
            }
        );

        if (response) {
            toast.success('Review submitted successfully');
            return response?.data;
        }
    } catch (error) {
        toast.error('Failed to submit review');
        console.error('Error submitting course rating:', error);
    } finally {
        toast.dismiss(toastId);
    }
}

export async function markLectureAsComplete(data, token) {
    const toastId = toast.loading('Marking lecture as complete...');
    let result = null;

    try {
        const response = await apiConnector("POST", LECTURE_COMPLETE_API, data, {
            Authorization: `Bearer ${token}`
        });
        console.log("Lecture complete response", response);

        if (!response.data.message) {
            throw new Error('Failed to mark lecture as complete');
        }
        toast.success('Lecture marked as complete');
        result = true;
    } catch (error) {
        toast.error('Failed to mark lecture as complete');
        toast.error(error.message);
        result = false;

    } finally {
        toast.dismiss(toastId);
        return result;
    }
}
