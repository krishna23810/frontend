import { ImCancelCircle } from "react-icons/im";
import Avatar from '@mui/material/Avatar';
import { useSelector } from "react-redux";
import Rating from '@mui/material/Rating';
import { useState } from "react";
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { useForm } from "react-hook-form";
import {submitCourseRating} from "../../../services/operation/ViewCourseApi"
import { useParams } from "react-router-dom";

const CourseReviewModal = ({ setReviewModal }) => {
    const { user } = useSelector(state => state.profile);
    const {token} = useSelector(state => state.auth);
    const {courseId} = useParams();
    console.log("courseId",courseId);

    const [value, setValue] = useState(1);
  const [hover, setHover] = useState(-1);

  const { register, handleSubmit,err} = useForm();

  const onSubmit = async(data) => {
    console.log("Review Data", data);

    const ratingData = {
        rating: value,
        review: data.review,
        courseId: courseId
    }
    console.log("Rating Data", ratingData);
    await submitCourseRating(ratingData, token);
    setReviewModal(false);
  };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-2xl font-bold text-gray-800">Course Review</h2>
                    <button 
                        onClick={() => setReviewModal(false)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        <ImCancelCircle className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Welcome Message */}
                    <div className="text-center">
                        <p className="text-gray-600 text-lg font-medium">Your feedback is valuable to us!</p>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Avatar 
                            alt={user?.firstName || "User"} 
                            src={user?.additionalInfo?.profilePicture} 
                            className="w-12 h-12 border-2 border-white shadow-sm"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-500">Posting publicly</p>
                        </div>
                    </div>
                    
                    {/* Rating Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Rating Section */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Rate this course</label>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Rating
                                    name="hover-feedback"
                                    value={value}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        setHover(newHover);
                                    }}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    size="large"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: '#3B82F6',
                                        },
                                        '& .MuiRating-iconHover': {
                                            color: '#2563EB',
                                        },
                                    }}
                                />
                            </Box>
                            {value !== null && (
                                <p className="text-center text-sm text-gray-600">
                                    {hover !== -1 ? hover : value} star{hover !== -1 && hover !== 1 ? 's' : value !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                        
                        {/* Review Textarea */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Your Review</label>
                            <textarea 
                                {...register("review")} 
                                placeholder="Share your experience with this course..."
                                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                rows="4"
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={() => setReviewModal(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={value === 0}
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseReviewModal;
