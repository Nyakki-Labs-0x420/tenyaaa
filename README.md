# Tenyaaa

## AI-Powered Alcohol Label Verification for TTB Compliance

Tenyaaa is a modular, client-side web application that automates the verification of alcohol beverage labels against TTB requirements. The application extracts text from label images using optical character recognition, identifies key label fields, and validates them against regulatory standards. All processing occurs locally in the browser with no external API calls and no data persistence.

The application is designed to be deployed on Netlify. Netlify serves WebAssembly files with the correct MIME type, which is required for the OCR and AI components to function properly.

---

## Features

| Feature | Description |
| :--- | :--- |
| Optical Character Recognition | Extracts text from label images using Tesseract.js. Processes PNG, JPG, GIF, BMP, TIFF, and WebP formats. |
| Automated Field Extraction | Identifies brand name, alcohol content, net contents, and government warning statements from extracted text. |
| Batch Processing | Supports multiple file uploads in a single batch. Processes each label sequentially with progress tracking. |
| Real-time Verification | Displays validation results immediately after processing. Shows pass/fail status with detailed field-level feedback. |
| Report Generation | Exports verification results as a text file. Includes timestamps, batch summaries, and per-label details with extracted fields and errors. |
| Local AI Chat Assistant | Provides conversational interface for label verification questions. Runs locally via WebGPU with no external API calls. |
| Text-to-Speech | Reads verification results aloud using browser speech synthesis. |
| Security Controls | Implements file extension filtering, polyglot detection, rate limiting, input sanitization, and IP banning. |

---

## Architecture

Tenyaaa follows a modular architecture with clear separation of concerns. Each module has a single responsibility and can be tested and maintained independently.

```
tenyaaa/
├── index.html              # Main entry point
├── style.css               # Application styling
├── src/
│   ├── core/               # Core utilities
│   │   ├── config.js       # Configuration and constants
│   │   ├── security.js     # File validation and input sanitization
│   │   ├── ratelimit.js    # Rate limiting implementation
│   │   ├── ban.js          # IP banning and fingerprint management
│   │   └── logger.js       # Logging utilities
│   ├── ocr/
│   │   └── tesseract.js    # Tesseract.js wrapper and OCR operations
│   ├── ai/
│   │   ├── webllm.js       # WebLLM initialization and inference
│   │   └── fallback.js     # Pre-defined responses when LLM unavailable
│   ├── label/
│   │   ├── extractor.js    # Label field extraction from OCR text
│   │   └── validator.js    # TTB compliance validation rules
│   ├── export/
│   │   └── txt.js          # TXT report generation and download
│   ├── ui/                 # User interface modules
│   │   ├── chat.js         # Chat interface and messaging
│   │   ├── speech.js       # Text-to-speech functionality
│   │   ├── upload.js       # File upload and batch processing
│   │   ├── results.js      # Results display and rendering
│   │   └── holiday.js      # Holiday detection for greetings
│   └── app.js              # Entry point - imports and initializes all modules
```

---

## Modules

### Core Module

Contains configuration constants, security utilities, rate limiting, IP banning, and logging. These components provide the foundation for all other modules.

| File | Purpose |
| :--- | :--- |
| config.js | Centralized configuration including rate limits, allowed extensions, and blocked file patterns. |
| security.js | File extension validation, polyglot detection, and input sanitization. |
| ratelimit.js | Request counting and window-based rate limiting. |
| ban.js | Browser fingerprint management and persistent ban tracking using localStorage. |
| logger.js | Structured logging with multiple severity levels. |

### OCR Module

Handles optical character recognition operations.

| File | Purpose |
| :--- | :--- |
| tesseract.js | Initializes Tesseract worker, processes images, extracts text, and manages worker lifecycle. |

### AI Module

Manages the local language model integration.

| File | Purpose |
| :--- | :--- |
| webllm.js | Loads WebLLM model via dynamic import from esm.run, manages inference requests, and reports progress. |
| fallback.js | Provides pre-defined catgirl responses when WebLLM is unavailable or fails. |

### Label Module

Extracts and validates label data.

| File | Purpose |
| :--- | :--- |
| extractor.js | Parses OCR text to identify brand name, ABV, volume, and government warning using pattern matching. |
| validator.js | Applies TTB compliance rules to extracted data and returns validation results. |

### Export Module

Generates downloadable reports.

| File | Purpose |
| :--- | :--- |
| txt.js | Constructs formatted text reports with batch summaries and per-label details. Triggers browser download. |

### UI Module

Handles all user interface interactions.

| File | Purpose |
| :--- | :--- |
| chat.js | Manages chat interface, message rendering, and user input handling. |
| speech.js | Browser speech synthesis wrapper with voice selection and sanitization. |
| upload.js | Coordinates file selection, batch processing, and OCR pipeline. |
| results.js | Renders verification results with color-coded status indicators and summary statistics. |
| holiday.js | Detects major holidays for contextual greetings. |

---

## Requirements Met

