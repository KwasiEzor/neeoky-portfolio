# Planned Improvements: neeoky Portfolio

This file lists the technical and visual improvements to be implemented on the `feature/improvements` branch.

## 🎨 UI/UX & Consistency
1.  **Icon Standardization:** Replace platform emojis in the `contact.html` sidebar with consistent Lucide icons to match the rest of the site's aesthetic.
2.  **Magnetic Button Effect:** Implement a subtle magnetic pull effect for primary CTA buttons in `script.js` to enhance the premium feel.

## 🛠️ Technical Fixes
1.  **Dynamic Scroll Padding:** Replace the hardcoded `scroll-padding-top: 100px` in CSS with a CSS variable (`--nav-height`) for better maintainability.
2.  **Enhanced Form Feedback:** Replace the browser `alert()` in the contact form with a modern, glassmorphism-style error notification integrated into the UI.
3.  **Favicon Compatibility:** Add a standard `.png` favicon declaration in all HTML files as a fallback for the current `.svg`.

## 📈 SEO & Performance
1.  **Missing Assets Fix:** Address the missing `og-image.jpg` reference (either by creating a placeholder or documenting the requirement).
2.  **Image Optimization Note:** Add instructions or prepare for `.webp` migration for existing `.jpg` assets.
3.  **Code De-duplication:** (Optional/Refactor) Identify shared logic in `script.js` that can be further modularized.
