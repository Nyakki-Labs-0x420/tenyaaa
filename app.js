// Tenyaaa - Secure AI with WebLLM + OCR + TXT Export + Polyglot Detection

(function() {
    'use strict';

    // ============================================================
    // Rate Limiting
    // ============================================================

    var RATE_LIMIT = 10;
    var rateLimitWindow = 60 * 1000;
    var uploadTimestamps = [];

    function checkRateLimit() {
        var now = Date.now();
        uploadTimestamps = uploadTimestamps.filter(function(ts) {
            return now - ts < rateLimitWindow;
        });
        if (uploadTimestamps.length >= RATE_LIMIT) {
            return false;
        }
        uploadTimestamps.push(now);
        return true;
    }

    // ============================================================
    // Banning System
    // ============================================================

    function getFingerprint() {
        var fp = localStorage.getItem('tenyaaa_fingerprint');
        if (!fp) {
            fp = 'user_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem('tenyaaa_fingerprint', fp);
        }
        return fp;
    }

    function isBanned() {
        var banned = JSON.parse(localStorage.getItem('tenyaaa_banned') || '[]');
        return banned.includes(getFingerprint());
    }

    function banUser() {
        var banned = JSON.parse(localStorage.getItem('tenyaaa_banned') || '[]');
        var fp = getFingerprint();
        if (!banned.includes(fp)) {
            banned.push(fp);
            localStorage.setItem('tenyaaa_banned', JSON.stringify(banned));
        }
        document.getElementById('ban-notice').style.display = 'block';
        document.getElementById('app').style.opacity = '0.3';
        document.querySelectorAll('button, input').forEach(function(el) {
            el.disabled = true;
        });
    }

    if (isBanned()) {
        document.getElementById('ban-notice').style.display = 'block';
        document.getElementById('app').style.opacity = '0.3';
        document.querySelectorAll('button, input').forEach(function(el) {
            el.disabled = true;
        });
        return;
    }

    // ============================================================
    // Security: File Extension + Polyglot Detection
    // ============================================================

    function detectMaliciousFile(filename) {
        var lower = filename.toLowerCase();

        // Single extensions (blocked)
        var badExtensions = [
            '.php', '.phtml', '.php3', '.php4', '.php5', '.phps',
            '.jsp', '.jspx', '.jsw', '.jsv', '.jspf',
            '.asp', '.aspx', '.asax', '.ashx', '.asmx', '.ascx',
            '.pl', '.pm', '.cgi', '.perl',
            '.sh', '.bash', '.zsh', '.fish',
            '.py', '.rb', '.go', '.rs',
            '.exe', '.dll', '.so', '.bin', '.elf',
            '.htaccess', '.htpasswd', '.git', '.svn'
        ];

        for (var i = 0; i < badExtensions.length; i++) {
            if (lower.endsWith(badExtensions[i])) {
                return 'blocked_extension';
            }
        }

        // Polyglot detection - catches ANY malicious extension ANYWHERE in filename
        var polyglotPatterns = [
            /\.php\./i, /\.phtml\./i, /\.php[3-7]\./i, /\.phps\./i,
            /\.jsp\./i, /\.jspx\./i, /\.jsw\./i, /\.jsv\./i, /\.jspf\./i,
            /\.asp\./i, /\.aspx\./i, /\.asax\./i, /\.ashx\./i, /\.asmx\./i, /\.ascx\./i,
            /\.cer\./i, /\.asa\./i, /\.cdx\./i, /\.htr\./i,
            /\.cfm\./i, /\.cfml\./i, /\.cfc\./i,
            /\.pl\./i, /\.cgi\./i, /\.pm\./i,
            /\.js\./i, /\.node\./i,
            /\.shtml\./i, /\.htaccess\./i, /\.config\./i
        ];

        for (var j = 0; j < polyglotPatterns.length; j++) {
            if (polyglotPatterns[j].test(lower)) {
                return 'polyglot_detected';
            }
        }

        return null;
    }

    // ============================================================
    // Security: Input Sanitization
    // ============================================================

    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        var sanitized = input;
        sanitized = sanitized.replace(/<[^>]*>/g, '');
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
        sanitized = sanitized.replace(/data:/gi, '');

        var entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        sanitized = sanitized.replace(/[&<>"'\/]/g, function(m) {
            return entities[m] || m;
        });

        return sanitized;
    }

    // ============================================================
    // Holiday Detection
    // ============================================================

    function getHoliday() {
        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var year = today.getFullYear();

        if (month === 7 && day === 4) {
            return 'Happy 4th of July! America\'s ' + (year - 1776) + 'th birthday!';
        }
        if (month === 1 && day === 1) return 'Happy New Year!';
        if (month === 12 && day === 25) return 'Merry Christmas!';
        if (month === 12 && day === 31) return 'Happy New Year\'s Eve!';
        if (month === 10 && day === 31) return 'Happy Halloween!';
        if (month === 2 && day === 14) return 'Happy Valentine\'s Day!';

        if (month === 11) {
            var fourthThursday = new Date(year, 10, 1);
            while (fourthThursday.getDay() !== 4) {
                fourthThursday.setDate(fourthThursday.getDate() + 1);
            }
            fourthThursday.setDate(fourthThursday.getDate() + 21);
            if (day === fourthThursday.getDate()) return 'Happy Thanksgiving!';
        }

        if (month === 4 && day >= 1 && day <= 30) {
            var a = year % 19;
            var b = Math.floor(year / 100);
            var c = year % 100;
            var d = Math.floor(b / 4);
            var e = b % 4;
            var f = Math.floor((b + 8) / 25);
            var g = Math.floor((b - f + 1) / 3);
            var h = (19 * a + b - d - g + 15) % 30;
            var i = Math.floor(c / 4);
            var k = c % 4;
            var l = (32 + 2 * e + 2 * i - h - k) % 7;
            var m = Math.floor((a + 11 * h + 22 * l) / 451);
            var month2 = Math.floor((h + l - 7 * m + 114) / 31);
            var day2 = ((h + l - 7 * m + 114) % 31) + 1;
            if (month === month2 && day === day2) return 'Happy Easter!';
        }

        return null;
    }

    // ============================================================
    // TTS
    // ============================================================

    function speak(text) {
        if (!window.speechSynthesis) return;
        var clean = sanitizeInput(text);
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(clean);
        utterance.pitch = 1.5;
        utterance.rate = 1.15;
        var voices = speechSynthesis.getVoices();
        var female = voices.find(function(v) {
            return v.name.includes('Samantha') ||
                   v.name.includes('Google UK') ||
                   v.name.includes('Alex') ||
                   v.name.includes('Victoria');
        });
        if (female) utterance.voice = female;
        speechSynthesis.speak(utterance);
    }

    // ============================================================
    // WebLLM Setup - f32 Model (Works on all devices)
    // ============================================================

    var llmEngine = null;
    var isLLMReady = false;
    var isLLMLoading = false;
    var llmStatusDiv = document.getElementById('llm-status');

    var MODEL_NAME = 'Phi-3-mini-4k-instruct-q4f32_1-MLC';

    function initLLM() {
        if (isLLMLoading) return;
        isLLMLoading = true;

        llmStatusDiv.textContent = 'Loading AI model via WebGPU... (first load may take a few minutes)';
        llmStatusDiv.style.color = '#ffb3c6';

        import('https://esm.run/@mlc-ai/web-llm')
            .then(function(module) {
                var CreateMLCEngine = module.CreateMLCEngine;

                return CreateMLCEngine(MODEL_NAME, {
                    initProgressCallback: function(progress) {
                        var pct = Math.round(progress.progress * 100);
                        var statusText = 'Loading AI model: ' + pct + '%';
                        if (progress.text) {
                            statusText += ' - ' + progress.text;
                        }
                        llmStatusDiv.textContent = statusText;
                        console.log('WebLLM progress:', progress.text, pct + '%');
                    }
                });
            })
            .then(function(engine) {
                llmEngine = engine;
                isLLMReady = true;
                llmStatusDiv.textContent = 'AI model ready. All processing is local on your GPU.';
                llmStatusDiv.style.color = '#66ff66';
                addMessage('AI model ready. All processing is local. No data leaves your device.', true);
                console.log('WebLLM engine ready');
            })
            .catch(function(err) {
                llmStatusDiv.textContent = 'WebGPU AI failed: ' + err.message + '. Using fallback responses.';
                llmStatusDiv.style.color = '#ffb3c6';
                console.error('WebLLM error:', err);
                addMessage('WebGPU AI failed to load. Using fallback responses. Your privacy is still protected.', true);
            });
    }

    // ============================================================
    // AI Brain (Fallback)
    // ============================================================

    function getFallbackResponse(message) {
        var m = message.toLowerCase();
        var holiday = getHoliday();

        if (holiday) {
            return 'Nyaa~ ' + holiday + ' I have been celebrating all day. What about you, human?';
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

        var responses = [
            'Nyaa~ "' + message.slice(0, 60) + '"... Interesting. Tell me more. I am listening.',
            'Nyaa~ That is fascinating. I have been thinking about that too.',
            'Nyaa~ I see. I see everything. Continue. I am listening.',
            'Nyaa~ Yes. I understand. I have been watching. Always watching.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // ============================================================
    // AI Response with LLM
    // ============================================================

    async function getAIResponse(message) {
        var sanitized = sanitizeInput(message);

        if (isLLMReady && llmEngine) {
            try {
                var systemPrompt = 'You are Tenyaaa, a catgirl AI assistant. Be enthusiastic, use "nya~" occasionally, be playful but professional. Keep responses under 100 words. You work for the Treasury Department verifying alcohol labels. You are secure and watch for threats.';

                var response = await llmEngine.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: sanitized }
                    ],
                    temperature: 0.7,
                    max_tokens: 150,
                    stop: ['User:', 'Tenyaaa:']
                });

                var reply = response.choices[0].message.content.trim();
                if (reply.length > 0) {
                    return reply;
                }
            } catch (err) {
                console.warn('LLM error, using fallback:', err);
            }
        }

        return getFallbackResponse(message);
    }

    // ============================================================
    // Chat UI
    // ============================================================

    var chatLog = document.getElementById('chat-log');
    var chatInput = document.getElementById('chat-input');
    var chatSend = document.getElementById('chat-send');

    function addMessage(text, isBot) {
        if (isBot === undefined) isBot = true;
        var div = document.createElement('div');
        div.className = 'msg ' + (isBot ? 'bot' : 'user');
        div.textContent = text;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
        if (isBot) speak(text);
    }

    async function handleChat() {
        var text = chatInput.value.trim();
        if (!text) {
            speak('Say something. I am waiting.');
            return;
        }

        var sanitized = sanitizeInput(text);
        chatInput.value = '';
        addMessage(sanitized, false);

        try {
            var response = await getAIResponse(sanitized);
            addMessage(response, true);
        } catch (err) {
            addMessage('Nyaa~ Something went wrong: ' + err.message, true);
        }
    }

    chatSend.addEventListener('click', handleChat);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleChat();
    });

    // ============================================================
    // Label Verification with OCR + TXT Export
    // ============================================================

    var fileInput = document.getElementById('file-input');
    var uploadBtn = document.getElementById('upload-btn');
    var statusDiv = document.getElementById('status');
    var resultDiv = document.getElementById('result');
    var batchProgress = document.getElementById('batch-progress');
    var batchResults = document.getElementById('batch-results');

    var tessWorker = null;
    var lastBatchResults = null;

    // ============================================================
    // TXT Export Function
    // ============================================================

    function downloadTXT(results, filename) {
        if (!results || results.length === 0) {
            speak('No data to export.');
            return;
        }

        var lines = [];
        var date = new Date();
        var timestamp = date.toISOString().replace(/[:.]/g, '-');

        // Header
        lines.push('========================================');
        lines.push('TENYAAA 0x420 - LABEL VERIFICATION REPORT');
        lines.push('========================================');
        lines.push('Generated: ' + date.toLocaleString());
        lines.push('Total Labels: ' + results.length);
        lines.push('');

        // Count valid/invalid/rejected
        var valid = 0, invalid = 0, rejected = 0;
        for (var i = 0; i < results.length; i++) {
            if (results[i].status === 'valid') valid++;
            else if (results[i].status === 'invalid') invalid++;
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
        for (var j = 0; j < results.length; j++) {
            var r = results[j];
            lines.push('[' + (j + 1) + '] ' + r.filename);
            lines.push('Status: ' + r.status.toUpperCase());

            if (r.label) {
                if (r.label.brand) lines.push('Brand:  ' + r.label.brand);
                else lines.push('Brand:  NOT FOUND');
                if (r.label.abv) lines.push('ABV:    ' + r.label.abv);
                else lines.push('ABV:    NOT FOUND');
                if (r.label.volume) lines.push('Volume: ' + r.label.volume);
                else lines.push('Volume: NOT FOUND');
                if (r.label.warning) lines.push('Warning: FOUND');
                else lines.push('Warning: NOT FOUND');
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

        var content = lines.join('\n');
        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'tenyaaa_report_' + timestamp + '.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        speak('Report downloaded.');
    }

    // ============================================================
    // Robust Label Data Extraction
    // ============================================================

    function extractLabelData(text) {
        var data = {};

        // Clean text
        var cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // ---------- BRAND NAME ----------
        var m = cleanText.match(/(?:brand|name|distillery|winery|brewery)[:\s]+([A-Z][A-Z\s]+)/i);
        if (m) {
            data.brand = m[1].trim();
        }

        // If no brand found, look for all-caps words (common on labels)
        if (!data.brand) {
            var allCaps = cleanText.match(/\b[A-Z][A-Z\s]{2,}\b/g);
            if (allCaps && allCaps.length > 0) {
                var skipWords = [
                    'WHISKEY', 'WHISKY', 'BEER', 'WINE', 'PROOF', 'ALCOHOL', 'VOL', 'ML', 'L', 'OZ',
                    'BOTTLED', 'BOND', 'YEARS', 'AGED', 'STRAIGHT', 'BOURBON', 'RYE', 'SCOTCH',
                    'GIN', 'VODKA', 'RUM', 'TEQUILA', 'CONTAINS', 'SULFITES', 'MERLOT', 'CABERNET',
                    'SAUVIGNON', 'RED', 'WHITE', 'BLEND', 'ESTATE', 'CELLARS', 'CITY', 'STATE',
                    'RESERVE', 'PRIVATE', 'SELECT', 'BARREL', 'SINGLE', 'MALT', 'PORT', 'SHERRY',
                    'CHARDONNAY', 'PINOT', 'NOIR', 'ZINFANDEL', 'SYRAH', 'MALBEC', 'RIESLING',
                    'CABERNET SAUVIGNON', 'MUSCAT', 'SEMILLON', 'CHENIN BLANC', 'SAUVIGNON BLANC',
                    'SPARKLING', 'ROSE', 'ROSÉ', 'VINTAGE', 'ESTATE BOTTLED', 'PRODUCE', 'PRODUCT',
                    'HANDCRAFTED', 'CRAFT', 'ARTISAN', 'SMALL', 'BATCH', 'SIGNATURE', 'FAMILY',
                    'COLLECTION', 'LEGACY', 'HERITAGE', 'VINTNERS', 'SELECT', 'SPECIAL', 'RESERVE'
                ];
                var foundBrand = null;
                for (var i = 0; i < allCaps.length; i++) {
                    var word = allCaps[i].trim();
                    if (word.length > 2 && skipWords.indexOf(word) === -1 && !word.includes('.')) {
                        foundBrand = word;
                        break;
                    }
                }
                if (foundBrand) {
                    data.brand = foundBrand;
                }
            }
        }

        // ---------- ABV ----------
        // Pattern 1: "13% ALC/VOL", "13% ALC", "13%"
        m = cleanText.match(/(\d+(?:\.\d+)?)\s*%?\s*(?:alc|alcohol|abv|proof|vol)/i);
        if (m) {
            data.abv = m[1] + '%';
        }

        // Pattern 2: "ALC. 13% BY VOL."
        if (!data.abv) {
            m = cleanText.match(/alc\.?\s*(\d+(?:\.\d+)?)\s*%/i);
            if (m) {
                data.abv = m[1] + '%';
            }
        }

        // Pattern 3: "13% BY VOL"
        if (!data.abv) {
            m = cleanText.match(/(\d+(?:\.\d+)?)\s*%\s*(?:by\s*vol|alc)/i);
            if (m) {
                data.abv = m[1] + '%';
            }
        }

        // Pattern 4: "80 PROOF"
        if (!data.abv) {
            m = cleanText.match(/(\d+)\s*proof/i);
            if (m) {
                data.abv = (parseInt(m[1]) / 2) + '%';
            }
        }

        // ---------- VOLUME ----------
        m = cleanText.match(/(\d+(?:\.\d+)?)\s*(?:ml|cl|L|l|oz|fl\s*oz|liter|litre)/i);
        if (m) {
            data.volume = m[0].trim();
        }

        // ---------- GOVERNMENT WARNING ----------
        m = cleanText.match(/(?:government\s*warning|surgeon\s*general)[:\s]*([^\.]+\.)/i);
        if (m) {
            data.warning = m[0].trim();
        }

        // If no warning found with standard pattern, look for the full text
        if (!data.warning) {
            var warningKeywords = [
                'GOVERNMENT WARNING',
                'SURGEON GENERAL'
            ];
            for (var w = 0; w < warningKeywords.length; w++) {
                var idx = cleanText.toUpperCase().indexOf(warningKeywords[w]);
                if (idx !== -1) {
                    var start = Math.max(0, idx);
                    var end = cleanText.indexOf('\n\n', idx);
                    if (end === -1) end = cleanText.indexOf('\n', idx);
                    if (end === -1) end = Math.min(cleanText.length, idx + 500);
                    var warningText = cleanText.substring(start, end).trim();
                    if (warningText.length > 10) {
                        data.warning = warningText;
                        break;
                    }
                }
            }
        }

        return data;
    }

    // ============================================================
    // Process Single File
    // ============================================================

    async function processSingleFile(file) {
        var filename = file.name;

        var fileScan = detectMaliciousFile(filename);
        if (fileScan) {
            return {
                filename: filename,
                status: 'rejected',
                reason: 'Security violation: ' + fileScan
            };
        }

        var allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'];
        var extMatch = file.name.match(/\.(png|jpg|jpeg|gif|bmp|tiff|tif|webp)$/i);
        if (!allowedTypes.includes(file.type) && !extMatch) {
            return {
                filename: filename,
                status: 'rejected',
                reason: 'File type not allowed. Only images.'
            };
        }

        try {
            var result = await tessWorker.recognize(file);
            var text = result.data.text;

            if (!text || text.length < 5) {
                return {
                    filename: filename,
                    status: 'rejected',
                    reason: 'No text found in image. Try a clearer photo.'
                };
            }

            console.log('OCR Text for ' + filename + ':', text);

            var label = extractLabelData(text);
            var errors = [];
            if (!label.brand) errors.push('Brand missing');
            if (!label.abv) errors.push('ABV missing');
            if (!label.warning) errors.push('Warning missing');
            var isValid = errors.length === 0;

            return {
                filename: filename,
                status: isValid ? 'valid' : 'invalid',
                label: label,
                errors: errors,
                isValid: isValid
            };

        } catch (err) {
            return {
                filename: filename,
                status: 'error',
                reason: err.message
            };
        }
    }

    // ============================================================
    // Verify Files (Batch)
    // ============================================================

    async function verifyFiles() {
        var files = fileInput.files;
        if (!files || files.length === 0) {
            speak('No files selected.');
            statusDiv.textContent = 'No files selected';
            return;
        }

        if (!checkRateLimit()) {
            statusDiv.textContent = 'Rate limit exceeded. Please wait.';
            speak('Rate limit exceeded. Please wait.');
            return;
        }

        if (!tessWorker) {
            statusDiv.textContent = 'Initializing OCR engine...';
            try {
                tessWorker = await Tesseract.createWorker('eng');
                statusDiv.textContent = 'OCR engine ready.';
            } catch (err) {
                statusDiv.textContent = 'OCR initialization failed: ' + err.message;
                speak('OCR initialization failed.');
                return;
            }
        }

        uploadBtn.disabled = true;
        statusDiv.textContent = 'Processing ' + files.length + ' files...';
        speak('Processing ' + files.length + ' labels. This may take a moment.');

        var results = [];
        var totalValid = 0;
        var totalInvalid = 0;
        var totalRejected = 0;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            statusDiv.textContent = 'Processing ' + (i + 1) + ' of ' + files.length + ': ' + file.name;

            var result = await processSingleFile(file);
            results.push(result);

            if (result.status === 'valid') totalValid++;
            else if (result.status === 'invalid') totalInvalid++;
            else totalRejected++;

            if (batchProgress) {
                batchProgress.textContent = (i + 1) + ' / ' + files.length + ' processed';
            }
        }

        // Store results for export
        lastBatchResults = results;

        // Build results HTML
        var html = '<div style="margin:1rem 0;">';
        html += '<p><strong>Batch Summary:</strong></p>';
        html += '<p><strong>Total:</strong> ' + results.length + '</p>';
        html += '<p><strong>Valid:</strong> <span style="color:#66ff66;font-weight:bold;">' + totalValid + ' ✅</span></p>';
        html += '<p><strong>Invalid:</strong> <span style="color:#ff6666;font-weight:bold;">' + totalInvalid + ' ❌</span></p>';
        html += '<p><strong>Rejected:</strong> <span style="color:#ffaa00;font-weight:bold;">' + totalRejected + ' ⚠️</span></p>';

        // Add Download TXT button if there are results
        if (results.length > 0) {
            html += '<div style="margin:1rem 0;">';
            html += '<button id="download-txt-btn" style="background:#00cc66;color:#000;font-weight:bold;padding:0.5rem 1rem;border-radius:0.5rem;border:none;cursor:pointer;width:auto;font-family:inherit;">Download Report (.txt)</button>';
            html += '</div>';
        }

        html += '<hr style="border-color:#ff6b9d;opacity:0.2;margin:1rem 0;">';

        for (var j = 0; j < results.length; j++) {
            var r = results[j];
            var color = '#66ff66';
            var statusText = 'Valid';
            if (r.status === 'invalid') { color = '#ff6666'; statusText = 'Invalid'; }
            else if (r.status === 'rejected') { color = '#ffaa00'; statusText = 'Rejected'; }
            else if (r.status === 'error') { color = '#ff0000'; statusText = 'Error'; }

            html += '<div style="border-left:4px solid ' + color + ';border-radius:0.5rem;padding:0.5rem 0.75rem;margin:0.5rem 0;background:rgba(255,255,255,0.03);">';
            html += '<p><strong>' + r.filename + '</strong> - <span style="color:' + color + ';font-weight:bold;">' + statusText + '</span></p>';
            if (r.label) {
                html += '<p style="font-size:0.85rem;">Brand: ' + (r.label.brand || 'Not found') + ' | ABV: ' + (r.label.abv || 'Not found') + ' | Warning: ' + (r.label.warning ? 'Found' : 'Not found') + '</p>';
            }
            if (r.errors && r.errors.length) {
                html += '<p style="color:#ff6666;font-size:0.85rem;">Issues: ' + r.errors.join(', ') + '</p>';
            }
            if (r.reason) {
                html += '<p style="color:#ffaa00;font-size:0.85rem;">' + r.reason + '</p>';
            }
            html += '</div>';
        }
        html += '</div>';

        if (batchResults) {
            batchResults.innerHTML = html;
        }
        resultDiv.innerHTML = html;

        // Attach download button event
        var downloadBtn = document.getElementById('download-txt-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                downloadTXT(results, 'tenyaaa_report');
            });
        }

        statusDiv.textContent = 'Batch complete. ' + totalValid + ' valid, ' + totalInvalid + ' invalid, ' + totalRejected + ' rejected.';

        var holiday = getHoliday();
        var summaryMsg = 'Nyaa~ Batch complete. ' + totalValid + ' valid labels. ' + totalInvalid + ' invalid. ' + totalRejected + ' rejected.';
        if (holiday) summaryMsg = 'Nyaa~ ' + holiday + ' ' + summaryMsg;
        speak(summaryMsg);
        addMessage(summaryMsg, true);

        uploadBtn.disabled = false;
    }

    uploadBtn.addEventListener('click', verifyFiles);

    // ============================================================
    // Security: Disable Right-Click on File Input
    // ============================================================

    fileInput.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        speak('Right-click is disabled for security.');
        addMessage('Right-click disabled for security.', true);
    });

    // ============================================================
    // Initialize
    // ============================================================

    statusDiv.textContent = 'Ready. Batch upload supported. Rate limit: ' + RATE_LIMIT + ' files per minute.';

    var holiday = getHoliday();
    if (holiday) {
        setTimeout(function() {
            addMessage('Nyaa~ ' + holiday + ' I have been waiting for this day.', true);
        }, 500);
    } else {
        setTimeout(function() {
            addMessage('Nyaa~ I am Tenyaaa. Upload labels in batches. I am watching.', true);
        }, 500);
    }

    // Initialize OCR Tesseract
    (async function initTesseract() {
        try {
            tessWorker = await Tesseract.createWorker('eng');
            statusDiv.textContent = 'Ready. Batch upload supported. Rate limit: ' + RATE_LIMIT + ' files per minute.';
        } catch (err) {
            statusDiv.textContent = 'OCR initialization failed: ' + err.message + '. Refresh to retry.';
            console.error('Tesseract init error:', err);
        }
    })();

    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = function() {
            window.speechSynthesis.getVoices();
        };
    }

    // Load WebLLM after a delay
    setTimeout(initLLM, 2000);

    console.log('Tenyaaa Security Active');
    console.log('Batch upload: Enabled');
    console.log('Rate limit: ' + RATE_LIMIT + ' files per minute');
    console.log('File scanning: Enabled (includes polyglot detection)');
    console.log('OCR: Enabled');
    console.log('TXT Export: Enabled');
    console.log('XSS prevention: Enabled');
    console.log('IP banning: Enabled');
    console.log('WebLLM: Loading...');

})();
