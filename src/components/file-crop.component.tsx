import React, { useState, useContext, useEffect, useRef } from "react";
import { StateContext } from "../state";
import Cropper from "react-cropper";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { sharpenImageRequest } from "../helpers/helper";
import { CroppedImageModel } from './../models/cropped-images.model';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
  const [croppedImages, setCroppedImages] = useState<CroppedImageModel[]>([])
  const [isSharpening, setIsSharpening] = useState<boolean>(false);
  const reference = useRef<boolean>();
  reference.current = isSharpening;

  const setRawImage = (image: string) => {
    setRaw(image);
  };

  const handleImageCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blobValue: Blob | null) => {
        if (blobValue) {
          const img = cropper.getCroppedCanvas().toDataURL();
          const copyCroppedImages = [...croppedImages];
          copyCroppedImages.push({
            blob: blobValue,
            title: `crop ${copyCroppedImages.length + 1}`,
            type: 'gene',
            dataUrl: img
          });
          setCroppedImages(copyCroppedImages);
        }
      });

      //setCroppedImage(img);
      //setState(State.SHARPENING);
    } else {
      console.error("Cropper is not defined!");
    }
  };

  const startAnalysis = () => {
    setState(State.CROPPED);
    serviceInstance.setCroppedImages(croppedImages)
  }

/*   const setSharpening = async (value: boolean) => {
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
  } */

  const changeCroppedImageAttribute = (attribute: 'title'|'type', value: string, index: number) => {
    const copyCroppedImages = [...croppedImages];
    copyCroppedImages[index][attribute] = value;
    setCroppedImages(copyCroppedImages);
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
            <div style={{ display: "flex", flexDirection: "column" }} >
              <div className="flex flex-row">
                <div>
                  <p>Image</p>
                  <Cropper style={{ width: "50vw", height: "100%", maxHeight: "50vh", maxWidth: "50vw" }} zoomTo={0.5} initialAspectRatio={1}
                    src={raw} viewMode={1} minCropBoxHeight={10} minCropBoxWidth={10}
                    background={false} responsive={true} autoCropArea={1} checkOrientation={false}
                    onInitialized={(instance) => setCropper(instance)} guides={true} />
                  <button onClick={handleImageCrop} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Crop image</button>
                </div>
                <div className="ml-3">
                  <p>Cropped images</p>
                  <div>

                    <TableContainer component={Paper} className="overflow-y-auto max-h-176">
                      <Table sx={{ width: '100%' }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {croppedImages.map((imageItem, i) => (
                            <TableRow
                              key={i}
                              sx={{
                                "&:last-child td, &:last-child th": { border: 0 },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <TextField
                                  id="outlined-size-small"
                                  value={imageItem.title}
                                  size="small"
                                  onChange={(e) => changeCroppedImageAttribute('title', e.target.value, i)}
                                  fullWidth
                                  style={{ minWidth: 100, }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <img src={imageItem.dataUrl} style={{ maxHeight: "200px", maxWidth: "200px" }} />
                              </TableCell>
                              <TableCell align="right">
                                <FormControl sx={{ m: 1, whiteSpace: "nowrap" }} size="small">
                                  <InputLabel id="select-cropped-image-type">Type</InputLabel>
                                  <Select
                                    value={imageItem.type}
                                    onChange={(e) => changeCroppedImageAttribute('type', e.target.value, i)}
                                    labelId="select-cropped-image-type"
                                    label="Type"
                                  >
                                    <MenuItem value="gene">Gene</MenuItem>
                                    <MenuItem value="test">Test</MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton aria-label="delete" size="large">
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
              <div className="mt-5 w-full flex justify-end">
                <button type="button" onClick={startAnalysis} disabled={croppedImages.length === 0} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                  {state === State.CROPPING ? 'Start analysis' : 'Start analysis again'}
                </button>
              </div>
            </div>
          {/* {state === State.SHARPENING && (
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
          )} */}
          {/* {state === State.CROPPED && (
            <div>
              <img src={croppedImage} className="my-5 border border-gray-400 rounded-lg" alt="preview of cropped" />
              <button type="button" onClick={enableEdit} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Change image
              </button>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}

export default FileCropComponent;
