// Tenyaaa - Configuration
// Centralized configuration for the application

export const CONFIG = {
    APP_NAME: 'Tenyaaa',
    APP_VERSION: '1.0.0',
    RATE_LIMIT: 10,
    RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
    MODEL_NAME: 'Phi-3-mini-4k-instruct-q4f32_1-MLC',
    ALLOWED_EXTENSIONS: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp'],
    ALLOWED_MIME_TYPES: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    BAD_EXTENSIONS: [
        '.php', '.phtml', '.php3', '.php4', '.php5', '.phps',
        '.jsp', '.jspx', '.jsw', '.jsv', '.jspf',
        '.asp', '.aspx', '.asax', '.ashx', '.asmx', '.ascx',
        '.pl', '.pm', '.cgi', '.perl',
        '.sh', '.bash', '.zsh', '.fish',
        '.py', '.rb', '.go', '.rs',
        '.exe', '.dll', '.so', '.bin', '.elf',
        '.htaccess', '.htpasswd', '.git', '.svn'
    ],
    POLYGLOT_PATTERNS: [
        /\.php\./i, /\.phtml\./i, /\.php[3-7]\./i, /\.phps\./i,
        /\.jsp\./i, /\.jspx\./i, /\.jsw\./i, /\.jsv\./i, /\.jspf\./i,
        /\.asp\./i, /\.aspx\./i, /\.asax\./i, /\.ashx\./i, /\.asmx\./i, /\.ascx\./i,
        /\.cer\./i, /\.asa\./i, /\.cdx\./i, /\.htr\./i,
        /\.cfm\./i, /\.cfml\./i, /\.cfc\./i,
        /\.pl\./i, /\.cgi\./i, /\.pm\./i,
        /\.js\./i, /\.node\./i,
        /\.shtml\./i, /\.htaccess\./i, /\.config\./i
    ]
};