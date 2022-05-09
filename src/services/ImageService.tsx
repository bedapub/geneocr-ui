import { BehaviorSubject } from 'rxjs';
import { CroppedImageModel } from './../models/cropped-images.model';

const CreateImageService = () => {

    const editingImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    const rawImage: BehaviorSubject<string> = new BehaviorSubject('');

    const croppedImages: BehaviorSubject<CroppedImageModel[]> = new BehaviorSubject<CroppedImageModel[]>([]);

    const areaSetting: BehaviorSubject<'editing' | 'analyzing'> = new BehaviorSubject<'editing' | 'analyzing'>('editing');

    const setRawImage = (image: string) => {
        rawImage.next(image);
    }

    const setCroppedImages = (croppedImage: CroppedImageModel[]) => {
        croppedImages.next(croppedImage);
    }

    const setEditingImage = (bool: boolean) => {
        editingImage.next(bool);
    }

    const setAreaSetting = (view: 'editing' | 'analyzing') => {
        areaSetting.next(view);
    }

    const getEditingImage = editingImage.asObservable();

    const getRawImage = rawImage.asObservable();

    const getCroppedImages = croppedImages.asObservable();

    const getAreaSetting = areaSetting.asObservable();

    return {
        setRawImage,
        getRawImage,
        setEditingImage,
        setCroppedImages,
        getCroppedImages,
        getEditingImage,
        setAreaSetting,
        getAreaSetting
    }
}

export default CreateImageService


