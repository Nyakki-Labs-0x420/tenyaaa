// Tenyaaa - Application Entry Point
// Imports and initializes all modules

import { CONFIG } from './core/config.js';
import { isBanned, banUser } from './core/ban.js';
import { log } from './core/logger.js';
import { initChatUI, addMessage } from './ui/chat.js';
import { initUploadUI } from './ui/upload.js';
import { initResultsUI, clearResults } from './ui/results.js';
import { initLLM, setStatusCallback } from './ai/webllm.js';
import { getHoliday } from './ui/holiday.js';

// Get DOM elements
const app = document.getElementById('app');
const banNotice = document.getElementById('ban-notice');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const batchProgress = document.getElementById('batch-progress');
const batchResults = document.getElementById('batch-results');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const llmStatusDiv = document.getElementById('llm-status');

// Check if banned
if (isBanned()) {
    if (banNotice) banNotice.style.display = 'block';
    if (app) app.style.opacity = '0.3';
    document.querySelectorAll('button, input').forEach(el => el.disabled = true);
    if (uploadBtn) uploadBtn.disabled = true;
    if (fileInput) fileInput.disabled = true;
    log('User is banned', 'warn');
}

// Initialize UI modules
if (chatLog && chatInput && chatSend) {
    initChatUI(chatLog, chatInput, chatSend);
    log('Chat UI initialized', 'success');
}

if (fileInput && uploadBtn && statusDiv && batchResults) {
    initUploadUI(fileInput, uploadBtn, statusDiv, batchResults);
    log('Upload UI initialized', 'success');
}

if (resultDiv && batchProgress && batchResults) {
    initResultsUI(resultDiv, batchProgress, batchResults);
    log('Results UI initialized', 'success');
}

// Set up LLM status callback
setStatusCallback((progress) => {
    if (!llmStatusDiv) return;
    const pct = Math.round(progress.progress * 100);
    let statusText = 'Loading AI model: ' + pct + '%';
    if (progress.text) {
        statusText += ' - ' + progress.text;
    }
    llmStatusDiv.textContent = statusText;
});

// Load WebLLM after a delay
if (llmStatusDiv) {
    llmStatusDiv.textContent = 'Loading AI model via WebGPU... (first load may take a few minutes)';
    setTimeout(() => {
        initLLM(CONFIG.MODEL_NAME).catch(err => {
            llmStatusDiv.textContent = 'WebGPU AI failed: ' + err.message + '. Using fallback responses.';
            llmStatusDiv.style.color = '#ffb3c6';
            log('WebLLM initialization failed, using fallback', 'warn');
        });
    }, 2000);
}

// Holiday greeting
const holiday = getHoliday();
if (holiday) {
    setTimeout(() => addMessage('Nyaa~ ' + holiday + ' I have been waiting for this day.', true), 500);
} else {
    setTimeout(() => addMessage('Nyaa~ I am Tenyaaa. Upload labels in batches. I am watching.', true), 500);
}

// Preload voices
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

log('Tenyaaa Security Active', 'success');
log('Batch upload: Enabled', 'info');
log('Rate limit: ' + CONFIG.RATE_LIMIT + ' files per minute', 'info');
log('File scanning: Enabled (includes polyglot detection)', 'info');
log('OCR: Enabled', 'info');
log('TXT Export: Enabled', 'info');
log('XSS prevention: Enabled', 'info');
log('IP banning: Enabled', 'info');
log('WebLLM: Loading...', 'info');