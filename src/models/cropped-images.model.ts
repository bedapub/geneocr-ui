
export interface CroppedImageModel {
    blob: Blob;
    title: string;
    type: string;
    dataUrl: string;
    status: 'cropped' | 'analyzing' | 'wordspelling' | 'analyzed';
}