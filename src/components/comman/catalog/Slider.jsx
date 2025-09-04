import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import Course_Card from './Course_Card';

const CatalogSlider = ({ course }) => {
    console.log("course slider", course);

    return (
        <>
            {course.length ? (
                <Swiper
                    modules={[FreeMode, Pagination]}
                    freeMode={true}
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                >
                    {course.map((courseItem, index) => (
                        <SwiperSlide key={index}>
                            <Course_Card course={courseItem} Height={"h-[250px]"} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p>No courses found</p>
            )}
        </>
    );
};

export default CatalogSlider;
