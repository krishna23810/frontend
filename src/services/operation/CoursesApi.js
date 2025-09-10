import { setToken, setLoading, } from '../../slice/authSlice';
import { apiConnector } from '../apiconnector';
import { coursesEndpoints } from '../apis';
import { toast } from 'react-hot-toast';
import { setCourse, setMyCourse} from '../../slice/courseSlice';
import { useNavigate } from 'react-router-dom';



const { GET_USER_ENROLLED_COURSES_API , GET_ALL_INSTRUCTOR_COURSES_API} = coursesEndpoints

export async function getUserEnrolledCourses(token, setEnrolledCourses) {

    const toastId = toast.loading("loading up...");
    setLoading(true);
    console.log("before Fetching enrolled courses ");

    try {
        const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`
            }
        );
        console.log("after Fetching enrolled courses ");

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        setEnrolledCourses(response.data);
        toast.success("Enrolled courses fetched successfully");
        console.log("Enrolled courses fetched successfully", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Failed to fetch enrolled courses');
    } finally {
        toast.dismiss(toastId);
        setLoading(false);
    }

} 


export async function getAllInstructorCourses(token, dispatch) {
const toastId = toast.loading("loading up...");
    setLoading(true);
    console.log("before Fetching enrolled courses ");

    try {
        const response = await apiConnector("GET", GET_ALL_INSTRUCTOR_COURSES_API,
            null,
            { Authorization: `Bearer ${token}` }
        );
        console.log("after Fetching enrolled courses ");

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        dispatch(setMyCourse(response.data));
        localStorage.setItem("myCourses", JSON.stringify(response.data));
        toast.success("Instructor courses fetched successfully");
        console.log("Instructor courses fetched successfully", response.data);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching instructor courses:', error);
        toast.error('Failed to fetch instructor courses');
    } finally {
        toast.dismiss(toastId);
        setLoading(false);
    }

}
