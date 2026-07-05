// Tenyaaa - Security Module
// File extension blocking, polyglot detection, input sanitization

import { CONFIG } from './config.js';

export function detectMaliciousFile(filename) {
    const lower = filename.toLowerCase();

    // Check single extensions
    for (const ext of CONFIG.BAD_EXTENSIONS) {
        if (lower.endsWith(ext)) {
            return 'blocked_extension';
        }
    }

    // Check polyglot patterns
    for (const pattern of CONFIG.POLYGLOT_PATTERNS) {
        if (pattern.test(lower)) {
            return 'polyglot_detected';
        }
    }

    return null;
}

export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    let sanitized = input;
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    sanitized = sanitized.replace(/data:/gi, '');

    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    sanitized = sanitized.replace(/[&<>"'\/]/g, m => entities[m] || m);

    return sanitized;
}

export function validateFileType(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const isValidExtension = CONFIG.ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = CONFIG.ALLOWED_MIME_TYPES.includes(file.type);
    return isValidExtension || isValidMime;
}

export function validateFileSize(file) {
    return file.size <= CONFIG.MAX_FILE_SIZE;
}