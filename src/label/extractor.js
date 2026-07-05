// Tenyaaa - Label Data Extraction Module

export function extractLabelData(text) {
    const data = {};
    const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Brand name
    let m = cleanText.match(/(?:brand|name|distillery|winery|brewery)[:\s]+([A-Z][A-Z\s]+)/i);
    if (m) {
        data.brand = m[1].trim();
    }

    // Fallback: look for all-caps words
    if (!data.brand) {
        const allCaps = cleanText.match(/\b[A-Z][A-Z\s]{2,}\b/g);
        if (allCaps && allCaps.length > 0) {
            const skipWords = ['WHISKEY', 'WHISKY', 'BEER', 'WINE', 'PROOF', 'ALCOHOL', 'VOL', 'ML', 'L', 'OZ',
                'BOTTLED', 'BOND', 'YEARS', 'AGED', 'STRAIGHT', 'BOURBON', 'RYE', 'SCOTCH',
                'GIN', 'VODKA', 'RUM', 'TEQUILA', 'CONTAINS', 'SULFITES', 'MERLOT', 'CABERNET',
                'SAUVIGNON', 'RED', 'WHITE', 'BLEND', 'ESTATE', 'CELLARS', 'CITY', 'STATE',
                'RESERVE', 'PRIVATE', 'SELECT', 'BARREL', 'SINGLE', 'MALT', 'PORT', 'SHERRY',
                'CHARDONNAY', 'PINOT', 'NOIR', 'ZINFANDEL', 'SYRAH', 'MALBEC', 'RIESLING',
                'SPARKLING', 'ROSE', 'VINTAGE', 'PRODUCE', 'PRODUCT', 'HANDCRAFTED', 'CRAFT',
                'ARTISAN', 'SMALL', 'BATCH', 'SIGNATURE', 'FAMILY', 'COLLECTION', 'LEGACY',
                'HERITAGE', 'VINTNERS', 'SELECT', 'SPECIAL', 'RESERVE'
            ];
            for (const word of allCaps) {
                const clean = word.trim();
                if (clean.length > 2 && !skipWords.includes(clean) && !clean.includes('.')) {
                    data.brand = clean;
                    break;
                }
            }
        }
    }

    // ABV
    m = cleanText.match(/(\d+(?:\.\d+)?)\s*%?\s*(?:alc|alcohol|abv|proof|vol)/i);
    if (m) {
        data.abv = m[1] + '%';
    } else {
        m = cleanText.match(/alc\.?\s*(\d+(?:\.\d+)?)\s*%/i);
        if (m) {
            data.abv = m[1] + '%';
        } else {
            m = cleanText.match(/(\d+(?:\.\d+)?)\s*%\s*(?:by\s*vol|alc)/i);
            if (m) {
                data.abv = m[1] + '%';
            } else {
                m = cleanText.match(/(\d+)\s*proof/i);
                if (m) {
                    data.abv = (parseInt(m[1]) / 2) + '%';
                }
            }
        }
    }

    // Volume
    m = cleanText.match(/(\d+(?:\.\d+)?)\s*(?:ml|cl|L|l|oz|fl\s*oz|liter|litre)/i);
    if (m) {
        data.volume = m[0].trim();
    }

    // Government warning
    m = cleanText.match(/(?:government\s*warning|surgeon\s*general)[:\s]*([^\.]+\.)/i);
    if (m) {
        data.warning = m[0].trim();
    }

    // Fallback warning detection
    if (!data.warning) {
        const keywords = ['GOVERNMENT WARNING', 'SURGEON GENERAL'];
        for (const kw of keywords) {
            const idx = cleanText.toUpperCase().indexOf(kw);
            if (idx !== -1) {
                const start = Math.max(0, idx);
                let end = cleanText.indexOf('\n\n', idx);
                if (end === -1) end = cleanText.indexOf('\n', idx);
                if (end === -1) end = Math.min(cleanText.length, idx + 500);
                const warningText = cleanText.substring(start, end).trim();
                if (warningText.length > 10) {
                    data.warning = warningText;
                    break;
                }
            }
        }
    }

    return data;
}