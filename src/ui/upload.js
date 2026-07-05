// Tenyaaa - Upload UI Module

import { checkRateLimit } from '../core/ratelimit.js';
import { detectMaliciousFile, validateFileType, validateFileSize } from '../core/security.js';
import { initOCR, extractText } from '../ocr/tesseract.js';
import { extractLabelData } from '../label/extractor.js';
import { validateLabel } from '../label/validator.js';
import { generateTXTReport, downloadTXT } from '../export/txt.js';
import { addMessage } from './chat.js';
import { speak } from './speech.js';
import { getHoliday } from './holiday.js';
import { updateProgress, displayBatchSummary, clearResults } from './results.js';

let fileInput = null;
let uploadBtn = null;
let statusDiv = null;
let batchResults = null;

export function initUploadUI(
    fileInputElement,
    uploadBtnElement,
    statusDivElement,
    batchResultsElement
) {
    fileInput = fileInputElement;
    uploadBtn = uploadBtnElement;
    statusDiv = statusDivElement;
    batchResults = batchResultsElement;

    if (uploadBtn) {
        uploadBtn.addEventListener('click', verifyFiles);
    }

    if (fileInput) {
        fileInput.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            speak('Right-click is disabled for security.');
            addMessage('Right-click disabled for security.', true);
        });
    }
}

async function processSingleFile(file) {
    const filename = file.name;

    // Security checks
    const fileScan = detectMaliciousFile(filename);
    if (fileScan) {
        return { filename, status: 'rejected', reason: 'Security violation: ' + fileScan };
    }

    if (!validateFileType(file)) {
        return { filename, status: 'rejected', reason: 'File type not allowed. Only images.' };
    }

    if (!validateFileSize(file)) {
        return { filename, status: 'rejected', reason: 'File too large. Maximum 10MB.' };
    }

    try {
        const text = await extractText(file);

        if (!text || text.length < 5) {
            return { filename, status: 'rejected', reason: 'No text found in image. Try a clearer photo.' };
        }

        const label = extractLabelData(text);
        const validation = validateLabel(label);
        const status = validation.isValid ? 'valid' : 'invalid';

        return {
            filename,
            status,
            label,
            errors: validation.errors,
            isValid: validation.isValid
        };

    } catch (err) {
        return { filename, status: 'error', reason: err.message };
    }
}

async function verifyFiles() {
    if (!fileInput) return;

    const files = fileInput.files;
    if (!files || files.length === 0) {
        speak('No files selected.');
        if (statusDiv) statusDiv.textContent = 'No files selected';
        return;
    }

    if (!checkRateLimit()) {
        if (statusDiv) statusDiv.textContent = 'Rate limit exceeded. Please wait.';
        speak('Rate limit exceeded. Please wait.');
        return;
    }

    try {
        await initOCR();
    } catch (err) {
        if (statusDiv) statusDiv.textContent = 'OCR initialization failed: ' + err.message;
        speak('OCR initialization failed.');
        return;
    }

    if (uploadBtn) uploadBtn.disabled = true;
    if (statusDiv) statusDiv.textContent = 'Processing ' + files.length + ' files...';
    speak('Processing ' + files.length + ' labels. This may take a moment.');

    const results = [];
    let totalValid = 0;
    let totalInvalid = 0;
    let totalRejected = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (statusDiv) {
            statusDiv.textContent = 'Processing ' + (i + 1) + ' of ' + files.length + ': ' + file.name;
        }

        updateProgress(i + 1, files.length);

        const result = await processSingleFile(file);
        results.push(result);

        if (result.status === 'valid') totalValid++;
        else if (result.status === 'invalid') totalInvalid++;
        else totalRejected++;
    }

    // Clear any existing results
    clearResults();

    // Display the batch summary
    const summary = displayBatchSummary(results);

    if (statusDiv) {
        statusDiv.textContent = 'Batch complete. ' + totalValid + ' valid, ' + totalInvalid + ' invalid, ' + totalRejected + ' rejected.';
    }

    // Attach download button event
    const downloadBtn = document.getElementById('download-txt-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const report = generateTXTReport(results);
            if (report) {
                downloadTXT(report.content, report.filename);
                speak('Report downloaded.');
            }
        });
    }

    const holiday = getHoliday();
    let summaryMsg = 'Batch complete. ' + totalValid + ' valid labels. ' + totalInvalid + ' invalid. ' + totalRejected + ' rejected.';
    if (holiday) summaryMsg = 'Nyaa~ ' + holiday + ' ' + summaryMsg;
    speak(summaryMsg);
    addMessage(summaryMsg, true);

    if (uploadBtn) uploadBtn.disabled = false;
}