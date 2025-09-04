import {createSlice} from '@reduxjs/toolkit';
// import category from '../../server/models/category';

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    category : localStorage.getItem("category") ? JSON.parse(localStorage.getItem("category")) : [],
    loading: false,
};
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        }
    }
});
export const { setUser ,setLoading, setCategory} = profileSlice.actions;
export default profileSlice.reducer;