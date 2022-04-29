import { BehaviorSubject } from 'rxjs';

const CreateImageService = () => {

    const editingImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    const rawImage: BehaviorSubject<string> = new BehaviorSubject('');

    const croppedImage: BehaviorSubject<Blob> = new BehaviorSubject<Blob>(new Blob());

    const setRawImage = (image: string) => {
        rawImage.next(image);
    }

    const setCroppedImage = (image: Blob) => {
        croppedImage.next(image);
    }

    const setEditingImage = (bool: boolean) => {
        editingImage.next(bool);
    }

    const getEditingImage = editingImage.asObservable();

    const getRawImage = rawImage.asObservable();

    const getCroppedImage = croppedImage.asObservable();

    return {
        setRawImage,
        getRawImage,
        setEditingImage,
        setCroppedImage,
        getCroppedImage,
        getEditingImage,
    }
}

export default CreateImageService


