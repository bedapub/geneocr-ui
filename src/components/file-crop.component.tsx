import React, { useState, useContext, useEffect, useRef } from "react";
import { StateContext } from "../state";
import Cropper from "react-cropper";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { sharpenImageRequest } from "../helpers/helper";


enum State {
  CROPPING,
  SHARPENING,
  CROPPED
}

function FileCropComponent() {
  const { serviceInstance } = useContext(StateContext);
  const [raw, setRaw] = useState<string>();
  const [cropper, setCropper] = useState<Cropper>();
  const [croppedImage, setCroppedImage] = useState<string>();
  const [state, setState] = useState<State>(State.CROPPING)
  const [blob, setBlob] = useState<Blob>(new Blob());
  const [isSharpening, setIsSharpening] = useState<boolean>(false);
  const reference = useRef<boolean>();
  reference.current = isSharpening;

  const setRawImage = (image: string) => {
    setRaw(image);
  };

  const handleSave = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blobValue: Blob | null) => {
        if (blobValue) {
          setBlob(blobValue)
        }
      });
      const img = cropper.getCroppedCanvas().toDataURL();
      setCroppedImage(img);
      setState(State.SHARPENING);
    } else {
      console.error("Cropper is not defined!");
    }
  };

  const setSharpening = async (value: boolean) => {
    console.log(value);
    if (!value) {
      console.log(blob);
      serviceInstance.setCroppedImage(blob);
      setState(State.CROPPED);
      setIsSharpening(false);
    } else {
      setIsSharpening(true);
      var file = new File([blob], "image.png", {
        lastModified: new Date().getTime(),
        type: blob.type,
      });
      const image = await sharpenImageRequest(file);
      if (reference.current) {
        serviceInstance.setCroppedImage(image);
        setState(State.CROPPED);
        const imageObjectURL = URL.createObjectURL(image);
        setCroppedImage(imageObjectURL);
        setIsSharpening(false);
      }
    }
  }

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
          {state === State.CROPPING && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} >
              <Cropper style={{ width: "100%" }} zoomTo={0.5} initialAspectRatio={1}
                src={raw} viewMode={1} minCropBoxHeight={10} minCropBoxWidth={10}
                background={false} responsive={true} autoCropArea={1} checkOrientation={false}
                onInitialized={(instance) => setCropper(instance)} guides={true} />
              <div className="mt-5 w-full flex justify-end">
                <button type="button" onClick={handleSave} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                  Analyze
                </button>
              </div>
            </div>
          )}
          {state === State.SHARPENING && (
            <div>
              <p className="font-bold">Important</p>
              <p className="text-sm mb-2">Sharpening should be only used if necessary, because sharpen may take a long time and is unnecessary for a lot of images.</p>
              <button type="button" onClick={(_) => setSharpening(true)} disabled={isSharpening}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                Sharpen image
              </button>
              <button type="button" onClick={(_) => setSharpening(false)}
                className="mr-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Continue without sharpening
              </button>
              {isSharpening && (
                <div>
                  <Box className="mt-2" sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                  <p className="text-xs text-neutral-400">sharpening image... (You can cancel sharpening by continouing without sharpening)</p>
                </div>
              )}
              <img src={croppedImage} className="my-5 border border-gray-400 rounded-lg" alt="preview of cropped" />
            </div>
          )}
          {state === State.CROPPED && (
            <div>
              <img src={croppedImage} className="my-5 border border-gray-400 rounded-lg" alt="preview of cropped" />
              <button type="button" onClick={enableEdit} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
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
