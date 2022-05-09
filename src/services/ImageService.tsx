import { BehaviorSubject } from 'rxjs';
import { CroppedImageModel } from './../models/cropped-images.model';

const CreateImageService = () => {

    const editingImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    const rawImage: BehaviorSubject<string> = new BehaviorSubject('');

    const croppedImages: BehaviorSubject<CroppedImageModel[]> = new BehaviorSubject<CroppedImageModel[]>([]);

    const viewFocus: BehaviorSubject<string> = new BehaviorSubject<string>('normal');

    const setRawImage = (image: string) => {
        rawImage.next(image);
    }

    const setCroppedImages = (croppedImage: CroppedImageModel[]) => {
        croppedImages.next(croppedImage);
    }

    const setEditingImage = (bool: boolean) => {
        editingImage.next(bool);
    }

    const setViewFocus = (view: string) => {
        viewFocus.next(view);
    }

    const getEditingImage = editingImage.asObservable();

    const getRawImage = rawImage.asObservable();

    const getCroppedImages = croppedImages.asObservable();

    const getViewFocus = viewFocus.asObservable();

    return {
        setRawImage,
        getRawImage,
        setEditingImage,
        setCroppedImages,
        getCroppedImages,
        getEditingImage,
        setViewFocus,
        getViewFocus
    }
}

export default CreateImageService


