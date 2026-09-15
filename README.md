# PrintPerfect — Browser-Based Photo-to-Print Designer

> **Resize, crop and prepare photos for printing.**

PrintPerfect is a web application designed to help non-technical and professional users prepare any photograph for physical printing at standard or custom print sizes.

### 🔒 100% Client-Side Privacy Guarantee
> **Your photos stay on your device. Everything happens locally in your browser.**

PrintPerfect operates with **zero backend server uploads**. All image loading, saliency analysis, cropping, color tuning, high-definition upscaling, and export rendering happen entirely in your browser's RAM and GPU via HTML5 Canvas and Web API technologies.

---

## ✨ Key Features

### 1. Simple Photo Upload & HEIC Support
- **Drag & Drop**: Drag high-resolution photos directly onto the upload zone or choose from your file library / camera.
- **iPhone HEIC/HEIF Decoding**: Automatically decodes Apple HEIC/HEIF images client-side without sending data to external servers.
- **Photo Analysis**: Automatically calculates pixel dimensions, aspect ratio, estimated Megapixels, file size, and recommended maximum print size at 300 PPI.
- **Built-in Sample Photos**: Includes high-definition 4K sample photographs for instant testing.

### 2. Comprehensive Print Size Presets & Custom Dimensions
- **Metric & ISO**: 6×4 in, 7×5 in, 8×6 in, 10×8 in, 12×8 in, 14×11 in, A5, A4, A3.
- **Popular Photo Sizes**: 4×6 in, 5×7 in, 8×10 in, 10×12 in, 11×14 in, 12×18 in, 16×20 in, 20×24 in, 24×36 in.
- **Standard Frames**: 8×10 in, 11×14 in, 16×20 in, 20×24 in.
- **Large Format**: 12×18 in, 16×24 in, 20×30 in, 24×36 in.
- **Custom Size Builder**: Enter exact Width and Height in **inches**, **centimeters (cm)**, or **millimeters (mm)** with custom DPI/PPI target calculations.

### 3. Smart Crop Studio
- **Interactive Canvas Controls**: Smooth mouse & touch dragging to pan, pinch/scroll zoom, 90° rotations, fine-angle slider (-45° to +45°), horizontal/vertical flipping, and orientation toggles (Portrait/Landscape).
- **Fit Modes**:
  - *Fill (Cover)* — fills paper completely, cropping excess.
  - *Fit (Contain)* — fits entire image with optional matting.
  - *Stretch* — stretches image to paper aspect ratio (with warning).
  - *Smart Fit*.
- **Smart Crop**: Automated subject center detection using visual saliency/contrast density algorithms (and native browser `FaceDetector` API integration).
- **Rule of Thirds Overlay**: Composition grid guidelines for alignment.

### 4. Multi-Size Version Management & Batch ZIP Export
- Create and manage multiple print size variations for the same photo (e.g. 4×6", 8×10", and A4 simultaneously).
- Switch between print sizes without losing crop or adjustment settings.
- **Batch Export**: Download all size variations in a single compressed `.zip` archive.

### 5. Print Quality Checker & Local Upscaling
- **Quality Score Badges**:
  - 🟢 **Excellent quality** (≥ 300 PPI target)
  - 🟡 **Good quality** (200–299 PPI)
  - 🟠 **Acceptable quality** (140–199 PPI)
  - 🔴 **Low resolution** (< 140 PPI)
- Displays required pixel dimensions vs actual photo resolution with simple, friendly advice.
- **Improve Resolution**: High-Definition multi-pass Lanczos3/Bicubic resampling pass to upscale low-resolution photos locally with edge sharpening.

### 6. Photo Enhancement Studio
- Real-time adjustment sliders: **Exposure**, **Brightness**, **Contrast**, **Saturation**, **Highlights**, **Shadows**, **Warmth**, **Print Sharpness** (unsharp mask filter), and **Blur**.
- **Auto Enhance**: 1-click histogram-driven tone and contrast optimizer.
- **Hold for Before View**: Press and hold to compare original vs enhanced version.

### 7. Print Margins & Realistic Environment Preview
- Inset print borders (mm or inches) with customizable matting colors (White, Off-White, Light Gray, Dark Gray, Black, or Custom picker).
- **Realistic Preview Modal**: View prints in realistic environments (*Framed Wall mockup*, *Dark Studio*, *Light Gray*, *Clean White*) with 100% actual display scale options.

### 8. High-Resolution Print Export
- Export in **JPG** (with adjustable quality slider), **PNG** (lossless), or **WebP**.
- **DPI EXIF/pHYs Metadata**: Injects dots-per-inch headers directly into output file headers so photo printers read target 300 DPI density automatically.

### 9. PWA & Recent Projects
- **PWA Ready**: Web App Manifest and Service Worker support full offline functionality after initial load.
- **Local Recent Projects**: Saves project drafts to IndexedDB browser storage for quick reloading or deletion.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, Vite
- **Styling**: Modern Vanilla CSS with CSS Custom Properties, glassmorphism, responsive grid
- **Icons**: Lucide React
- **Image Processing & Math**: HTML5 2D Canvas Context, WebGL, custom Lanczos resampler, `heic2any` decoder
- **Local Storage**: IndexedDB via `idb`
- **Archiving**: `jszip`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:namaggarwal/print_perfect.git
   cd print_perfect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
