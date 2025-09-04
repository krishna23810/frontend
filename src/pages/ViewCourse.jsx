import React, { useEffect, useState } from "react";
import VideoSideBar from "../components/core/ViewCourse/VideoSideBar";
import { Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { getCourseById } from "../services/operation/CreateCoursesApi";
import {getViewCourse} from "../services/operation/ViewCourseApi"
import { setCompletedLectures, setCourseSectionData, setFullCourseData ,setTotalNoOfLectures} from "../slice/viewCourseSlice";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false);
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const {CourseSectionData, FullCourseData, CompletedLectures, TotalNoOfLectures} = useSelector((state) => state.viewCourse);
    const dispatch= useDispatch();
    // const [reviewModal, setReviewModal] = useState(false);

    useEffect(() => {
        const SetCourseAllData = async () => {
            const CourseData = await getViewCourse(courseId, token);
            console.log("CourseData", CourseData);
            dispatch(setCompletedLectures(CourseData?.progress?.completedvideo || []));
            dispatch(setFullCourseData(CourseData));
            dispatch(setCourseSectionData(CourseData?.course?.sections));
            let lecture = 0;
            CourseData?.course?.sections?.forEach((section) => {
                lecture += section?.subsections?.length || 0;
            })
            dispatch(setTotalNoOfLectures(lecture));
        }
        SetCourseAllData();
    }, [courseId, token]);

    console.log("CompletedLectures", CompletedLectures);
    return (
        <div className="relative flex min-h-[cal(100vh-3rem)]">
            <VideoSideBar setReviewModal={setReviewModal} />
            <div className=" flex-1 h-[cal(100vh-3rem)] overflow-auto">
                <div className="mx-auto w-11/12 max-x-[1000px] py-10">
                    <Outlet />
                </div>
            </div>
            {
                reviewModal && (
                    <CourseReviewModal setReviewModal ={setReviewModal} />
                )
            }
        </div>
    );
}
export default ViewCourse;