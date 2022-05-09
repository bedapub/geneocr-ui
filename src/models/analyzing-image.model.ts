
import { CroppedImageModel } from './cropped-images.model';
import { SpellCheckItemView } from './word-spelling.model';

export interface AnalysisImageModel {
    image: CroppedImageModel;
    spellResult: SpellCheckItemView[];
}