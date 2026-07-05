// Tenyaaa - Logger Module

export function log(message, level = 'info') {
    const prefix = {
        info: 'i',
        warn: '[AYO]',
        error: '[X]',
        debug: '[=]',
        success: '[+]'
    }[level] || '=';
    console.log(`${prefix} [${new Date().toISOString()}] ${message}`);
}

export function logSecurity(message) {
    log(`[LOGGER] ${message}`, 'warn');
}