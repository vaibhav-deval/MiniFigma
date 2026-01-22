🔥 **Love this project already — it’s solid, thoughtful, and very “real-world frontend”**.
I’ll enhance it by making it **more polished, impactful, and portfolio-ready**, while keeping *your intent, tone, and learning focus intact*. Think of this as a **next-level README / project description** that recruiters, GitHub visitors, and devs will instantly respect.

---

# 🧩 Mini Figma — Browser-Based Design Tool

**Mini Figma** is a lightweight, browser-based design playground inspired by modern design tools like Figma.
It allows users to **create, manipulate, and export design elements** directly in the browser using **pure HTML, CSS, and Vanilla JavaScript** — no frameworks, no libraries.

This project prioritizes **clean UI, smooth interactions, and clear architecture**, making it ideal for learning how real design tools work under the hood.

---

## 🚀 Why This Project Matters

Mini Figma isn’t just a UI demo — it’s a **hands-on exploration of how professional design tools are built**.

By working through this codebase, you gain deep understanding of:

* Canvas-like systems using the DOM
* Drag, resize, and rotation math
* UI state management
* Layer ordering and z-index logic
* Real-time property syncing
* Exporting structured design data

👉 If you understand this project, you understand **practical frontend engineering**.

---

## ✨ Core Features

* 🖱️ **Drag, Resize & Rotate** elements with visual handles
* 🔤 **Editable Text Elements** (live content editing)
* 🟦 **Rectangle Shapes** with customizable styles
* 🧱 **Layer Panel** with z-index control

  * Bring forward
  * Send backward
* 🎛️ **Property Panel**

  * Position (X / Y)
  * Size (Width / Height)
  * Rotation
  * Background & text styles
* ⌨️ **Keyboard Controls**

  * Arrow keys for nudging
  * Delete key to remove elements
* 💾 **Auto-Save**

  * Design state persists via `localStorage`
* 📤 **Export Options**

  * Export as **HTML**
  * Export as **JSON**

---

## 🎨 UI & Design System

The interface follows a **minimal, glassmorphism-inspired design**, focusing on clarity and usability without visual noise.

### Design Highlights

* Frosted glass panels using `backdrop-filter`
* Floating toolbars and side panels
* Soft shadows, subtle borders, and rounded corners
* Clear visual feedback for:

  * Selection
  * Hover
  * Active interactions
* Cursor-based UX for move, resize, and rotate actions

### UI Panels

* 🖼️ **Canvas Panel** — main design workspace
* 🧱 **Layers Panel** — element hierarchy & selection
* 🎛️ **Properties Panel** — real-time element configuration

---

## 🎞️ Animations & Interactions

All animations are **lightweight, CSS-driven, and intentional**.

* Smooth hover transitions
* Button scale & translate effects
* Visible resize handles on selection
* Dedicated rotation handle with cursor feedback
* Real-time updates while dragging, resizing, and rotating

✨ No heavy animation libraries — just clean CSS doing its job.

---

## 🎯 CSS Architecture

### `theme.css`

All design tokens are defined using **CSS root variables**, enabling:

* Easy theming
* Visual consistency
* Future scalability (dark/light mode, custom themes)

### `style.css`

Handles:

* Layout & positioning
* Panel structures
* Canvas behavior
* Element selection states
* Resize & rotation handles
* Button animations
* Layer list UI

💡 Visual behavior is kept **separate from logic**, making the codebase easier to maintain and extend.

---

## 🧠 JavaScript Architecture (`app.js`)

The JavaScript is structured into **clear, logical sections** for readability and learning:

1. DOM references
2. Global state management
3. Utility & helper functions
4. Element creation logic
5. Canvas & layer rendering
6. Selection handling
7. Property panel synchronization
8. Drag, resize & rotate logic
9. Keyboard interactions
10. Layer (z-index) management
11. Export logic (HTML & JSON)
12. Initialization & state restoration
13. Show & Hide || Props And Layers

Each section is **well-commented and beginner-friendly**, making the project easy to explore and extend.

---

## 🧩 Code Improvements & Guidance

This project was **reviewed, refined, and structured** with the help of ChatGPT to improve clarity and maintainability.

### Improvements Made

* Logical code reorganization
* Clear, descriptive comments
* Consolidated repetitive event listeners
* Improved naming conventions
* Cleaner formatting

### Suggestions Implemented / Discussed

* Better separation of drag, resize, and rotate logic
* Cleaner rotation calculations
* Ideas for future modularization
* Performance and scalability considerations

🧠 Result: a codebase that’s **easier to debug, learn from, and grow**.

---

## 🚀 Export Capabilities

* 📄 **Export as HTML**
  Generates a standalone HTML file that visually replicates the design

* 📦 **Export as JSON**
  Saves the complete design state for reloads or reuse

Perfect for:

* Sharing designs
* Rebuilding layouts
* Future import features

---

## 🛠️ Tech Stack

* HTML5
* CSS3 (Custom Properties, Flexbox, Transitions)
* Vanilla JavaScript
* ❌ No frameworks
* ❌ No external libraries

---

## 📌 Planned Enhancements

* Font size & font family controls
* Multi-select support
* Snap-to-grid
* Undo / Redo system
* Component system
* Responsive canvas scaling

---

## 👤 Author

**Vaibhav Deval**
Frontend Developer | UI Enthusiast

Built to deeply understand how **design tools think**, not just how they look.

---

## ⭐ Final Thought

> This project is not about cloning Figma.
> It’s about understanding the **mindset behind tools like Figma**.

If you understand this code, you understand:

* Canvas-like systems
* Interaction geometry
* UI state management
* Real-world frontend problem solving

🔥 **This is the kind of project that turns a frontend learner into a frontend engineer.**

---
