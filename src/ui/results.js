// Tenyaaa - Results UI Module
// Handles displaying verification results

let resultDiv = null;
let batchProgress = null;
let batchResults = null;

export function initResultsUI(resultDivElement, batchProgressElement, batchResultsElement) {
    resultDiv = resultDivElement;
    batchProgress = batchProgressElement;
    batchResults = batchResultsElement;
}

export function updateProgress(current, total) {
    if (batchProgress) {
        batchProgress.textContent = current + ' / ' + total + ' processed';
    }
}

export function clearResults() {
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
    if (batchResults) {
        batchResults.innerHTML = '';
    }
    if (batchProgress) {
        batchProgress.textContent = '';
    }
}

export function displayBatchSummary(results) {
    if (!resultDiv) return;

    let totalValid = 0;
    let totalInvalid = 0;
    let totalRejected = 0;

    for (const r of results) {
        if (r.status === 'valid') totalValid++;
        else if (r.status === 'invalid') totalInvalid++;
        else totalRejected++;
    }

    let html = '<div style="margin:1rem 0;">';
    html += '<p><strong>Batch Summary:</strong></p>';
    html += '<p><strong>Total:</strong> ' + results.length + '</p>';
    html += '<p><strong>Valid:</strong> <span style="color:#66ff66;font-weight:bold;">' + totalValid + ' ✅</span></p>';
    html += '<p><strong>Invalid:</strong> <span style="color:#ff6666;font-weight:bold;">' + totalInvalid + ' ❌</span></p>';
    html += '<p><strong>Rejected:</strong> <span style="color:#ffaa00;font-weight:bold;">' + totalRejected + ' ⚠️</span></p>';

    if (results.length > 0) {
        html += '<div style="margin:1rem 0;">';
        html += '<button id="download-txt-btn" style="background:#00cc66;color:#000;font-weight:bold;padding:0.5rem 1rem;border-radius:0.5rem;border:none;cursor:pointer;width:auto;font-family:inherit;">Download Report (.txt)</button>';
        html += '</div>';
    }

    html += '<hr style="border-color:#ff6b9d;opacity:0.2;margin:1rem 0;">';

    for (const r of results) {
        const color = r.status === 'valid' ? '#66ff66' :
                     r.status === 'invalid' ? '#ff6666' :
                     r.status === 'rejected' ? '#ffaa00' : '#ff0000';
        const statusText = r.status.toUpperCase();

        html += '<div style="border-left:4px solid ' + color + ';border-radius:0.5rem;padding:0.5rem 0.75rem;margin:0.5rem 0;background:rgba(255,255,255,0.03);">';
        html += '<p><strong>' + r.filename + '</strong> - <span style="color:' + color + ';font-weight:bold;">' + statusText + '</span></p>';

        if (r.label) {
            html += '<p style="font-size:0.85rem;">';
            html += 'Brand: ' + (r.label.brand || 'Not found');
            html += ' | ABV: ' + (r.label.abv || 'Not found');
            html += ' | Warning: ' + (r.label.warning ? 'Found' : 'Not found');
            html += '</p>';
        }

        if (r.errors && r.errors.length > 0) {
            html += '<p style="color:#ff6666;font-size:0.85rem;">Issues: ' + r.errors.join(', ') + '</p>';
        }

        if (r.reason) {
            html += '<p style="color:#ffaa00;font-size:0.85rem;">' + r.reason + '</p>';
        }

        html += '</div>';
    }

    html += '</div>';

    resultDiv.innerHTML = html;

    // Attach download button event
    const downloadBtn = document.getElementById('download-txt-btn');
    if (downloadBtn) {
        downloadBtn.dataset.results = JSON.stringify(results);
    }

    return { totalValid, totalInvalid, totalRejected };
}

export function displaySingleResult(result) {
    if (!resultDiv) return;

    const color = result.status === 'valid' ? '#66ff66' :
                 result.status === 'invalid' ? '#ff6666' :
                 result.status === 'rejected' ? '#ffaa00' : '#ff0000';
    const statusText = result.status.toUpperCase();

    let html = '<div style="border-left:4px solid ' + color + ';border-radius:0.5rem;padding:0.5rem 0.75rem;margin:0.5rem 0;background:rgba(255,255,255,0.03);">';
    html += '<p><strong>' + result.filename + '</strong> - <span style="color:' + color + ';font-weight:bold;">' + statusText + '</span></p>';

    if (result.label) {
        html += '<p style="font-size:0.85rem;">';
        html += 'Brand: ' + (result.label.brand || 'Not found');
        html += ' | ABV: ' + (result.label.abv || 'Not found');
        html += ' | Warning: ' + (result.label.warning ? 'Found' : 'Not found');
        html += '</p>';
    }

    if (result.errors && result.errors.length > 0) {
        html += '<p style="color:#ff6666;font-size:0.85rem;">Issues: ' + result.errors.join(', ') + '</p>';
    }

    if (result.reason) {
        html += '<p style="color:#ffaa00;font-size:0.85rem;">' + result.reason + '</p>';
    }

    html += '</div>';

    resultDiv.innerHTML = html;
}