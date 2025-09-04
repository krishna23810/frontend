import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BiPlusCircle } from "react-icons/bi";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { useSelector, useDispatch } from 'react-redux';
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import NestedView from "./NestedView"
import { setCourse, setEditCourse, setStep } from '../../../../../slice/courseSlice';
import { addSection, updateSection } from '../../../../../services/operation/CreateCoursesApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CourseBuilder() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [editTitle, seteditTitle] = useState(null);
    const { course } = useSelector((state) => state.course);
    const { fromMyCourse } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    // console.log("we are in CourseBuilder", course);
    console.log("we are in CourseBuilder", course);
    // Load course from localStorage if not in Redux store
    useEffect(() => {
        if (!course) {
            const savedCourse = localStorage.getItem("course");
            if (savedCourse) {
                const parsedCourse = JSON.parse(savedCourse);
                dispatch(setCourse(parsedCourse));
                console.log("Loaded course from localStorage:", parsedCourse);
            }
        }
    }, []);
    
    let result;
    const onSubmit = async (data) => {
        setLoading(true);
        try {


            if (editTitle) {
                result = await updateSection( editTitle, data.title ,course._id ,token);
                console.log("Result of updating section:", result);
            } else {
                console.log("Adding new section");
                result = await addSection({ courseId: course._id, title: data.title }, token);

                console.log("after Adding new section");
                console.log("Result of adding section:", result);
                // dispatch(setCourse(result));
            }
            if (result) {
                dispatch(setCourse(result));
                if (editTitle) {
                    toast.success("Section updated successfully!");
                } else {
                    toast.success("Section added successfully!");
                }
                seteditTitle(null);
                setValue('title', '');
            }
            else {
                if (editTitle) {
                    toast.error("Failed to update section");
                } else {
                    toast.error("Failed to add section");
                }
            }
        } catch (error) {
            console.error("Error adding/updating section:", error);
        }
        setLoading(false);
    }
    const cancelEdit = () => {
        seteditTitle(null);
        setValue('title', '');
    }

    const goBack = () => {

        dispatch(setStep(1));
        dispatch(setEditCourse(true))
    }
    const goNext = () => {
        if (course.sectionCount === 0) {
            toast.error("Please add at least one section before proceeding.");
            return;
        }
        if (course?.sections.some(section => section.subsections.length === 0)) {
            toast.error("Please add at least one lecture in all sections before proceeding.");
            return;
        }
        dispatch(setStep(3));
    }

    const handleChangeEditTitle = (sectionId, title) => {
        if (editTitle === sectionId) {
            cancelEdit();
            return;
        }
        seteditTitle(sectionId);
        setValue('title', title);
    }

    return (
        <div>
            <p>Course Builder</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>

                    <label htmlFor="title">Section name <sup className='text-red-500 text-xl'>*</sup></label>
                    <input
                        id='title'
                        type="text" placeholder="Add Section name"
                        {...register('title', { required: true })}
                        className={`border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                    />
                </div>
                <div className='flex justify-start mt-4 gap-4'>
                    <button type="submit"
                        className='bg-blue-500 text-white rounded-md p-2'
                    >
                        <div className='flex items-center gap-2'>

                            {editTitle ? 'Save Changes ' : (<>Add Section </>)}
                            {editTitle ? <HiOutlineCheckCircle /> : <BiPlusCircle />}
                        </div>
                    </button>
                    <div>

                        {
                            editTitle && (
                                <button type="button" onClick={() => seteditTitle(false) && setValue('title', '')}>
                                    Cancel
                                </button>
                            )
                        }
                    </div>
                </div>
            </form>
            {
                course && course.sectionCount > 0 && (
                    <div className='mt-4'>
                        <h2 className='text-xl font-semibold'>Sections</h2>
                        <NestedView handleChangeEditTitle={handleChangeEditTitle} />
                    </div>
                )
            }
            <div className='flex gap-5'>
                <button
                    className='flex relative py-2 mt-3 px-8 rounded-md bg-gray-400'
                    onClick={goBack}>
                    <IoArrowBack className='absolute left-1 top-1/2 transform -translate-y-1/2' />
                    back
                </button>
                <button
                    className='flex relative py-2 mt-3 px-8 rounded-md bg-yellow-400'
                    onClick={goNext}
                >
                    Next
                    <IoArrowForward className='absolute right-1 top-1/2 transform -translate-y-1/2' />
                </button>
            </div>
        </div>
    )
}