// Tenyaaa - OCR Module

let tessWorker = null;

export async function initOCR() {
    if (tessWorker) return tessWorker;
    try {
        tessWorker = await Tesseract.createWorker('eng');
        return tessWorker;
    } catch (err) {
        throw new Error(`OCR initialization failed: ${err.message}`);
    }
}

export async function extractText(file) {
    if (!tessWorker) await initOCR();
    try {
        const result = await tessWorker.recognize(file);
        return result.data.text;
    } catch (err) {
        throw new Error(`OCR extraction failed: ${err.message}`);
    }
}

export function getOCRStatus() {
    return tessWorker !== null;
}