import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const SimpleUpload = ({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  image = false,
  viewData = null,
  editData = null,
  onChange,
  accept,
  ...props
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (setValue) setValue(name, selectedFile);
    if (onChange) onChange(selectedFile);
  };

  const acceptType = accept || (video ? "video/*" : image ? "image/*" : "*");

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept={acceptType}
          onChange={handleFileChange}
          className="hidden"
          {...(register ? register(name) : {})}
          {...props}
        />
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
          onClick={() => document.querySelector(`input[name="${name}"]`)?.click()}
        >
          <FiUpload className="mx-auto mb-2 text-3xl text-gray-400" />
          <p className="text-gray-600">
            {video ? "Choose video file" : image ? "Choose image file" : "Choose file"}
          </p>
        </div>
      </div>

      {errors && errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}

      {viewData && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Current file:</p>
          {video ? (
            <video src={viewData} controls className="mt-1 max-w-full h-auto rounded" style={{ maxHeight: '200px' }} />
          ) : (
            <img src={viewData} alt="Current" className="mt-1 max-w-full h-auto rounded" style={{ maxHeight: '200px' }} />
          )}
        </div>
      )}

      {editData && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Current file:</p>
          {video ? (
            <video src={editData} controls className="mt-1 max-w-full h-auto rounded" style={{ maxHeight: '200px' }} />
          ) : (
            <img src={editData} alt="Current" className="mt-1 max-w-full h-auto rounded" style={{ maxHeight: '200px' }} />
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleUpload;
