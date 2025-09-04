import { useSelector } from "react-redux";
import ReactStars from 'react-rating-star-with-type'
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeFromCart, setFromCart } from "../../../../slice/cartSlice";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { buyCourse } from "../../../../services/operation/BuyCourse";

export default function Cart() {
    const { total, cart, totalItems, fromCart } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log("Cart items:", cart);
    console.log("Total items in cart:", totalItems);
    console.log("Total price:", Math.abs(total));


    const handleCheckout = () => {
        console.log("Checkout clicked");
        const allCourses = cart.map(item => item._id);
        
        // Handle the buy now action
        if(token && user) {
            dispatch(setFromCart(true));
            buyCourse(allCourses, token, user, navigate, dispatch, fromCart);
        }
    };

    const removeCart = (courseId) => {
        dispatch(removeFromCart(courseId));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
                    <p className="text-gray-600">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {Math.abs(total) > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">Course Details</h2>
                                </div>
                                
                                <div className="divide-y divide-gray-200">
                                    {cart.map((course, index) => (
                                        <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                {/* Course Image */}
                                                <div className="flex-shrink-0">
                                                    <img 
                                                        src={course.image} 
                                                        alt={course.title}
                                                        className="w-full sm:w-32 h-24 object-cover rounded-lg shadow-sm"
                                                    />
                                                </div>
                                                
                                                {/* Course Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        By {course?.instructorId?.firstName} {course?.instructorId?.lastName}
                                                    </p>
                                                    
                                                    {/* Rating */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {course?.averageRating ? course?.averageRating.toFixed(1) : 0}
                                                        </span>
                                                        <ReactStars
                                                            value={course?.averageRating ? course?.averageRating : 0}
                                                            isEdit={false}
                                                            activeColors={["red", "orange", "#FFCE00", "#9177FF", "#8568FC"]}
                                                            size={16}
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            ({course?.totalRatings ? course?.totalRatings : 0} reviews)
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Course Info */}
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center">
                                                            <span className="font-medium">Level:</span> {course?.courseLevel}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <span className="font-medium">Sections:</span> {course?.sectionCount ? course?.sectionCount : 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Price and Actions */}
                                                <div className="flex flex-col items-end gap-4">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            ₹{course?.price}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeCart(course._id)}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                                                    >
                                                        <RiDeleteBin6Fill className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                                        <span className="font-medium text-gray-900">₹{total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium text-gray-900">₹0</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-gray-900">₹{total}</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    Secure checkout powered by our payment partners
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-600 mb-6">
                                Looks like you haven't added any courses to your cart yet.
                            </p>
                            <button 
                                onClick={() => window.location.href = '/catalog'}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Browse Courses
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
