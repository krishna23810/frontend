import React, { useState } from 'react';
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { MdModeEdit, MdOutlineDeleteOutline } from "react-icons/md";
import { deleteSection, deleteSubsection } from '../../../../../services/operation/CreateCoursesApi';
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { BiVideoPlus } from "react-icons/bi";
import SubSectionModal from './SubSectionModal';
// import SubSectionModalEnhanced from './SubSectionModal-enhanced';

import ConfirmationModal from "../../../../comman/ConfirmationModal"
import { setCourse } from '../../../../../slice/courseSlice';


export default function NestedView({ handleChangeEditTitle }) {
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);

    const [confirmationModal, setConfirmationModal] = useState(false);

    const handleDeleteSection = async (sectionId) => {
        console.log("token:", token);
        // Dispatch delete section action
        console.log("Deleting section with ID:", sectionId);
        const result = await deleteSection(sectionId, course._id, token);
        if (result) {
            console.log("Section deleted successfully:", result);
            dispatch(setCourse(result));
            // Handle successful deletion (e.g., show a success message)
        } else {
            console.error("Failed to delete section");
            // Handle deletion failure (e.g., show an error message)
        }
        setConfirmationModal(false);
    };
    const handleDeleteSubSubsection = async (subsectionId) => {
        console.log("token:", token);
        // Dispatch delete subsection action
        console.log("Deleting subsection with ID:", subsectionId);
        const result = await deleteSubsection(subsectionId, course._id, token);
        if (result) {
            console.log("Subsection deleted successfully:", result);
            dispatch(setCourse(result));
            // Handle successful deletion (e.g., show a success message)
        } else {
            console.error("Failed to delete subsection");
            // Handle deletion failure (e.g., show an error message)
        }
        setConfirmationModal(false);
    };

    return (
        <div className='flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl'>
            {course?.sections?.length > 0 ? (
                course.sections.map((section) => (
                    <details 
                        key={section._id} 
                        open
                        className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden transition-all duration-300 hover:border-slate-600"
                    >
                        <summary className='flex items-center justify-between p-4 bg-slate-800 cursor-pointer hover:bg-slate-700/70 transition-all duration-200 select-none'>
                            <div className='flex items-center gap-4'>
                                <RxDropdownMenu className='text-slate-400 transition-transform duration-200 group-open:rotate-90' size={20} />
                                <h3 className='text-lg font-semibold text-slate-100 tracking-wide'>{section.title}</h3>
                            </div>

                            <div className='flex items-center gap-3'>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleChangeEditTitle(section._id, section.title);
                                    }} 
                                    className='p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-all duration-200'
                                    title="Edit section title"
                                >
                                    <MdModeEdit size={18} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setConfirmationModal({
                                            text1: "Delete this section?",
                                            text2: "All the lectures in this section will be deleted.",
                                            btn1Text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => handleDeleteSection(section._id),
                                            btn2Handler: () => setConfirmationModal(false)
                                        });
                                    }}
                                    className='p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all duration-200'
                                    title="Delete section"
                                >
                                    <MdOutlineDeleteOutline size={18} />
                                </button>
                                <div className='w-px h-6 bg-slate-600 mx-1'></div>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setViewSubSection(section.id);
                                    }} 
                                    className='p-2 text-slate-400 hover:text-green-400 hover:bg-slate-700 rounded-lg transition-all duration-200'
                                    title="View section details"
                                >
                                    <IoMdArrowDropdown size={20} />
                                </button>
                            </div>
                        </summary>
                        
                        <div className='px-4 pb-4'>
                            {section.subsections?.length > 0 ? (
                                <div className='space-y-3 mt-4'>
                                    {section.subsections.map((subsection) => (
                                        <div 
                                            key={subsection._id}
                                            onClick={() => setViewSubSection(subsection)}
                                            className='group flex items-center justify-between p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700/80 transition-all duration-200 border border-slate-600 hover:border-slate-500'
                                        >
                                            <div className='flex items-center gap-4'>
                                                <div className='p-2 bg-slate-600 rounded-lg group-hover:bg-slate-500 transition-colors duration-200'>
                                                    <FaPlay className='text-slate-300' size={16} />
                                                </div>
                                                <span className='text-slate-200 font-medium'>{subsection.title}</span>
                                            </div>
                                            
                                            <div 
                                                onClick={(e) => e.stopPropagation()}
                                                className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                                            >
                                                <button 
                                                    onClick={() => setEditSubSection({ ...subsection, sectionId: section._id })} 
                                                    className='p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-all duration-200'
                                                    title="Edit lecture"
                                                >
                                                    <MdModeEdit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setConfirmationModal({
                                                            text1: "Delete this lecture?",
                                                            text2: "This action cannot be undone.",
                                                            btn1Text: "Delete",
                                                            btn2Text: "Cancel",
                                                            btn1Handler: () => handleDeleteSubSubsection(subsection._id),
                                                            btn2Handler: () => setConfirmationModal(false)
                                                        });
                                                    }} 
                                                    className='p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-all duration-200'
                                                    title="Delete lecture"
                                                >
                                                    <MdOutlineDeleteOutline size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='mt-4 p-4 text-center text-slate-500 italic'>
                                    No lectures in this section yet
                                </div>
                            )}
                            
                            <div className='mt-6'>
                                <button 
                                    className='flex items-center gap-3 px-4 py-2 text-sm font-medium text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg transition-all duration-200 border border-yellow-400/20 hover:border-yellow-400/40'
                                    onClick={() => setAddSubSection(section._id)}
                                >
                                    <BiVideoPlus size={20} />
                                    <span>Add New Lecture</span>
                                </button>
                            </div>
                        </div>
                    </details>
                ))
            ) : (
                <div className='text-center py-12'>
                    <div className='text-slate-400 text-lg mb-2'>No sections created yet</div>
                    <div className='text-slate-500 text-sm'>Add your first section to get started</div>
                </div>
            )}
            
            {
                addSubSection ? (<SubSectionModal modaData={addSubSection} setModalData={setAddSubSection} add={true} />)
                    : viewSubSection ? (<SubSectionModal modaData={viewSubSection} setModalData={setViewSubSection} view={true} />)
                        : editSubSection ? (<SubSectionModal modaData={editSubSection} setModalData={setEditSubSection} edit={true} />)
                            : null
            }
            {
                confirmationModal ? (<ConfirmationModal modalData={confirmationModal} />) : null
            }
        </div>
    );
}
