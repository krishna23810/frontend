import React, { useEffect } from 'react';
// import Steps from './steps';
import Steps from '../editcourse/Steps';
import {resetCourseState} from '../../../../slice/courseSlice';
import { useDispatch } from 'react-redux';

export default function CreateCourse() {
   const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      // Cleanup logic if needed
      dispatch(resetCourseState());
    };
  }, []);

    return (
        <div className="flex w-full min-h-screen  bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Progress Header */}
            <div className="w-full px-4 py-8 bg-white dark:bg-slate-800 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        Create Your Course
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">
                        Follow these steps to create and publish your course
                    </p>
                    
                    <Steps />
                    
                </div>
            </div>
            <div className="lg:col-span-1 p-5 mt-96">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Uploading Tips</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Do not refresh the page after course creation, It may cause failer in course details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Use high-quality images for better engagement.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Keep the file size under 2MB for faster uploads.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Supported formats: JPG, PNG, GIF.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Set the course type to "Paid" or "Free".</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Provide a detailed course description.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Video section controls the course overview video.</span>
                </li>
              </ul>
            </div>
          </div>
            
        </div>
    )
}
