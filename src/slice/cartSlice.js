import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
    cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
    total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0,
    fromCart: false
};
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        addToCart: (state, action) => {
            console.log("Adding to cart:", action.payload);
            const course = action.payload;
            const index = state.cart.findIndex(item => item._id === course._id);

            if (index >= 0) {
                toast.error("Course already in cart");
                return;
            }
            state.cart.push(course);
            state.totalItems += 1;

            state.total += course.price;

            //upadating to local storage
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
            localStorage.setItem("total", JSON.stringify(state.total));

            toast.success("Course added to cart");

        },
        removeFromCart :( state , action) => {
            const courseId =action.payload
            const index = state.cart.findIndex(item => item._id === courseId);

            if(index >=0){
                // if found remove it
                state.totalItems -= 1;
                state.total -= state.cart[index].price;
                state.cart.splice(index, 1);

                // upadting to local storage
                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
                localStorage.setItem("total", JSON.stringify(state.total));
            }
        },
        setTotalItems: (state, action) => {
            state.totalItems = action.payload;
        },
        resetCart: (state) => {
            state.cart = [];
            state.totalItems = 0;
            state.total = 0;

            // clearing local storage
            localStorage.removeItem("cart");
            localStorage.removeItem("totalItems");
            localStorage.removeItem("total");
        },
        setFromCart: (state, action) => {
            state.fromCart = action.payload;
        }
    }
});
export const { setTotalItems, addToCart ,removeFromCart ,resetCart, setFromCart } = cartSlice.actions;
export default cartSlice.reducer;