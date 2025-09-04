import React, { useEffect, useState } from "react";
import CatalogPageApi from "../../services/operation/CatlogPageApi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaStar, FaUsers, FaClock, FaGraduationCap, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import futter from "../../components/comman/futter"
import CourseCard from "../../components/comman/catalog/Course_Card";
import CatalogSlider from "../../components/comman/catalog/Slider";

const CartPage = () => {
    const { category } = useSelector((state) => state.profile);
    let { catalogName } = useParams();
    catalogName = catalogName.split("-").join(" ");

    const [catalogData, setCatalogData] = useState(null);
    const [loading, setLoading] = useState(true);

    const catalogId = category.find(cat => cat.name.toLowerCase() === catalogName?.toLowerCase());

    const PageData = async () => {
        if (catalogId) {
            try {
                const response = await CatalogPageApi(catalogId._id);
                setCatalogData(response);
                console.log("Catalog data:", response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching catalog data:", error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        PageData();
    }, [catalogId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!catalogId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
                    <p className="text-gray-600">The category you're looking for doesn't exist.</p>
                    <Link
                        to="/"
                        className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-4">{catalogData?.categoryDetail?.name || catalogId.name}</h1>
                    <p className="text-xl opacity-90 max-w-2xl">
                        {catalogData?.categoryDetail?.description || catalogId.description}
                    </p>
                </div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Courses */}
                {catalogData?.categoryDetail?.courseId?.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">
                            {catalogData.categoryDetail.name} Courses
                        </h2>
                        <div>

                            <CatalogSlider course={catalogData?.categoryDetail?.courseId} />

                        </div>
                    </section>
                )}



                {/* Top Selling Courses */}
                {catalogData?.topSelling?.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Top Selling Courses</h2>
                        <div >
                            <CatalogSlider course={catalogData?.topSelling} />
                        </div>
                    </section>
                )}

                {/* Different Category Courses */}
                {catalogData?.differentCategoryCourses?.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Explore Other Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {catalogData.differentCategoryCourses.map((category, index) => (
                                category.courseId?.map((course) => (
                                    // <CourseCard key={`${course._id || course.id}-${index}`} course={course} />
                                    <CourseCard key={course._id || course.id} course={course} Height={"h-[400px]"} />
                                ))
                            ))}
                        </div>
                    </section>
                )}


                {/* Empty State */}
                {!catalogData?.topSelling?.length &&
                    !catalogData?.differentCategoryCourses?.length &&
                    !catalogData?.categoryDetail?.courseId?.length && (
                        <div className="text-center py-16">
                            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Courses Available</h3>
                                <p className="text-gray-600 mb-6">
                                    There are no courses available in this category yet. Check back later!
                                </p>
                                <Link
                                    to="/"
                                    className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                                >
                                    Browse All Categories
                                </Link>
                            </div>
                        </div>
                    )}
            </div>
            <futter />
        </div>
    );
};

export default CartPage;
