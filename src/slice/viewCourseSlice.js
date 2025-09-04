import {createSlice} from '@reduxjs/toolkit';

const initialState = {
        CourseSectionData: [],
        FullCourseData: [],
        CompletedLectures: [],
        TotalNoOfLectures: 0,

};
const viewCourseSlice = createSlice({
    name: 'viewCourse',
    initialState,
    reducers: {
        setCourseSectionData: (state, action) => {
            state.CourseSectionData = action.payload;
        },
        setFullCourseData: (state, action) => {
            state.FullCourseData = action.payload;
        },
        setCompletedLectures: (state, action) => {
            state.CompletedLectures = action.payload;
        },
        setTotalNoOfLectures: (state, action) => {
            state.TotalNoOfLectures = action.payload;
        },
        updateCompletedLectures: (state, action) => {
            state.CompletedLectures = [...state.CompletedLectures, action.payload];
        }
    }
});
export const { setCourseSectionData, setFullCourseData, setCompletedLectures, setTotalNoOfLectures, updateCompletedLectures } = viewCourseSlice.actions;
export default viewCourseSlice.reducer;