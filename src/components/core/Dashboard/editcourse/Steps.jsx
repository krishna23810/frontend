import { FaCheck } from "react-icons/fa6"
// import FormToCreate from "../CreateCourse/Course Information/form"
import CourseBuilder from "../CreateCourse/courseBuilder/CourseBuilder"
import PublishCourse from "../CreateCourse/PublishCourse/PublishCourse"
import { useSelector } from "react-redux"
import UpdateCourseForm from "../CourseForm"
// import WideForm from "../MyCourses/UpdateCourse/WideForm"
// import WideForm from "../MyCourses/UpdateCourse/SimpleUpdateForm"
// import WideForm from "../MyCourses/UpdateCourse/UpdateCourseForm"
// import CourseForm from '../CourseForm';




export default function Steps() {

     const { step } = useSelector((state) => state.course);
     console.log("Current step in Steps component:", step);
    
    const steps = [
        {
            id: 1,
            title: "Edit Course Information",
            description: "Basic details about your course"
        },
        {
            id: 2,
            title: "Edit Course Builder",
            description: "Create sections and lectures"
        },
        {
            id: 3,
            title: "Edit Publish",
            description: "Final review and publish"
        }
    ]
    return (
        <div>
            <div className="flex items-center justify-between">
                {steps.map((item, index) => (
                    <div key={item.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div className={`
                                                w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300
                                                ${step === item.id
                                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                                    : step > item.id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                                }
                                            `}>
                                {step > item.id ? <FaCheck className="w-5 h-5" /> : item.id}
                            </div>
                            <div className="mt-3 text-center">
                                <h3 className={`
                                                    font-semibold text-sm transition-colors duration-300
                                                    ${step === item.id
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : step > item.id
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-slate-600 dark:text-slate-400'
                                    }
                                                `}>
                                    {item.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`
                                                flex-1 h-1 mx-4 transition-all duration-300
                                                ${step > item.id
                                    ? 'bg-green-500'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                }
                                            `} />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6 md:p-8">
                            {step === 1 && (
                                <div className="animate-fadeIn">
                                    <UpdateCourseForm />
                                </div>
                            )}
                            {step === 2 && (
                                <div className="animate-fadeIn">
                                    <CourseBuilder />
                                </div>
                            )}
                            {step === 3 && (
                                <div className="animate-fadeIn">
                                    <PublishCourse />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
