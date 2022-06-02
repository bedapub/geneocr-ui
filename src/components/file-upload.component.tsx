import React, { useState, useContext } from "react";
import { StateContext } from "../state";

function FileUploadComponent() {
  const { serviceInstance } = useContext(StateContext);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    if (event.target.files || event.target.files.length !== 0) {
      const objectUrl = URL.createObjectURL(event.target.files[0]);
      setPreview(objectUrl);
    }
  };

  const handleSubmission = () => {
    if (preview) {
      serviceInstance.setRawImage(preview);
      serviceInstance.setEditingImage(false);
    }
  };

  return (
    <div className="mt-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Upload new image
      </label>
      <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="user_avatar_help" onChange={changeHandler} type="file" accept=".jpg,.jpeg,.png"></input>
      {selectedFile && (
        <div className="flex flex-col items-center">
          <div className="">
            <img src={preview} style={{ maxHeight: "80%", maxWidth: "80%" }}
              className="my-5 border border-gray-400 rounded-lg" alt="preview of uploaded file" />
            <div className="flex flex-row-reverse">
              <button type="button" onClick={handleSubmission}
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Use image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploadComponent;
