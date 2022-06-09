import { ImageAnalyzationResponseModel } from "../models/image-analysis.model";
import { SpellCheckItem } from "../models/word-spelling.model";

var url = '';
if (process.env.NODE_ENV !== 'production') {
    url = String(process.env.REACT_APP_SERVICE_URL);
}

export const analyzeImageRequest = (file: File) : Promise<ImageAnalyzationResponseModel> => {
    const formData = new FormData();
    formData.append('file', file)
    const requestOptions = {
        method: 'POST',
        body: formData
    };
    return fetch(`${url}/api/analyze/image?response_format=array`, requestOptions)
        .then(response => response.json())
        .catch(error => console.warn(error));
}

export const checkSpellingRequest = (value: string[], type: string) : Promise<SpellCheckItem[]> => {
    const body = {
        value,
        type
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch(`${url}/api/spelling/suggestions`, requestOptions)
        .then(response => response.json())
        .catch(error => console.warn(error));
}

export const wordValidationRequest = (value: string, type: string) : Promise<any> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`${url}/api/spelling/check?word=${value}&type=${type}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.warn(error));
}

export const sharpenFastImageRequest = (file: File, algorythm: string) : Promise<any> => {
    const formData = new FormData();
    formData.append('file', file)
    const requestOptions = {
        method: 'POST',
        body: formData
    };
    return fetch(`${url}/api/image-helper/sharpen?algorythm=${algorythm}`, requestOptions)
        .then(response => response.blob())
        .catch(error => console.warn(error));
}


export const getGeneOrganismsRequest = () : Promise<any> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`${url}/api/spelling/get-gene-organisms`, requestOptions)
        .then(response => response.json())
        .catch(error => console.warn(error));
}