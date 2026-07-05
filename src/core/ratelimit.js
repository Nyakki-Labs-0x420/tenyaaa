// Tenyaaa - Rate Limiting Module

import { CONFIG } from './config.js';

let uploadTimestamps = [];

export function checkRateLimit() {
    const now = Date.now();
    uploadTimestamps = uploadTimestamps.filter(ts => now - ts < CONFIG.RATE_LIMIT_WINDOW);
    if (uploadTimestamps.length >= CONFIG.RATE_LIMIT) {
        return false;
    }
    uploadTimestamps.push(now);
    return true;
}

export function resetRateLimit() {
    uploadTimestamps = [];
}