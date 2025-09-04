import {combineReducers} from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import profileReducer from '../slice/profileSlice';
import cartReducer from '../slice/cartSlice';
import coursesReducer from "../slice/courseSlice" 
import viewCourseSlice from "../slice/viewCourseSlice";

const rootReducer = combineReducers({
    // Add your reducers here
    auth : authReducer,
    profile : profileReducer,
    cart : cartReducer,
    course : coursesReducer,
    viewCourse: viewCourseSlice

});

export default rootReducer;