| Treasury Requirement | Tenyaaa Implementation |
| :--- | :--- |
| Brand name verification | OCR extracts brand text via Tesseract.js. Application displays extracted value. |
| Alcohol content verification | OCR extracts ABV percentage. Application displays extracted value with validation. |
| Government warning verification | OCR extracts warning text. Application flags missing or incorrectly formatted warnings. |
| Net contents verification | OCR extracts volume. Application displays extracted value. |
| Processing under 5 seconds | No external API calls. Local processing eliminates network latency. |
| Simple user interface | Single screen with upload button and clear results display. No hidden menus or complex navigation. |
| Batch upload capability | Supports multiple file selection and sequential processing with progress tracking. |
| Works on government network | No outbound traffic. No cloud dependencies. Runs entirely in the browser. |
| No data storage | All processing occurs locally. No server, no database, no PII retention. |

---

## Installation

### Prerequisites

- Modern web browser (Chrome or Edge recommended [Even though I prefer Brave, Librewolf or Tor XD])
- Internet connection for initial model download (WebLLM only)
- Netlify account for deployment

### Setup

Clone the repository:

```bash
git clone https://github.com/Nyakki-Labs-0x420/tenyaaa.git
cd tenyaaa
```

The application consists of static files only. No build step or package installation is required.

### First Load

The WebLLM model downloads to the browser cache on first load. This may take several minutes depending on connection speed. Subsequent loads are faster as the model is cached locally.

---

## Deployment

### Netlify (Required)

This application must be deployed on Netlify. Other platforms such as GitHub Pages do not serve WebAssembly files with the correct MIME type, which breaks the OCR and AI components.

Deployment steps:

1. Log in to Netlify.
2. Click Add New Site and select Deploy Manually.
3. Drag the project folder into the deployment area.
4. Netlify provides a public URL automatically.

Alternatively, connect your GitHub repository to Netlify and select the main branch for automatic deployments.

The deployed URL will be similar to: https://tenyaaa.netlify.app

---

## Usage

### Label Verification

1. Open the application in a browser.
2. Click the file input field or drag images into the upload area.
3. Select one or more label images.
4. Click the Verify Labels button.
5. Review results for each image.

### Verification Results

Each label receives one of three statuses:

| Status | Description |
| :--- | :--- |
| Valid | All required fields extracted and verified against TTB requirements. |
| Invalid | One or more required fields missing or incorrect. Extracted fields are displayed. |
| Rejected | File blocked by security controls or no text extracted from the image. |

For Valid and Invalid labels, the application displays extracted brand name, ABV, and warning status.

### Report Generation

After batch processing completes, a Download Report button appears. Clicking this button generates a text file containing:

- Batch timestamp
- Summary statistics (total, valid, invalid, rejected)
- Per-label results with extracted fields and validation errors

### Chat Assistant

Type a message in the chat input and press Enter. The AI assistant responds with voice output. The assistant can answer questions about label verification and TTB requirements.

---

## Security Considerations

| Control | Implementation |
| :--- | :--- |
| File extension blocking | Blocks PHP, JSP, ASP, Perl, shell scripts, and other malicious extensions. |
| Polyglot detection | Detects double extensions such as .php.png, .jsp.jpg using regex patterns. |
| Rate limiting | Ten files per minute maximum. Prevents abuse and resource exhaustion. |
| Input sanitization | Strips HTML tags and script patterns from all user input. |
| IP banning | Permanent ban stored locally using browser fingerprint. |
| No external dependencies | No cloud APIs. No third-party services. All code runs in the browser. |
| Local processing | No data sent to any server. All operations occur on user device. |

---

## Trade-Offs and Limitations

**OCR Accuracy**
The optical character recognition performs best with clear, well-lit images. Blurry photos, glare, or unusual angles may reduce accuracy.

**WebGPU Requirement**
The AI assistant requires WebGPU support. This is available in recent versions of Chrome and Edge. If WebGPU is unavailable, the assistant falls back to pre-defined responses.

**First Load Time**
The WebLLM model is approximately two gigabytes. First load may take several minutes while the model downloads to the browser cache.

**Mobile Support**
The application is designed for desktop use. Mobile optimization is not included.

**COLA Integration**
This prototype does not integrate with the COLA system. Integration would require additional development and authorization.

**Netlify Dependency**
The application requires Netlify for deployment. Other static hosts do not serve WebAssembly files with the correct MIME type.

---

## License

This project is licensed under the GNU Affero General Public License v3.0. See the LICENSE file for details.

---

## Author

Nyakki Labs
[Nyakki-Labs-0x420@proton.me](Nyakki-Labs-0x420@proton.me)

For other contact information refer to the resume that was included in the application package please. 

---

## Repository

[https://github.com/Nyakki-Labs-0x420/tenyaaa](https://github.com/Nyakki-Labs-0x420/tenyaaa)

---

## Acknowledgments

Built for the Treasury Department TTB Label Verification prototype.
