import { createSlice } from "@reduxjs/toolkit";
import { setCourses } from "./profileSlice";
import MyCourses from "../components/core/Dashboard/MyCourses";

const initialState = {
    step: 1,
    course: null,
    fromMyCourse: false,
    myCourse: localStorage.getItem("myCourse") ? JSON.parse(localStorage.getItem("myCourse")) : null,
    editCourse: false,
    paymentLoading: false
}

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setStep: (state, action) => {
            state.step = action.payload;
        },
        setCourse: (state, action) => {
            state.course = action.payload;
        },
        setEditCourse: (state, action) => {
            state.editCourse = action.payload;
        },
        setPaymentLoading: (state, action) => {
            state.paymentLoading = action.payload;
        },
        setMyCourse: (state, action) => {
            state.myCourses = action.payload;
        },
        setFromMyCourse: (state, action) => {
            state.fromMyCourse = action.payload;
        },
        resetCourseState: (state) => {
            state.step = 1;
            state.course = null;
            state.editCourse = false;
            state.paymentLoading = false;
        }
    }
})

export const { setStep, setCourse, setEditCourse, setPaymentLoading, setFromMyCourse, resetCourseState ,setMyCourse } = courseSlice.actions;

export default courseSlice.reducer;