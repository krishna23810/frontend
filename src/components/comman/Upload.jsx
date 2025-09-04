import React from 'react';
import FileUpload from './FileUpload';

export const Upload = ({ 
  name, 
  label, 
  register, 
  setValue, 
  errors, 
  video = false, 
  image = false, 
  viewData = null, 
  editData = null,
  ...props 
}) => {
  // Determine accept type based on video/image props
  const acceptType = video ? "video/*" : image ? "image/*" : "*";
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <FileUpload
        name={name}
        label={label}
        accept={acceptType}
        register={register}
        setValue={setValue}
        errors={errors}
        preview={true}
        showProgress={true}
        showFileList={true}
        maxFiles={1}
        maxSize={video ? 50 * 1024 * 1024 : 5 * 1024 * 1024} // 50MB for video, 5MB for images
        placeholder={video ? "Choose video file..." : "Choose image file..."}
        dragDropText={video ? "Drag & drop video here or click to browse" : "Drag & drop image here or click to browse"}
        {...props}
      />
      
      {/* Display validation errors */}
      {errors && errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name].message || `${label || name} is required`}
        </p>
      )}
      
      {/* Display current file if viewData or editData is provided */}
      {viewData && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Current file:</p>
          {video ? (
            <video 
              src={viewData} 
              controls 
              className="mt-1 max-w-full h-auto rounded"
              style={{ maxHeight: '200px' }}
            />
          ) : (
            <img 
              src={viewData} 
              alt="Current" 
              className="mt-1 max-w-full h-auto rounded"
              style={{ maxHeight: '200px' }}
            />
          )}
        </div>
      )}
      
      {editData && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Current file:</p>
          {video ? (
            <video 
              src={editData} 
              controls 
              className="mt-1 max-w-full h-auto rounded"
              style={{ maxHeight: '200px' }}
            />
          ) : (
            <img 
              src={editData} 
              alt="Current" 
              className="mt-1 max-w-full h-auto rounded"
              style={{ maxHeight: '200px' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
