import { ImageAnalyzationResponseModel } from "../models/image-analysis.model";
import { SpellCheckItem } from "../models/word-spelling.model";

export const analyzeImageRequest = (file: File) : Promise<ImageAnalyzationResponseModel> => {
    const formData = new FormData();
    formData.append('file', file)
    const requestOptions = {
        method: 'POST',
        body: formData
    };
    return fetch(`${process.env.REACT_APP_SERVICE_URL}/v1/analyze/image?format=array`, requestOptions)
        .then(response => response.json())
        .catch(error => console.warn(error));
}

export const checkSpellingRequest = (value: string[]) : Promise<SpellCheckItem[]> => {
    const body = {
        value
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    return fetch(`${process.env.REACT_APP_SERVICE_URL}/v1/spelling/suggestions`, requestOptions)
        .then(response => response.json())
        .catch(error => console.warn(error));
}

export const wordValidationRequest = (value: string) : Promise<any> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch(`${process.env.REACT_APP_SERVICE_URL}/v1/spelling/check?word=${value}&type=gene`, requestOptions)
        .then(response => response.json())
        .catch(error => console.warn(error));
}