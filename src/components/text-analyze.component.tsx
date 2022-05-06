import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../state";
import { filter, Subscription } from "rxjs";
import NothingFoundYetImage from "./nothing-found-yet.jpg";
import { analyzeImageRequest, checkSpellingRequest, wordValidationRequest } from "../helpers/helper";
import {
  SpellCheckItem,
  SpellCheckItemView,
} from "../models/word-spelling.model";
import { ImageAnalyzationResponseModel } from "../models/image-analysis.model";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { downloadDataAsTxt, downloadDataAsJson } from "../helpers/download-data";
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

function TextAnalyzeComponent() {
  const { serviceInstance } = useContext(StateContext);
  const [dataReady, setDataReady] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<string>('');
  const [result, setResult] = useState<SpellCheckItemView[]>([]);
  const [fileType, setFileType] = useState<string>('txt');
  const [useInvalidGenes, setUseInvalidGenes] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  const handleNewData = (data: Blob) => {
    analyzeImage(data);
    setDataReady(true);
  };

  const analyzeImage = async (data: Blob) => {
    setAnalyzing("image");
    var file = new File([data], "image.png", {
      lastModified: new Date().getTime(),
      type: data.type,
    });
    const response: ImageAnalyzationResponseModel = await analyzeImageRequest(
      file
    );
    setAnalyzing("spelling");
    const spelling: SpellCheckItem[] = await checkSpellingRequest(
      response.text
    );
    if (response.status == "success") {
      const formattedSpelling: SpellCheckItemView[] = spelling.map((x) => {
        return {
          suggestions: x.suggestions,
          initial_word: x.initial_word,
          gene_exists: x.gene_exists,
          best_canditate: x.best_canditate,
          final_word: x.initial_word,
          helper_text: x.gene_exists ? 'Gene is valid' : 'Invalid gene name!',
          use_for_download: true
        };
      });
      setResult(formattedSpelling);
      setAnalyzing("");
    } else {
      setErrorMessage(true);
      setAnalyzing("");
      setDataReady(false);
      console.error('Failed to read from image!');
    }
  };

  const changeFinalWord = (word: string, index: number) => {
    const copyResult = [...result];
    copyResult[index].final_word = word;
    setResult(copyResult);
  };

  const checkWord = async (word: string, index: number) => {
    let copyResult = [...result];
    copyResult[index].gene_exists = true;
    copyResult[index].helper_text = 'Checking gene...';
    setResult(copyResult);
    const response = await wordValidationRequest(word);
    copyResult = [...result];
    copyResult[index].gene_exists = response.valid;
    copyResult[index].helper_text = response.valid ? 'Gene is valid' : 'Invalid gene name!';
    setResult(copyResult);
  }

  const downLoadData = () => {
    if (fileType === 'txt') {
      downloadDataAsTxt(result, useInvalidGenes);
    } else if (fileType === 'json') {
      downloadDataAsJson(result, useInvalidGenes);
    }
    console.error('File format not found')
  }

  const changeDownload = (event: any, index: number) => {
    let copyResult = [...result];
    copyResult[index].use_for_download = event.target.checked;
    setResult(copyResult);
  }


  useEffect(() => {
    const subscription: Subscription = serviceInstance.getCroppedImage
      .pipe(filter((x) => !!x && x.size !== 0))
      .subscribe(handleNewData);
    return () => subscription.unsubscribe();
  }, [serviceInstance]);

  return (
    <div className="mt-5">
      <div>
        <Snackbar open={errorMessage} autoHideDuration={6000} onClose={(_) => setErrorMessage(false)}>
          <Alert  onClose={(_) => setErrorMessage(false)} severity="error"  sx={{ width: '100%' }}>Failed to analyze text from image, sharpen it and then try again!</Alert>
        </Snackbar>
      </div>
      {dataReady && (
        <div>
          {analyzing && (
            <div className="h-40 flex items-center justify-center flex-col">
              <svg
                role="status"
                className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              {analyzing === "image" && (
                <p className="text-xs mt-2">Analyzing image...</p>
              )}
              {analyzing === "spelling" && (
                <p className="text-xs mt-2">Analyzing word spelling...</p>
              )}
            </div>
          )}
          {!analyzing && (
            <div style={{ padding: "10px" }}>
              <TableContainer component={Paper} className="overflow-y-auto max-h-176">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Analyzed word</TableCell>
                      <TableCell>suggestions</TableCell>
                      <TableCell>Use in download</TableCell>
                      <TableCell>final name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.map((line, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {line.initial_word}
                        </TableCell>
                        <TableCell align="right">
                          {line.suggestions.length !== 0 && (
                            <div className="suggestions-stack-box">
                              {line.suggestions.map((x, y) => {
                                var key = x + y;
                                if (
                                  line.best_canditate &&
                                  x === line.best_canditate
                                ) {
                                  return (
                                    <Chip
                                      key={key}
                                      label={x}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) => {
                                        changeFinalWord(
                                          (e as any).target.innerText,
                                          i
                                        ); checkWord((e as any).target.innerText, i)
                                      }}
                                    />
                                  );
                                } else {
                                  return (
                                    <Chip
                                      key={key}
                                      label={x}
                                      size="small"
                                      onClick={(e) => {
                                        changeFinalWord(
                                          (e as any).target.innerText,
                                          i
                                        ); checkWord((e as any).target.innerText, i)
                                      }}
                                    />
                                  );
                                }
                              })}
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Checkbox checked={line.use_for_download}
                            onChange={(e) => changeDownload(e, i)} />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            id="outlined-size-small"
                            value={line.final_word}
                            size="small"
                            onChange={(e) => changeFinalWord(e.target.value, i)}
                            onBlur={(e) => checkWord(e.target.value, i)}
                            helperText={line.helper_text}
                            error={!line.gene_exists}
                            fullWidth
                            style={{ minWidth: 170, }}
                            className={line.gene_exists && line.helper_text === 'Gene is valid' ? "valid-name-input-field" : "none"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="mt-3 flex flex-row justify-end content-end">
                <div className="ml-3 flex flex-row mb-2 items-center">
                  <Checkbox checked={useInvalidGenes}
                    onChange={(e) => setUseInvalidGenes(e.target.checked)} />
                  <p>Include invalid genes in download</p>
                </div>
                <div>
                  <FormControl sx={{ m: 1, minWidth: 140, whiteSpace: "nowrap" }} size="small">
                    <InputLabel id="select-label-file-type">File type</InputLabel>
                    <Select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      labelId="select-label-file-type"
                      label="File type"
                    >
                      <MenuItem value="txt">TXT</MenuItem>
                      <MenuItem value="json">JSON</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="ml-3 flex flex-col-reverse mb-2">
                  <button type="button" onClick={downLoadData} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Download</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )
      }
      {
        !dataReady && (
          <div>
            <div className="flex flex-col items-center">
              <img src={NothingFoundYetImage} className="w-36" />
              <p>Nothing analyzed yet, please start analyzation!</p>
            </div>
          </div>
        )
      }
    </div >
  );
}

export default TextAnalyzeComponent;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
