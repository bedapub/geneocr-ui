import Cropper from 'cropperjs';

export const cropImage = async (image: HTMLImageElement, cropBoxOptions: any, cropImage: Blob): Promise<any> => {
    return new Promise((resolve, reject) => {
        image.onload = () => {
            const cropper = new Cropper(image, {
                crop(event) {
                    console.log(event.detail.x);
                    console.log(event.detail.y);
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                    console.log(event.detail.rotate);
                    console.log(event.detail.scaleX);
                    console.log(event.detail.scaleY);
                },
            });
            cropper.setCropBoxData(cropBoxOptions);
            resolve("worked");
        };
        image.onerror = reject;
        image.src = URL.createObjectURL(cropImage);;
    });
    
    
    return true;
}

export const waitForImageReady = async (cropImage: Blob, image: HTMLImageElement): Promise<any> => {
    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = URL.createObjectURL(cropImage);;
    });
}