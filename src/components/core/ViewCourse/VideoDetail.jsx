import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateCompletedLectures } from "../../../slice/viewCourseSlice";
import { FaCirclePlay, FaArrowRight, } from "react-icons/fa6";
import { FaCheckCircle, FaArrowLeft, FaRedo } from "react-icons/fa";
import { markLectureAsComplete } from "../../../services/operation/ViewCourseApi";

// import Player from "./videoBox";
import ReactPlayer from "react-player";
import {
    MediaController,
    MediaControlBar,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaVolumeRange,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaMuteButton,
    MediaFullscreenButton,
} from "media-chrome/react";


const VideoDetail = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerRef = useRef(null);
    const { token } = useSelector((state) => state.auth);
    const location = useLocation();

    const { CourseSectionData, FullCourseData, CompletedLectures, TotalNoOfLectures } = useSelector((state) => state.viewCourse);

    const [videodata, setVideodata] = useState(null);
    const [isVideoCompletedState, setIsVideoCompletedState] = useState(false);
    const [videoEnding, setVideoEnding] = useState(false);
    const [loading, setLoading] = useState(false);

    const isFirstVideo = () => {
        const currentSectionIndex = CourseSectionData.findIndex(section => section._id === sectionId);
        const currentSubSectionIndex = CourseSectionData?.[currentSectionIndex]?.subsections?.findIndex(sub => sub._id === subSectionId);
        if (currentSubSectionIndex === 0 && currentSectionIndex === 0) return true;
        return false;
    }

    const isLastVideo = () => {
        const currentSectionIndex = CourseSectionData.findIndex(section => section._id === sectionId);
        const subSectionLength = CourseSectionData?.[currentSectionIndex]?.subsections?.length || 0;
        const currentSubSectionIndex = CourseSectionData?.[currentSectionIndex]?.subsections?.findIndex(sub => sub._id === subSectionId);
        if (currentSubSectionIndex === subSectionLength - 1 && currentSectionIndex === CourseSectionData.length - 1) return true;
        return false;
    }

    console.log("CourseSectionData",CourseSectionData);

    const goToNextVideo = () => {
        if (isLastVideo()) return;
        const currentSectionIndex = CourseSectionData.findIndex(section => section._id === sectionId);

        const currentSubSectionIndex = CourseSectionData?.[currentSectionIndex]?.subsections?.findIndex(sub => sub._id === subSectionId);

        const subSectionLength = CourseSectionData?.[currentSectionIndex]?.subsections?.length || 0;


        if (currentSubSectionIndex + 1 < subSectionLength) {
            const nextSubSection = CourseSectionData?.[currentSectionIndex]?.subsections?.[currentSubSectionIndex + 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSection}`);
        } else {
            const nextSection = CourseSectionData[currentSectionIndex + 1]._id;
            const nextSubSection = CourseSectionData[currentSectionIndex + 1].subsections[0]._id;
            if (nextSection) {
                navigate(`/view-course/${courseId}/section/${nextSection}/sub-section/${nextSubSection}`);
            }
        }
    }

    const goToPreviousVideo = () => {
        if (isFirstVideo()) return;
        const currentSectionIndex = CourseSectionData.findIndex(section => section._id === sectionId);
        const currentSubSectionIndex = CourseSectionData?.[currentSectionIndex]?.subsections?.findIndex(sub => sub._id === subSectionId);
        const subSectionLength = CourseSectionData?.[currentSectionIndex]?.subsections?.length || 0;

        if (currentSubSectionIndex > 0) {
            const previousSubSection = CourseSectionData?.[currentSectionIndex]?.subsections?.[currentSubSectionIndex - 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSection}`);
        } else {
            const previousSection = CourseSectionData[currentSectionIndex - 1];
            if (previousSection) {
                // /view-course/:courseId/section/:sectionId/sub-section/:subSectionId
                navigate(`/view-course/${courseId}/section/${previousSection._id}/sub-section/${previousSection.subsections[previousSection.subsections.length - 1]._id}`);
            }
        }
    }

    const handleLectureCompletion = async () => {
        setLoading(true);
        const response = await markLectureAsComplete({courseId:courseId , subSectionId:subSectionId}, token);
        if(response)
        dispatch(updateCompletedLectures(subSectionId));
        setLoading(false);
    }

    useEffect(() => {
        const setVideoSpecficDetails = async () => {
            if (!CourseSectionData.length) return;
            if (!courseId || !sectionId || !subSectionId) return navigate("/dashboard/enrolled-courses");

            const filteredSection = CourseSectionData.filter((section) => section._id === sectionId);
            const filteredVideoData = filteredSection?.[0].subsections.filter((video) => video._id === subSectionId);
            setVideodata(filteredVideoData?.[0] || null);
            setVideoEnding(false);
        }

        setVideoSpecficDetails();
    }, [CourseSectionData, TotalNoOfLectures, location.pathname, sectionId, subSectionId]);

    // console.log("Video ending", videoEnding);
