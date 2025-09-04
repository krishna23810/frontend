import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import { RatingsApi } from '../../services/apis';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewSlider = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(RatingsApi.GET_ALL_RATINGS_API);
                const data = await response.json();
                setReviews(data?.ratings || []);
                console.log("Fetched Reviews Data:", data?.ratings );
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Function to render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="py-16 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Student Reviews</h2>
                        <p className="text-slate-400 text-lg">Loading reviews...</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 animate-pulse">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                                    <div className="ml-4">
                                        <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
                                        <div className="h-3 bg-slate-700 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                                <div className="h-4 bg-slate-700 rounded w-4/5"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">What Our Students Say</h2>
                    <p className="text-slate-400 text-lg">Hear from students who have transformed their careers with our courses</p>
                </div>

                {reviews.length > 0 ? (
                    <Swiper
                        modules={[FreeMode, Pagination]}
                        freeMode={true}
                        pagination={{
                            clickable: true,
                            el: '.review-pagination',
                            bulletClass: 'swiper-pagination-bullet bg-slate-600 opacity-50',
                            bulletActiveClass: 'swiper-pagination-bullet-active bg-yellow-500 opacity-100'
                        }}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 30
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 40
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 30
                            }
                        }}
                        className="pb-12"
                    >
                        {reviews.map((reviewItem, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 h-full">
                                    {/* User Info */}
                                    <div className="flex items-center mb-4">
                                        {reviewItem.userId.additionalInfo?.profilePicture ? (
                                            <img
                                                src={reviewItem.userId.additionalInfo.profilePicture}
                                                alt={`${reviewItem.userId.firstName} ${reviewItem.userId.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600">
                                                <span className="text-white font-semibold text-sm">
                                                    {reviewItem.userId.firstName?.[0]}{reviewItem.userId.lastName?.[0]}
                                                </span>
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <h3 className="text-white font-semibold text-lg">
                                                {reviewItem.userId.firstName} {reviewItem.userId.lastName}
                                            </h3>
                                            <div className="flex items-center mt-1">
                                                {renderStars(reviewItem.rating)}
                                                <span className="text-slate-400 text-sm ml-2">
                                                    ({reviewItem.rating}/5)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* course name */}
                                    <div className="mb-3">
                                        <h4 className="text-slate-400 font-medium line-clamp-4" >
                                            Course: {reviewItem.course.courseName}
                                        </h4>
                                    </div>

                                    {/* Review Content */}
                                    <div className="mb-4">
                                        <p className="text-slate-300 leading-relaxed line-clamp-4">
                                            {reviewItem.review}
                                        </p>
                                    </div>

                                    {/* Rating Badge */}
                                    <div className="flex justify-between items-center">
                                        <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                                            {reviewItem.rating} Star Rating
                                        </div>
                                        <div className="text-slate-500 text-sm">
                                            {new Date(reviewItem.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaRegStar className="text-yellow-400 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
                            <p className="text-slate-400">Be the first to share your experience!</p>
                        </div>
                    </div>
                )}

                {/* Custom Pagination */}
                {reviews.length > 0 && (
                    <div className="review-pagination swiper-pagination !relative !mt-8"></div>
                )}
            </div>
        </div>
    );
};

export default ReviewSlider;
