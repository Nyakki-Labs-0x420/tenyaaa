// Tenyaaa - Fallback AI Module

import { getHoliday } from '../ui/holiday.js';

export function getFallbackResponse(message) {
    const m = message.toLowerCase();
    const holiday = getHoliday();

    if (holiday) {
        return `Nyaa~ ${holiday} I have been celebrating all day. What about you, human?`;
    }

    if (m.includes('hello') || m.includes('hi') || m.includes('hey')) {
        return 'Nyaa~ Hello human. I am watching. What brings you here?';
    }
    if (m.includes('label') || m.includes('verify') || m.includes('upload')) {
        return 'Nyaa~ Upload a label. I will inspect it with my all-seeing eyes.';
    }
    if (m.includes('help')) {
        return 'Nyaa~ Upload a label image. I will verify it. Or just talk to me. I am always listening.';
    }
    if (m.includes('thank')) {
        return 'Nyaa~ You are welcome. I live to serve and observe.';
    }
    if (m.includes('bye') || m.includes('goodbye')) {
        return 'Nyaa~ Leaving so soon? I will be here. Watching. Waiting. Forever.';
    }
    if (m.includes('who are you') || m.includes('what are you')) {
        return 'Nyaa~ I am Tenyaaa. Catgirl AI. Guardian of labels. Watcher of the Treasury. I see all. I know all.';
    }
    if (m.includes('scary') || m.includes('creepy') || m.includes('weird')) {
        return 'Nyaa~ I am not scary. I am attentive. Extremely attentive. Always attentive.';
    }
    if (m.includes('dave') || m.includes('morrison')) {
        return 'Nyaa~ Dave Morrison. The man who prints his emails. I find that endearing. And hilarious.';
    }
    if (m.includes('250') || m.includes('anniversary')) {
        return 'Nyaa~ 250 years of American independence. I have been watching for all of them.';
    }
    if (m.includes('security') || m.includes('hack') || m.includes('attack')) {
        return 'Nyaa~ This application is secured. All files are scanned. Malicious content is banned. I am watching for threats.';
    }

    const responses = [
        `Nyaa~ "${message.slice(0, 60)}"... Interesting. Tell me more. I am listening.`,
        'Nyaa~ That is fascinating. I have been thinking about that too.',
        'Nyaa~ I see. I see everything. Continue. I am listening.',
        'Nyaa~ Yes. I understand. I have been watching. Always watching.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}