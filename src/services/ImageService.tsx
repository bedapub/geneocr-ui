import { BehaviorSubject } from 'rxjs';

const CreateImageService = () => {

    const editingImage: BehaviorSubject<any> = new BehaviorSubject(true);

    const rawImage: BehaviorSubject<any> = new BehaviorSubject(null);

    const croppedImage: BehaviorSubject<any> = new BehaviorSubject(null);

    const setRawImage = (image: any) => {
        rawImage.next(image);
    }

    const setCroppedImage = (image: any) => {
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


