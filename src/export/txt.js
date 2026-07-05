// Tenyaaa - TXT Export Module

export function generateTXTReport(results) {
    if (!results || results.length === 0) {
        return null;
    }

    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-');
    const lines = [];

    // Header
    lines.push('========================================');
    lines.push('TENYAAA - LABEL VERIFICATION REPORT');
    lines.push('========================================');
    lines.push('Generated: ' + date.toLocaleString());
    lines.push('Total Labels: ' + results.length);
    lines.push('');

    // Summary
    let valid = 0, invalid = 0, rejected = 0;
    for (const r of results) {
        if (r.status === 'valid') valid++;
        else if (r.status === 'invalid') invalid++;
        else rejected++;
    }

    lines.push('Summary:');
    lines.push('  Valid:   ' + valid);
    lines.push('  Invalid: ' + invalid);
    lines.push('  Rejected:' + rejected);
    lines.push('');
    lines.push('========================================');
    lines.push('');

    // Each result
    for (let j = 0; j < results.length; j++) {
        const r = results[j];
        lines.push('[' + (j + 1) + '] ' + r.filename);
        lines.push('Status: ' + r.status.toUpperCase());

        if (r.label) {
            lines.push('Brand:  ' + (r.label.brand || 'NOT FOUND'));
            lines.push('ABV:    ' + (r.label.abv || 'NOT FOUND'));
            lines.push('Volume: ' + (r.label.volume || 'NOT FOUND'));
            lines.push('Warning: ' + (r.label.warning ? 'FOUND' : 'NOT FOUND'));
        }

        if (r.errors && r.errors.length > 0) {
            lines.push('Issues: ' + r.errors.join(', '));
        }

        if (r.reason) {
            lines.push('Reason: ' + r.reason);
        }

        lines.push('');
    }

    lines.push('========================================');
    lines.push('End of Report');
    lines.push('========================================');

    return {
        content: lines.join('\n'),
        filename: 'tenyaaa_report_' + timestamp + '.txt'
    };
}

export function downloadTXT(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}