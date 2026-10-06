# Anant Joshi — Personal Portfolio

Portfolio of **Anant Joshi** — Final-Year B.Tech CSE (Data Science Specialization), AI/ML Engineer & Data Analyst.

Live Site: [https://my-portfolio-psi-liart-71.vercel.app/](https://my-portfolio-psi-liart-71.vercel.app/)

---

## Architecture & Design System

- **Desktop Experience ($\ge$ 1024px)**: Full macOS-style desktop environment with translucent top menu bar (live clock, Wi-Fi, battery), right-column desktop folders/files (`Projects`, `Skills`, `About`, `Contact`, `Resume.pdf`), floating draggable windows with functional macOS traffic lights, and a frosted glass dock with smooth hover magnification.
- **Mobile Experience ($<$ 768px)**: Native iOS home screen layout with live status bar, 4-column app icon grid, frosted bottom dock, Safari bottom address bar (`anantjoshi.dev`), and slide-up sheets with drag handles.
- **Palette**: Strict two-tone hierarchy:
  - Accent: `#74D0FA`
  - Base Dark: `#1C1E1F`
  - Derived Neutrals: `rgba(255, 255, 255, 0.06 - 0.12)` surfaces and borders
  - Text: `#FFFFFF` / `#F2F4F5`
  - Zero glowing radial blooms, zero purple/orange gradients, zero AI template clichés.
- **Typography**: Inter for all body and heading copy; JetBrains Mono for system badges and dates.
- **Accessibility & Speed**: Zero dependencies, under 200KB total bundle, semantic HTML, keyboard accessible (`Esc` closes active windows), and full `<noscript>` fallback.

---

## File Structure

```text
├── index.html        # Semantic markup (macOS desktop + iOS home screen + no-JS fallback)
├── styles.css        # Pure CSS design system, responsive breakpoints, animations
├── script.js         # Window manager, dock magnification, iOS sheets, clocks, toasts
├── data.js           # Single centralized configuration for all projects & skills
├── anant_photo.jpg   # Profile avatar
├── Anant_Joshi_Resume.pdf # Downloadable and previewable resume
└── vercel.json       # Deployment configuration
```

---

## How to Edit Projects & Skills (`data.js`)

All portfolio content is maintained in `data.js`. You do **not** need to touch `index.html` to add or modify projects and skills:

### 1. Adding or Editing a Project
Open [data.js](data.js) and locate the `projects` array:
```javascript
{
  id: "your-project-id",
  title: "Project Title",
  category: "ml", // "ml", "analytics", or "backend"
  categoryLabel: "Category Label",
  year: "2026",
  tag: "Key Tech Tag",
  description: "One or two sentences detailing the project.",
  highlights: [
    "Key benchmark or accuracy stat",
    "Performance improvement or scaling metric"
  ],
  stack: ["Python", "TensorFlow", "FastAPI"],
  githubUrl: "https://github.com/Cypheraj12/...",
  liveUrl: null
}
```

### 2. Updating Skills
In [data.js](data.js), edit the `skills` array under the appropriate category:
```javascript
{
  category: "AI & Machine Learning",
  items: ["TensorFlow", "PyTorch", "Scikit-Learn", "OpenCV", "MobileNetV2"]
}
```
