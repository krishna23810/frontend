import { setLoading, setToken, } from '../../slice/authSlice';
import { apiConnector } from '../apiconnector';
import { profileApi } from '../apis';
import { toast } from 'react-hot-toast';
import { setUser } from '../../slice/profileSlice';
// import { setToken } from '../../slice/authSlice';

const {
    UPDATE_PROFILE_API,
    DELETE_ACCOUNT_API,
    GET_USER_DETAILS_API,
    UPDATE_DISPLAY_PICTURE_API,
    INSTRUCTOR_DASHBOARD_API,
    RESET_PASSWORD_API
} = profileApi;

const token = localStorage.getItem('token');

export function updateProfilePicture(file) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await apiConnector(
                "PUT", 
                UPDATE_DISPLAY_PICTURE_API, 
                formData,
                { withCredentials: true } // This ensures cookies are sent
            );
            
            console.log("Profile picture update response:", response.data.success);
            
            if (response.data.success) {    
                console.log("Profile picture updated successfully:", response.data);
                console.log("going to fetch updated profile details");
                dispatch(getProfileDetails());
                console.log("after ");
                toast.success("Profile picture updated successfully!");
            } else {
                toast.error(response.data.message || "Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Profile picture update error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile picture.");
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function updateProfileDetails(data) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_PROFILE_API,
                data,
                { withCredentials: true }
            );

            console.log("Profile details update response:", response);

            if (response.data.success) {

                dispatch(setUser(response.data));
                console.log("Updated user:", response.data);
                console.log("going to fetch updated profile details");
                dispatch(getProfileDetails());
                toast.success("Profile details updated successfully!");
            } else {
                toast.error(response.data.message || "Failed to update profile details.");
            }
        } catch (error) {
            console.error("Profile details update error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile details.");
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function getProfileDetails() {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                "GET",
                GET_USER_DETAILS_API,
                null,
                { withCredentials: true }
            );

            console.log("Profile details fetch response:", response);

            if (response.data.success) {
                dispatch(setUser(response.data.userData));
                console.log("now we are seting the respond to the user slice", response.data.userData);
                localStorage.setItem('user', JSON.stringify(response.data.userData));
                toast.success("Profile details fetched successfully!");
            } else {
                toast.error(response.data.message || "Failed to fetch profile details.");
            }
        } catch (error) {
            console.error("Profile details fetch error:", error);
            toast.error(error.response?.data?.message || "Failed to fetch profile details.");
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export function deleteUserAccount(navigate ) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                "DELETE",
                DELETE_ACCOUNT_API,
                null,
                { withCredentials: true }
            );

            console.log("Delete account response:", response);

            if (response.data.success) {
                console.log("Account deleted successfully:", response.data);
                dispatch(setUser(null)); // Clear user data from Redux store
                dispatch(setToken(null)); // Clear token from Redux store

                localStorage.removeItem('user');
                localStorage.removeItem('token');
                console.log("going to navigate to signup page");
                navigate('/signup');    
                toast.success("Account deleted successfully!");
                console.log("going to navigate to signup page");
                console.log("delete respond" , response.data);
            } else {
                toast.error(response.data.message || "Failed to delete account.");
            }

        } catch (error) {
            console.error("Delete account error:", error);
            toast.error(error.response?.data?.message || "Failed to delete account.");
        } finally {
            dispatch(setLoading(false));
        }
    };
}