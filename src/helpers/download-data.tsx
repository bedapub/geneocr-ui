import { SpellCheckItemView } from "../models/word-spelling.model";

export const downloadDataAsTxt = (data: SpellCheckItemView[]): void => {
    let downloadString: string = '';
    data.forEach(x => {
        downloadString += `${x.final_word}\n`
    })
    const element = document.createElement("a");
    const file = new Blob([downloadString], {
        type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "download.txt";
    document.body.appendChild(element);
    element.click();
}

export const downloadDataAsJson = (data: SpellCheckItemView[]): void => {
    const toBeDownloadedData = data.map(x => {
        return { gene_name: x.final_word };
    })
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(toBeDownloadedData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
}
