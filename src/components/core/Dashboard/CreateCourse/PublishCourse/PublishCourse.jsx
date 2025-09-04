
// import { Watch } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {resetCourseState, setStep} from '../../../../../slice/courseSlice';
import {COURSE_STATUS} from '../../../../../data/contants'
import { useNavigate } from 'react-router-dom';
import { updateCourse } from '../../../../../services/operation/CreateCoursesApi';


export default function PublishCourse() {
    const { register, handleSubmit, watch, setValue,getValues, formState: { errors } } = useForm();
    const { course } = useSelector(state => state.course);
    const { token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

useEffect(() => {
    if(course?.status === COURSE_STATUS.PUBLISHED) {
        setValue("public",true);
    }
}, []);

const goToCourses = ()=>{
    dispatch(resetCourseState());
    navigate('/dashboard/my-courses');
}

const handleCoursePublish = async ()=>{
    if(course.status === COURSE_STATUS.PUBLISHED && getValues("public") === true || 
    course.status === COURSE_STATUS.DRAFT && getValues("public") === false){
        //means no updation simply go to my course 
        goToCourses();
        return;
    }
    //have some updates to make
    console.log("Updates are needed");

    const status = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    
    const courseData = {
                categoryID: "",
                courseDuration: "",
                courseLevel: "",
                courseName: "",
                courseType: "",
                description: "",
                learnInCourse: "",
                price: "",
                tags: [],
                image: null,
                token,
                dispatch,
                setLoading,
                status : status,
            };

    const respond = await updateCourse(
                        courseData.categoryID,
                        courseData.courseDuration,
                        courseData.courseLevel,
                        courseData.courseName,
                        courseData.courseType,
                        courseData.description,
                        courseData.learnInCourse,
                        courseData.price,
                        courseData.tags,
                        courseData.image,
                        courseData.token,
                        courseData.dispatch,
                        courseData.setLoading,
                        course._id,
                        courseData.status
                    );

    if(respond){
        goToCourses();
    }
    setLoading(false);
}

    const onSubmit = async (data) => {
        handleCoursePublish();
    };

    const goBack = () => {
        dispatch(setStep(2));
    };

    return (
        <div className='rounded-lg shadow-lg p-6 bg-gray-400 border-[1px] border-gray-600 dark:bg-slate-800'>
            <h2 className='text-xl font-semibold mb-4'>Publish Your Course</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='public'>
                        <input id="public" type="checkbox"
                            className='ml-2'
                            {...register("public")} />
                        <span>
                            Make this course public
                        </span>
                    </label>
                </div>
                <div className='mt-4 flex justify-between'>
                    <button
                        disabled={loading}
                        type="button"
                        onClick={goBack}
                        className='mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50'
                    >
                        Back
                    </button>
                    <button
                        disabled={loading}
                        type="submit"
                        className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
                    >
                        {watch("public") ? (
                            <>
                                {loading ? (<p>Publishing...</p>) : (<p>Publish Course</p>)}
                            </>
                        ) : (<p>Save as Draft</p>)}
                    </button>
                </div>
            </form>
        </div>
    )
}