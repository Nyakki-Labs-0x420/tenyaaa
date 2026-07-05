// Tenyaaa - Speech Module (TTS)

import { sanitizeInput } from '../core/security.js';

export function speak(text) {
    if (!window.speechSynthesis) return;
    const clean = sanitizeInput(text);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.pitch = 1.5;
    utterance.rate = 1.15;
    const voices = speechSynthesis.getVoices();
    const female = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google UK') || v.name.includes('Alex') || v.name.includes('Victoria'));
    if (female) utterance.voice = female;
    speechSynthesis.speak(utterance);
}