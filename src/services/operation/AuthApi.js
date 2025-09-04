import { setToken, setLoading, } from '../../slice/authSlice';
import { apiConnector } from '../apiconnector';
import { endpoints } from '../apis';
import { toast } from 'react-hot-toast';
import { setUser } from '../../slice/profileSlice';
import { useNavigate } from 'react-router-dom';


const {
    SEND_OTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESET_PASSWORD_TOKEN_API,
    RESET_PASSWORD_API,
   CHANGE_PASSWORD_API
} = endpoints



    
    export function sendOtpApi(email) {
    
    return async (dispatch) => {
        const toastId = toast.loading("Sending OTP...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SEND_OTP_API, {
                email: email
            })
            console.log('OTP sent successfully:', response);
            console.log(response.data.success);

            if (!response.data.success) {
                toast.error("Something went wrong")
                throw new Error("unable to send OTP")
            }
            toast.success("OTP sent successfully!")
            // navigate('/verify-email');
        } catch (error) {
            toast.error("Error sending OTP")
            console.error('Error sending OTP:', error)
        }

        finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function signup(
    accountType,
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    otp,
    gender,
    contactNum,
    navigate) 
    
    {
    return async (dispatch) => {
        const toastId = toast.loading("Signing up...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstname,
                lastname,
                email,
                password,
                confirmPassword,
                otp,
                gender,
                contactNum
            })
            console.log('Signup response:', response);
            if (!response.data.success) {
                throw new Error("Signup failed.", response.data.message);
            }
            toast.success("Signup successful!")
            navigate('/login');
        } catch (error) {
            toast.error("Error signing up")
            console.error('Error signing up:', error)
            // navigate('/signup');
        } finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Logging in...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password
            })
            console.log('Login response:', response);
            if (!response.data.success) {
                throw new Error("Login failed.", response.data.message);
            }
            toast.success("Login successful!")
            dispatch(setToken(response.data.token))
            const userImage = response.data.user.profilePicture ? response.data.user.profilePicture :
                `https://api.dicebear.com/initials/svg?seed=${response.data.user.firstname} ${response.data.user.lastname}`;
            dispatch(setUser({
                ...response.data.user,
                profilePicture: userImage
            }));
            localStorage.setItem('token', JSON.stringify(response.data.token));
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard/my-profile');
        } catch (error) {
            toast.error("Error logging in")
            console.error('Error logging in:', error)
            navigate('/login');
        } finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}
export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        // dispatch((null));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success("Logout successful!")
        navigate('/');

    }
}


export function resetPasswordToken(email, setEmailSent) {
    return async (dispatch) => {
        const toastId = toast.loading("Sending reset password link...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", RESET_PASSWORD_TOKEN_API, {
                email
            })
            console.log('Reset password link sent:', response);
            if (!response.data.success) {
                throw new Error("Failed to send reset password link.");
            }
            toast.success("Reset password link sent successfully!");
            setEmailSent(true);
        } catch (error) {
            toast.error("Error sending reset password link")
            console.log('Error sending reset password link:', error)
        } finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function resetPassword(token, newPassword, conNewPassword, navigate, setPasswordUpdate) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating password...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", RESET_PASSWORD_API, {
                token,
                newPassword,
                conNewPassword
            })
            console.log('Update password response:', response);
            if (!response.data.success) {
                throw new Error("Failed to update password.");
            }
            toast.success("Password updated successfully!");
            // after 5 second
            setPasswordUpdate(true);
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } catch (error) {
            toast.error("Error updating password")
            console.log('Error updating password:', error)
        } finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function changePassword(oldPassword, newPassword, confirmNewPassword, reset) {
    return async (dispatch) => {
        const toastId = toast.loading("Changing password...");
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", CHANGE_PASSWORD_API, {
                oldPassword,
                newPassword,
                confirmNewPassword
            },
            {withCredentials: true}
        )
        reset();
            console.log('Change password response:', response);
            if (!response.data.success) {
                throw new Error("Failed to change password.");
            }
            toast.success("Password changed successfully!");
            // navigate('/login');
        } catch (error) {
            toast.error("Error changing password")
            console.log('Error changing password:', error)
        } finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}
