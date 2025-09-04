import { useDispatch } from "react-redux"; 
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState , useEffect } from "react";
import { FaPlay, FaCheckCircle, FaCircle, FaChevronDown, FaChevronRight } from "react-icons/fa";


const VideoSideBar = ({ setReviewModal }) => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const [activeSection, setActiveSection] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId,subSectionId} = useParams();
    const {CourseSectionData, FullCourseData, CompletedLectures, TotalNoOfLectures} = useSelector((state) => state.viewCourse);

    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        if (CourseSectionData && CourseSectionData.length > 0) {
            const currentSectionIndex = CourseSectionData.findIndex(section => section._id === sectionId);

            const currentSubSectionIndex = CourseSectionData?.[currentSectionIndex]?.subsections?.findIndex(sub => sub._id === subSectionId);

            const activeSubSection = CourseSectionData[currentSectionIndex]?.subsections?.[currentSubSectionIndex]?._id;
            
            // Set current section
            setActiveSection(CourseSectionData[currentSectionIndex]?._id);
            // Set current sub section
            setVideoBarActive(activeSubSection);

            // Expand the current section by default
            if (CourseSectionData[currentSectionIndex]?._id) {
                setExpandedSections(prev => ({
                    ...prev,
                    [CourseSectionData[currentSectionIndex]._id]: true
                }));
            }
        }
    }, [CourseSectionData, TotalNoOfLectures, location.pathname, sectionId, subSectionId]);

    const handleSectionClick = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleVideoClick = (sectionId, subSectionId) => {
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`);
    };

    const calculateProgress = () => {
        if (!CompletedLectures || !TotalNoOfLectures || TotalNoOfLectures === 0) return 0;
        return Math.round((CompletedLectures.length / TotalNoOfLectures) * 100);
    };

    const isVideoCompleted = (videoId) => {
        console.log("Checking completion for videoId:", videoId);
        console.log("CompletedLectures", CompletedLectures);
        if (CompletedLectures && CompletedLectures.filter((video) => video._id === videoId).length > 0) {
            console.log("Video is completed:", videoId);
            return true;
        }
        return false;
    };

    const toggleSection = (sectionId) => {
        // Only allow one section to be expanded at a time
        setExpandedSections(prev => {
            const newState = {};
            // If the clicked section is already expanded, collapse it
            // Otherwise, expand only this section and collapse others
            if (prev[sectionId]) {
                // Clicking an already expanded section collapses it
                return { ...prev, [sectionId]: false };
            } else {
                // Expand the clicked section and collapse all others
                return { [sectionId]: true };
            }
        });
    };

    if (!CourseSectionData || CourseSectionData.length === 0) {
        return (
            <div className="w-64 bg-slate-800 p-4 h-[calc(100vh-5rem)] text-white">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-700 rounded mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    const progressPercentage = calculateProgress();

    return (
        <div className="w-64 bg-slate-800 text-white h-[calc(100vh-5rem)] overflow-y-auto">
            {/* Course Header */}
            <div className="p-4 border-b border-slate-700">
                <h2 className="font-bold text-lg mb-2 truncate">
                    {FullCourseData?.course?.courseName || "Course Content"}
                </h2>
                <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                    {CompletedLectures?.length || 0} of {TotalNoOfLectures} lectures completed
                </div>
            </div>

            {/* Sections List */}
            <div className="p-2">
                {CourseSectionData.map((section, sectionIndex) => (
                    <div key={section._id} className="mb-2">
                        {/* Section Header */}
                        <div 
                            className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                                activeSection === section._id ? 'bg-slate-700' : 'hover:bg-slate-700'
                            }`}
                            onClick={() => toggleSection(section._id)}
                        >
                            <div className="flex items-center">
                                <span className="text-sm font-medium">
                                    {sectionIndex + 1}. {section.title}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-xs text-slate-400 mr-2">
                                    {section.subsections?.length || 0} videos
                                </span>
                                {expandedSections[section._id] ? (
                                    <FaChevronDown className="text-slate-400 text-xs" />
                                ) : (
                                    <FaChevronRight className="text-slate-400 text-xs" />
                                )}
                            </div>
                        </div>

                        {/* Videos List */}
                        {expandedSections[section._id] && section.subsections && (
                            <div className="ml-4 mt-1">
                                {section.subsections.map((video, videoIndex) => (
                                    <div
                                        key={video._id}
                                        className={`flex items-center p-2 rounded cursor-pointer transition-colors mb-1 ${
                                            videoBarActive === video._id 
                                                ? 'bg-yellow-500 text-slate-900' 
                                                : 'hover:bg-slate-700'
                                        }`}
                                        onClick={() => handleVideoClick(section._id, video._id)}
                                    >
                                        <div className="flex items-center flex-1">
                                            {isVideoCompleted(video._id) ? (
                                                <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                                            ) : (
                                                <FaCircle className="text-slate-400 mr-2 text-xs" />
                                            )}
                                            <span className="text-sm truncate">
                                                {videoIndex + 1}. {video.title}
                                            </span>
                                        </div>
                                        <FaPlay className="text-slate-400 text-xs" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Review Button */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={() => setReviewModal(true)}
                    className="w-full bg-yellow-500 text-slate-900 py-2 px-4 rounded font-medium hover:bg-yellow-600 transition-colors"
                >
                    Leave a Review
                </button>
            </div>
        </div>
    );
};

export default VideoSideBar;