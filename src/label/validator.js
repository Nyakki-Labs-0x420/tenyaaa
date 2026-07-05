// Tenyaaa - Label Validation Module

export function validateLabel(label) {
    const errors = [];
    if (!label.brand) errors.push('Brand missing');
    if (!label.abv) errors.push('ABV missing');
    if (!label.warning) errors.push('Warning missing');
    const isValid = errors.length === 0;
    return { isValid, errors };
}