//  type PlayerState = Omit<typeof initialState, 'src'> & {
//     src?: string;
//   };

//     const [state, setState] = useState < PlayerState > (initialState);
// console.log("Video data", videodata);
    return (
        <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6 lg:p-8 overflow-auto">
            {!videodata ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-6">
                        {/* Enhanced Loading Animation */}
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaCirclePlay className="text-yellow-500 text-2xl animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-300 text-lg font-medium">Loading video content</p>
                            <p className="text-gray-400 text-sm">Please wait while we prepare your lecture...</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full mx-auto">
                    {/* // Video Player Container */}
                    <div className="relative w-full bg-slate-800 rounded-lg overflow-hidden shadow-xl mb-6 -z-0">
                        <div className="relative w-full" >
                            {/* <div className="absolute int w-full h-full"> */}
                            <MediaController
                                style={{
                                    width: "100%",
                                    aspectRatio: "16/9",
                                }}
                            >
                                <ReactPlayer
                                    slot="media"
                                    src={videodata?.videoUrl}
                                    controls={false}
                                    onEnded={() => setVideoEnding(true)}
                                    ref={playerRef}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        "--controls": "none",
                                        relative: "true",
                                    }}
                                    className="relative z-2"
                                >
                                </ReactPlayer>
                                <MediaControlBar>
                                    <MediaPlayButton />
                                    <MediaSeekBackwardButton seekOffset={10} />
                                    <MediaSeekForwardButton seekOffset={10} />
                                    <MediaTimeRange />
                                    <MediaTimeDisplay showDuration />
                                    <MediaMuteButton />
                                    <MediaVolumeRange />
                                    <MediaPlaybackRateButton />
                                    <MediaFullscreenButton />
                                </MediaControlBar>
                            </MediaController>

                            {/* Video Ending Overlay */}
                            {videoEnding && (
                                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6 z-50">
                                    <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full text-center space-y-6">
                                        <div className="space-y-4">
                                            {!CompletedLectures.includes(subSectionId) && (
                                                <button
                                                    disabled={loading}
                                                    onClick={()=> handleLectureCompletion()}
                                                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${loading
                                                        ? 'bg-gray-600 cursor-not-allowed'
                                                        : 'bg-yellow-500 text-slate-900 hover:bg-yellow-600 hover:scale-105'
                                                        }`}
                                                >
                                                    {loading ? (
                                                        <div className="flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-2"></div>
                                                            Marking...
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center"
                                                        >
                                                            <FaCheckCircle className="mr-2" />

                                                            Mark as Complete
                                                        </div>
                                                    )}
                                                </button>
                                            )}

                                            <button
                                                disabled={loading}
                                                onClick={() => {
                                                    playerRef.current.currentTime = 0;

                                                    setVideoEnding(false);
                                                }}
                                                className="w-full py-3 px-6 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors duration-200 flex items-center justify-center"
                                            >
                                                <FaRedo className="mr-2" />
                                                Replay Video
                                            </button>
                                        </div>

                                        {/* Navigation Controls */}
                                        <div className="flex gap-4 pt-4 border-t border-slate-700">
                                            {!isFirstVideo() && (
                                                <button
                                                    disabled={loading}
                                                    onClick={goToPreviousVideo}
                                                    className="flex-1 py-2 px-4 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    <FaArrowLeft className="mr-2" />
                                                    Previous
                                                </button>
                                            )}
                                            {!isLastVideo() && (
                                                <button
                                                    disabled={loading}
                                                    onClick={goToNextVideo}
                                                    className="flex-1 py-2 px-4 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    Next
                                                    <FaArrowRight className="ml-2" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}



                        </div>
                    </div>
                    {/* </div> */}
                </div>
            )}
            {/* Video Information */}
            <div className="h-full w-full bg-slate-800 rounded-lg p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-white">{videodata?.title}</h1>
                    {CompletedLectures.includes(subSectionId) && (
                        <div className="flex items-center bg-green-600 bg-opacity-20 text-green-400 px-3 py-1 rounded-full text-sm">
                            <FaCheckCircle className="mr-1" />
                            Completed
                        </div>
                    )}
                </div>

                <p className="text-gray-300 leading-relaxed">{videodata?.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-4">Duration: {videodata?.duration || 'N/A'}</span>
                        <span>Lecture {CourseSectionData.findIndex(s => s._id === sectionId) + 1}.{CourseSectionData.find(s => s._id === sectionId)?.subsections?.findIndex(v => v._id === subSectionId) + 1}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VideoDetail;
