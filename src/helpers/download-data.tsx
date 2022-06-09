import { SpellCheckItemView } from "../models/word-spelling.model";
import { AnalysisImageModel } from './../models/analyzing-image.model';

export const downloadDataAsTxt = (data: AnalysisImageModel[], invalidGenes: boolean): void => {
    let downloadString: string = '';
    data.forEach(image => {
        if (image.spellResult.length > 0) {
            downloadString += `\n\n---${image.image.type}---\n\n`;
        }
        image.spellResult.forEach(x => {
            if (invalidGenes && x.use_for_download){
                downloadString += `${x.final_word}\n`;
            } else if (x.gene_exists && x.use_for_download) {
                downloadString += `${x.final_word}\n`;
            }
        });
    });
    const element = document.createElement("a");
    const file = new Blob([downloadString], {
        type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "download.txt";
    document.body.appendChild(element);
    element.click();
}

export const downloadDataAsJson = (data: AnalysisImageModel[], invalidGenes: boolean): void => {
    const toBeDownloadedData: any = {}

    data.forEach(image => {
        image.spellResult = image.spellResult.filter(x => (invalidGenes && x.use_for_download) || (x.gene_exists && x.use_for_download));
        if (image.spellResult.length > 0) {
            let imageSpellingData = image.spellResult.map(x => {
                return { gene_name: x.final_word };
            });
            if (image.image.type in toBeDownloadedData) {
                toBeDownloadedData[image.image.type] = imageSpellingData.concat(toBeDownloadedData[image.image.type]);
            } else {
                toBeDownloadedData[image.image.type] = imageSpellingData;
            }
        }

    });

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(toBeDownloadedData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
}
