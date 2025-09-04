

import React, { useState } from 'react';
import { FaPlay, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';


const Section = ({ content }) => {
    // console.log("Section content:", content);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const formatDuration = (durationInSeconds) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-4">
                {/* Section Header - Display once per section */}
                <div
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <button
                        onClick={() => toggleSection(content._id || content.title)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500">
                                Section 
                            </span>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {content.title}
                            </h3>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {content?.subsections?.length || 0} lectures
                            </span>
                            {expandedSections[content._id || content.title] ?
                                <FaChevronUp className="text-gray-400" /> :
                                <FaChevronDown className="text-gray-400" />
                            }
                        </div>
                    </button>

                    {/* Subsections - Display all subsections under this section */}
                    {expandedSections[content._id || content.title] && (
                        <div className="border-t border-gray-200">
                            {content?.subsections?.map((subsection, subsectionIndex) => (
                                <div
                                    key={subsection._id || subsectionIndex}
                                    className="px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FaPlay className="text-blue-500 text-sm" />
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-800">
                                                    {subsection.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {subsection.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <FaClock className="text-xs" />
                                            <span>{formatDuration(parseFloat(subsection.duration))}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!content.subsections || content.subsections.length === 0) && (
                                <div className="px-6 py-8 text-center text-gray-500">
                                    No content available in this section yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {content.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No course content available yet.</p>
                </div>
            )}
        </div>
    );
};

// Alternative simple version for basic content display
const SimpleSection = ({ content }) => {
    return (
        <div className="section">
            <details className="section-details">
                <summary className="section-title">{content.title}</summary>
                <div className="section-content">
                    <p>{content.description}</p>
                    {content.videoUrl && (
                        <video controls className="w-full mt-4 rounded-lg">
                            <source src={content.videoUrl} type="video/mp4" />
                        </video>
                    )}
                </div>
            </details>
        </div>
    );
};

export default Section;
export { SimpleSection };
