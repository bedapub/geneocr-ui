
export interface CroppedImageModel {
    blob: Blob;
    title: string;
    type: string;
    geneType: string;
    dataUrl: string;
    status: 'cropped' | 'analyzing' | 'wordspelling' | 'analyzed';
    cropBoxData: {
        left: number;
        top: number;
        width: number;
        height: number;
        imageHeight: number;
        imageWidth: number;
    };
}