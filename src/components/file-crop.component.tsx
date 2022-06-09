import React, { useState, useContext, useEffect, useRef } from "react";
import { StateContext } from "../state";
import Cropper from "react-cropper";
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
import NothingCropppedYet from "./crop-imagesplitter.png";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Box, LinearProgress } from "@mui/material";
import { sharpenFastImageRequest, getGeneOrganismsRequest } from "../helpers/helper";



function FileCropComponent() {
  const { serviceInstance } = useContext(StateContext);
  const [raw, setRaw] = useState<string>();
  const [cropper, setCropper] = useState<Cropper>();
  const [croppedImages, setCroppedImages] = useState<CroppedImageModel[]>([])
  const [isSharpening, setIsSharpening] = useState<boolean>(false);
  const [editingExisting, setEditingExisting] = useState<number>(-1);
  const [cropperEdit, setCropperEdit] = useState<boolean>(true);
  const [oldBlobs, setOldBlobs] = useState<Blob[]>([]);
  const [geneOrganisms, setGeneOrganisms] = useState<string[]>(['all']);
  const reference = useRef<boolean>();
  reference.current = isSharpening;

  const setRawImage = (image: string) => {
    setRaw(image);
  };

  const testSetCropper = (cropperValue: Cropper) => {
    setCropper(cropperValue);
  }

  const handleImageCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blobValue: Blob | null) => {
        if (blobValue) {
          const img = cropper.getCroppedCanvas().toDataURL();
          const copyCroppedImages = [...croppedImages];
          if (editingExisting === -1) {
            copyCroppedImages.push({
              blob: blobValue,
              title: `crop ${copyCroppedImages.length + 1}`,
              type: 'gene',
              geneType: 'all',
              dataUrl: img,
              status: 'cropped',
              cropBoxData: {
                left: cropper.getCropBoxData().left,
                top: cropper.getCropBoxData().top,
                width: cropper.getCropBoxData().width,
                height: cropper.getCropBoxData().height,
                imageHeight: cropper.getCanvasData().naturalHeight,
                imageWidth: cropper.getCanvasData().naturalWidth
              }
            });
          } else {
            copyCroppedImages[editingExisting].blob = blobValue;
            copyCroppedImages[editingExisting].dataUrl = img;
            copyCroppedImages[editingExisting].cropBoxData = {
              left: cropper.getCropBoxData().left,
              top: cropper.getCropBoxData().top,
              width: cropper.getCropBoxData().width,
              height: cropper.getCropBoxData().height,
              imageHeight: cropper.getCanvasData().naturalHeight,
              imageWidth: cropper.getCanvasData().naturalWidth
            }
            setEditingExisting(-1);
          }

          setCroppedImages(copyCroppedImages);

          cropper.setCropBoxData({
            height: cropper.getCanvasData().height,
            left: cropper.getCanvasData().left,
            top: cropper.getCanvasData().top,
            width: cropper.getCanvasData().width
          });
        }
        setCropperEditMode(false);
      });
    } else {
      console.error("Cropper is not defined!");
    }
  };

  const startAnalysis = () => {
    serviceInstance.setCroppedImages(croppedImages);
    serviceInstance.setAreaSetting('analyzing');
  }

  const setCropperEditMode = (value: boolean) => {
    setCropperEdit(value);
    if (value) {
      cropper?.enable();
    } else {
      cropper?.disable();
    }
  }

  const changeCroppedImageAttribute = (attribute: 'title' | 'type' | 'geneType', value: string, index: number) => {
    const copyCroppedImages = [...croppedImages];
    copyCroppedImages[index][attribute] = value;
    setCroppedImages(copyCroppedImages);
  }

  const deleteCroppedImage = (index: number) => {
    const copyCroppedImages = [...croppedImages];
    copyCroppedImages.splice(index, 1);
    setCroppedImages(copyCroppedImages);
  }

  const startSharpening = async () => {
    if (cropper) {
      cropper.reset();
      cropper.setCropBoxData({
        height: cropper.getCanvasData().height,
        left: cropper.getCanvasData().left,
        top: cropper.getCanvasData().top,
        width: cropper.getCanvasData().width
      });
      cropper.getCroppedCanvas().toBlob(async (blob: Blob | null) => {
        if (blob) {
          setIsSharpening(true);
          var file = new File([blob], "image.png", {
            lastModified: new Date().getTime(),
            type: blob.type,
          });
          const imageBlob = await sharpenFastImageRequest(file, 'cv2kernel');
          if (reference.current) {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            const copyOldBlobs = [...oldBlobs];
            copyOldBlobs.push(blob);
            setOldBlobs(copyOldBlobs);
            setRaw(imageObjectURL);
            setIsSharpening(false);
            await new Promise(resolve => setTimeout(resolve, 100));
            await recropImages();
          }
        }
      });
    }
  };

  const recropImages = async () => {
    if (cropper) {
      const copyCroppedImages = [...croppedImages];
      for await (const croppedImage of copyCroppedImages) {
        const widthFactor = cropper.getCanvasData().naturalWidth / croppedImage.cropBoxData.imageWidth;
        const heightFactor = cropper.getCanvasData().naturalHeight / croppedImage.cropBoxData.imageHeight;
        cropper.enable();
        cropper.setCropBoxData({
          height: croppedImage.cropBoxData.height * heightFactor,
          width: croppedImage.cropBoxData.width * widthFactor,
          top: croppedImage.cropBoxData.top * heightFactor,
          left: croppedImage.cropBoxData.left * widthFactor
        });
        const img = cropper.getCroppedCanvas().toDataURL();
        const blob = await new Promise<Blob>((resolve, reject) => {
          cropper.getCroppedCanvas().toBlob((blobValue: Blob | null) => {
            if (blobValue) {
              resolve(blobValue);
            } else {
              reject(null);
            }
          });
        });
        croppedImage.dataUrl = img;
        croppedImage.blob = blob;
      }
      cropper.setCropBoxData({
        height: cropper.getCanvasData().height,
        left: cropper.getCanvasData().left,
        top: cropper.getCanvasData().top,
        width: cropper.getCanvasData().width
      });
      cropper.disable();
      setCroppedImages(copyCroppedImages);
    }
  }

  const cancelSharpening = () => {
    setIsSharpening(false);
  }

  const handleSetCrop = (data: CroppedImageModel, index: number) => {
    if (cropper) {
      setCropperEditMode(true);
      cropper.setCropBoxData(data.cropBoxData);
      setEditingExisting(index);
    }
  }

  const createNewCrop = () => {
    if (cropper) {
      setCropperEditMode(true);
      cropper.setCropBoxData({
        height: cropper.getCanvasData().height,
        left: cropper.getCanvasData().left,
        top: cropper.getCanvasData().top,
        width: cropper.getCanvasData().width
      });
      setEditingExisting(-1);
    }
  }

  useEffect(() => {
    const subscription = serviceInstance.getRawImage.subscribe(setRawImage);
    getGeneOrganismsRequest().then((value: string[]) => {
      setGeneOrganisms(value);
    })
    return () => subscription.unsubscribe();
  }, [serviceInstance]);

  return (
    <div className="mt-5">
      {raw && (
        <div>
          <div style={{ display: "flex", flexDirection: "column" }} >
            <div className="flex flex-row">
              <div>
                <div className="flex flex-row">
                  {cropperEdit && (
                    <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" disabled>Edit is enabled</button>
                  )}
                  {!cropperEdit && (
                    <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" disabled>Edit is disabled</button>
                  )}

                  {!isSharpening && (
                    <div>
                      <button onClick={startSharpening} disabled={isSharpening} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">sharpening</button>
                    </div>)

                  }
                  {isSharpening && (
                    <button onClick={cancelSharpening} type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
                  )}
                </div>
                {isSharpening && (
                  <div className="mb-2">
                    <Box className="mt-2" sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box>
                    <p className="text-xs text-neutral-400">sharpening image... (You can cancel sharpening with the <strong>cancel</strong> button)</p>
                  </div>
                )}
                {!isSharpening && (
                  <Cropper style={{ width: "100%", height: "auto", maxHeight: "100%", maxWidth: "100%" }} zoomTo={0.5} initialAspectRatio={1}
                    src={raw} viewMode={1} minCropBoxHeight={10} minCropBoxWidth={10}
                    background={false} responsive={true} autoCropArea={1} checkOrientation={false}
                    onInitialized={(instance) => testSetCropper(instance)} guides={true} />
                )}
                <div className="mt-3 flex flex-row-reverse">
                  <button onClick={handleImageCrop} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Crop image</button>
                </div>
              </div>
              <div className="ml-3 w-full">
                <div>
                  {croppedImages.length !== 0 && (
                    <div>
                      <TableContainer component={Paper} className="overflow-y-auto" style={{ maxHeight: '500px' }}>
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
                              <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 }, }}
                                className={i === editingExisting ? 'border border-4 border-solid border-sky-600 rounded-md' : ''} >
                                <TableCell component="th" scope="row">
                                  <TextField id="outlined-size-small" value={imageItem.title} size="small"
                                    onChange={(e) => changeCroppedImageAttribute('title', e.target.value, i)}
                                    fullWidth style={{ minWidth: 100, }} />
                                </TableCell>
                                <TableCell align="right">
                                  <img src={imageItem.dataUrl} style={{ maxHeight: "200px", maxWidth: "200px" }} />
                                </TableCell>
                                <TableCell align="right">
                                  <FormControl sx={{ m: 1, whiteSpace: "nowrap" }} size="small">
                                    <InputLabel id="select-word-type">Type</InputLabel>
                                    <Select value={imageItem.type} onChange={(e) => changeCroppedImageAttribute('type', e.target.value, i)}
                                      labelId="select-word-type" label="Type">
                                      <MenuItem value="gene">Gene</MenuItem>
                                      <MenuItem value="text">Free text</MenuItem>
                                    </Select>
                                  </FormControl>
                                  {imageItem.type === 'gene' && (
                                    <FormControl sx={{ m: 1, whiteSpace: "nowrap" }} size="small">
                                      <InputLabel id="select-gene-type">Gene organism</InputLabel>
                                      <Select value={imageItem?.geneType} onChange={(e) => changeCroppedImageAttribute('geneType', e.target.value, i)}
                                        labelId="select-gene-type" label="Type">
                                        {geneOrganisms.map((geneOrganism, geneOrganismIndex) => (
                                          <MenuItem key={`${geneOrganism}-${geneOrganismIndex}`} value={geneOrganism}>{geneOrganism}</MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton onClick={() => { handleSetCrop(imageItem, i) }} aria-label="delete" size="large">
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton onClick={() => { deleteCroppedImage(i) }} aria-label="delete" size="large">
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <div className={-1 === editingExisting && cropperEdit ? 'mt-3 border border-4 border-solid border-sky-600 rounded-md' : ''}>
                        <div className="flex flex-row items-center">
                          <IconButton onClick={createNewCrop} aria-label="delete" size="large">
                            <AddIcon />
                          </IconButton>
                          <p>Create new crop image</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {croppedImages.length === 0 && (
                    <div className="w-full flex flex-col items-center mt-6">
                      <img src={NothingCropppedYet} className="w-36" />
                      <p>No image cropped yet, crop your first image!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 w-full flex justify-end">
              <button type="button" onClick={startAnalysis} disabled={croppedImages.length === 0} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                {true ? 'Start analysis' : 'Start analysis again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileCropComponent;
