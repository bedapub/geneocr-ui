
export const analyzeImageRequest = (file: File) => {
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

export const checkSpellingRequest = (value: string[]) => {
    console.log(value)
    const body = {
        value: value
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