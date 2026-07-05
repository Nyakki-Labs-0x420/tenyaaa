// Tenyaaa - Chat UI Module

import { sanitizeInput } from '../core/security.js';
import { getFallbackResponse } from '../ai/fallback.js';
import { isLLMReady, getLLMResponse } from '../ai/webllm.js';
import { speak } from './speech.js';

let chatLog;
let chatInput;
let chatSend;

export function initChatUI(chatLogElement, chatInputElement, chatSendElement) {
    chatLog = chatLogElement;
    chatInput = chatInputElement;
    chatSend = chatSendElement;

    chatSend.addEventListener('click', handleChat);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleChat();
    });
}

export function addMessage(text, isBot = true) {
    if (!chatLog) return;
    const div = document.createElement('div');
    div.className = 'msg ' + (isBot ? 'bot' : 'user');
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
    if (isBot) speak(text);
}

async function handleChat() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) {
        speak('Say something. I am waiting.');
        return;
    }

    const sanitized = sanitizeInput(text);
    chatInput.value = '';
    addMessage(sanitized, false);

    let response;
    if (isLLMReady()) {
        try {
            const systemPrompt = 'You are Tenyaaa, a catgirl AI assistant. Be enthusiastic, use "nya~" occasionally, be playful but professional. Keep responses under 100 words. You work for the Treasury Department verifying alcohol labels.';
            response = await getLLMResponse(systemPrompt, sanitized);
        } catch (err) {
            console.warn('LLM error, using fallback:', err);
            response = getFallbackResponse(sanitized);
        }
    } else {
        response = getFallbackResponse(sanitized);
    }

    addMessage(response, true);
}