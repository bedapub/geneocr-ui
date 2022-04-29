import React, { useState, useContext, useEffect } from "react";
import { StateContext } from "../state";
import Cropper from "react-cropper";

function FileCropComponent() {
  const { serviceInstance } = useContext(StateContext);
  const [raw, setRaw] = useState<string>();
  const [cropper, setCropper] = useState<Cropper>();
  const [croppedImage, setCroppedImage] = useState<string>();

  const setRawImage = (image: string) => {
    setRaw(image);
  };

  const handleSave = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
        if (blob) {
          serviceInstance.setCroppedImage(blob);
        }
      });
      const img = cropper.getCroppedCanvas().toDataURL();
      setCroppedImage(img);
    } else {
      console.error("Cropper is not defined!");
    }
  };

  const enableEdit = () => {
    serviceInstance.setEditingImage(true);
    setCroppedImage("");
  };

  useEffect(() => {
    const subscription = serviceInstance.getRawImage.subscribe(setRawImage);
    return () => subscription.unsubscribe();
  }, [serviceInstance]);

  return (
    <div className="mt-5">
      {raw && (
        <div>
          {!croppedImage && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Cropper
                style={{ width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                src={raw}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
              <div className="mt-5 w-full flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Analyze
                </button>
              </div>
            </div>
          )}
          {croppedImage && (
            <div>
              <img
                src={croppedImage}
                className="my-5 border border-gray-400 rounded-lg"
                alt="preview of cropped"
              />
              <button
                type="button"
                onClick={enableEdit}
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Change image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileCropComponent;
