# Tenyaaa 0x420
## AI-Powered Alcohol Label Verification for the TTB

### Project Overview

Tenyaaa is a complete, standalone web application built for the Treasury Department's TTB label verification prototype. It extracts text from alcohol label images, verifies the information against TTB requirements, and provides instant feedback on whether a label is compliant. Everything runs locally in your browser. No data ever leaves your device.

---

### How It Works

1.  You upload one or more label images.
2.  The application reads the text from the images using optical character recognition.
3.  It extracts the key fields: brand name, alcohol content, net contents, and the government warning statement.
4.  The application checks if the extracted information matches TTB requirements.
5.  Results are displayed immediately, with a summary for each image.
6.  You can download a complete report of all verifications as a text file.

---

### Why This Matters

**For agents:** The current review process takes five to ten minutes per label. Most of that time is spent on simple checks. Is the brand name correct? Is the ABV listed? Is the government warning present? Agents are drowning in routine verification work. Tenyaaa reduces this to seconds.

**For the agency:** The TTB processes roughly 150,000 label applications each year with a team of 47 agents. In the 1980s, that team had over 100 people. Budget cuts have not reduced the workload. Tools like this help fill the gap.

**For IT:** The agency network blocks most outbound traffic. Cloud-based solutions failed during the scanning vendor pilot because their machine learning endpoints were inaccessible. Tenyaaa runs completely offline after the initial load. No outbound connections needed. No external dependencies.

---

### Requirements Met

| Requirement | How Tenyaaa Addresses It |
| :--- | :--- |
| Brand name verification | OCR extracts brand text. The application displays what it found. |
| ABV verification | OCR extracts alcohol content. The application shows the percentage. |
| Government warning verification | OCR extracts the warning text. The application flags missing or incorrect warnings. |
| Net contents verification | OCR extracts volume. The application displays the result. |
| Fast processing | Most labels process in under five seconds. No external API calls, no network latency. |
| Simple user interface | One screen. One upload button. Clear results. No hidden menus. |
| Batch upload | Upload multiple images at once. Process them all in a single batch. |
| Works on government network | No outbound calls. No cloud dependencies. Runs entirely in the browser. |
| No data storage | Everything stays local. No server. No database. No PII retention concerns. |

---

### Security Considerations

Tenyaaa was designed with security in mind from the start.

**File upload scanning:** The application checks every uploaded file for malicious extensions. Blocked extensions include PHP, JSP, ASP, Perl, shell scripts, and others. It also detects polyglot attacks where a file uses a double extension like `.php.png`.

**Rate limiting:** Users can upload a maximum of ten files per minute. This prevents abuse and protects the system from being overwhelmed.

**Input sanitization:** All user input is sanitized before display or processing. This prevents cross-site scripting attacks.

**IP banning:** If a user repeatedly attempts malicious actions, their fingerprint is recorded and they are banned from using the application.

**No external dependencies:** No cloud APIs. No third-party services. All code runs in the browser.

**Local processing:** No data is sent to any server. Everything stays on your device.

---

### Technical Approach

**Client-side only:** The application runs entirely in the browser using JavaScript. There is no backend server. No database. No data storage. This decision was made for three reasons.

First, it eliminates data retention concerns. Since nothing is stored, there is nothing to secure, retain, or delete.

Second, it works in restricted network environments. The agency network blocks many external domains. Cloud APIs fail. Serverless functions fail. Local processing does not fail.

Third, it is cheaper to deploy and maintain. No server infrastructure. No ongoing costs. Just static files.

**OCR:** Tesseract.js provides optical character recognition. It runs in the browser using WebAssembly. No cloud calls. No network latency.

**AI:** WebLLM provides a local large language model using WebGPU acceleration. The model runs on your graphics card or CPU. Everything is processed locally. No data leaves your device.

**Security:** Polyglot detection catches malicious double extensions. Rate limiting prevents abuse. IP banning tracks bad actors.

**Export:** All verification results can be downloaded as a text file. The report includes timestamps, batch summaries, and detailed results for each image.

---

### Architecture

```
Browser
  │
  ├── index.html (main page)
  ├── style.css (styling)
  ├── app.js (application logic)
  │     │
  │     ├── Security: extension blocking, polyglot detection, rate limiting, IP banning, input sanitization
  │     ├── OCR: Tesseract.js for text extraction
  │     ├── AI: WebLLM for label verification (optional fallback)
  │     ├── Export: TXT report generation
  │     └── UI: chat, upload, results display
  └── No server. No database. No network calls.
```

---

### Installation

1.  Clone the repository: `git clone https://github.com/Nyakki-Labs-0x420/tenyaaa.git`
2.  Open the project folder: `cd tenyaaa`
3.  Open `index.html` in your browser.

**Important:** Use Chrome or Edge for best performance. WebGPU support is required for the AI model. The first load of the AI model may take several minutes while the model downloads to your browser cache. Subsequent loads are faster.

---

### Deployment

**Netlify:** The easiest way to host the application is using Netlify. Drag and drop the project folder onto the Netlify dashboard. Netlify will provide a public URL.

**Manual:** You can also host the application on any static web server. The application consists of three files: `index.html`, `style.css`, and `app.js`. Upload these to your web server. No special configuration is needed.

**GitHub Pages:** The application was built for GitHub Pages but GitHub Pages does not serve WebAssembly files with the correct MIME type. Netlify is the recommended deployment platform.

---

### Trade-Offs and Limitations

**OCR accuracy:** The optical character recognition works well with clear, well-lit images. Blurry photos, glare, or unusual angles may reduce accuracy.

**WebGPU requirement:** The AI model requires WebGPU support. This is available in recent versions of Chrome and Edge. If your browser does not support WebGPU, the application falls back to pre-defined responses.

**First load time:** The AI model is approximately two gigabytes. The first load may take several minutes while the model downloads to your browser cache. Subsequent loads are faster.

**No mobile support:** The application has not been optimized for mobile devices. It is designed for desktop use.

**No integration with COLA:** The prototype is standalone. It does not integrate with the existing COLA system. Integration would require additional engineering work.

---

### How to Use the Application

1.  Open the application in your browser.
2.  Click the file input button or drag and drop images into the upload area.
3.  Select one or more images. The application accepts PNG, JPG, GIF, BMP, TIFF, and WebP files.
4.  Click the "Verify Labels" button.
5.  Wait for processing. Each image will be processed in sequence.
6.  Review the results. Each image will show a status: Valid, Invalid, or Rejected.
7.  Valid images show the extracted brand name, ABV, and warning status.
8.  Invalid images show which fields are missing or incorrect.
9.  Rejected images were blocked for security reasons.
10. Download a complete report using the "Download Report" button.

---

### Example Test Label

```
Brand Name: OLD TOM DISTILLERY
Class/Type: Kentucky Straight Bourbon Whiskey
Alcohol Content: 45% Alc./Vol. (90 Proof)
Net Contents: 750 mL
Government Warning: GOVERNMENT WARNING: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems.
```

Upload an image containing this text to test the application. The system will extract the information and verify it against TTB requirements.

---

### Source Code Repository

All source code is available at:
[https://github.com/Nyakki-Labs-0x420/tenyaaa](https://github.com/Nyakki-Labs-0x420/tenyaaa)

---

### Contact

**Email:** Nyakki-Labs-0x420@proton.me

For additional contact information, please refer to the email address listed in my resume.

---

### Acknowledgments

Built for the Treasury Department TTB Label Verification prototype.

**Live Demo:** [https://tenyaaa.netlify.app](https://tenyaaa.netlify.app)

---

*Thank you for your time and consideration.*
