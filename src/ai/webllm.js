// Tenyaaa - WebLLM Module

let llmEngine = null;
let isReady = false;
let isLoading = false;
let statusCallback = null;

export function setStatusCallback(callback) {
    statusCallback = callback;
}

export function isLLMReady() {
    return isReady;
}

export function isLoadingLLM() {
    return isLoading;
}

export async function initLLM(modelName) {
    if (isLoading) return;
    if (isReady) return;
    isLoading = true;

    try {
        const module = await import('https://esm.run/@mlc-ai/web-llm');
        const CreateMLCEngine = module.CreateMLCEngine;

        llmEngine = await CreateMLCEngine(modelName, {
            initProgressCallback: (progress) => {
                if (statusCallback) {
                    statusCallback(progress);
                }
            }
        });
        isReady = true;
        isLoading = false;
    } catch (err) {
        isLoading = false;
        throw new Error(`WebLLM initialization failed: ${err.message}`);
    }
}

export async function getLLMResponse(systemPrompt, userMessage) {
    if (!isReady || !llmEngine) {
        throw new Error('LLM not ready');
    }
    try {
        const response = await llmEngine.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 150,
            stop: ['User:', 'Tenyaaa:']
        });
        return response.choices[0].message.content.trim();
    } catch (err) {
        throw new Error(`LLM response failed: ${err.message}`);
    }
}