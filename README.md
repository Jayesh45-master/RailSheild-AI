# 🛡️ RailShield AI

> **A smart, sensor-driven real-time railway safety platform powered by IoT, Edge AI, and Computer Vision.**

![RailShield AI Banner](https://img.shields.io/badge/Status-Live%20Demo-brightgreen?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🚆 What is RailShield AI?

RailShield AI is an interactive web demonstration of a next-generation railway safety system designed for the **Indian Railway Network**. It showcases how IoT sensors, Edge AI processing, PTZ surveillance cameras, thermal imaging, and real-time alerting can work together to:

- **Detect obstacles and intrusions** on railway tracks before a train arrives
- **Verify threats visually** using live camera snapshots processed by YOLO vision models
- **Alert the right people instantly** — Loco Pilot (cab radio), Station Master (web console), and RPF (mobile dispatch terminals)
- **Protect women passengers** on isolated platforms using handwave gesture recognition and thermal body heat fusion

The website itself is a **scroll-driven interactive journey** from Station A to Station E, where each section demonstrates one core module of the system with live simulations, animated graphics, and real-time socket log terminals.

---

## 🌐 Live Demo

🔗 **[https://jayesh45-master.github.io/RailSheild-AI/](https://jayesh45-master.github.io/RailSheild-AI/)**

---

## 📁 Project Structure

```
RailSheild-AI/
│
├── index.html          ← Main HTML file (all 5 sections / stations)
├── style.css           ← All styling, animations, and layout rules
├── app.js              ← All interactive logic, simulations, and audio
└── README.md           ← This file
```

---

## 📄 File Descriptions

### `index.html`
The core structure of the entire website. It is divided into **5 journey sections** (called Stations), each representing a different module of the RailShield AI system:

| Section | Station | What it Contains |
|---------|---------|-----------------|
| `#home` | **Station A: Departure Hub** | Hero landing section with railway signal mast, animated scroll hint, and navigation to the journey |
| `#iot-pipeline` | **Station B: Transit Monitor** | 5-step IoT alert pipeline — Sensor → Camera Snapshot → Sirens → Station Master → RPF. Contains the Web Admin Dashboard mockup and the RPF Mobile Dispatch app (phone frame) |
| `#sensor-verify` | **Station C: Verification Hub** | Three-stage sensor verification loop — Acoustic graph spike → PTZ camera pivot and live picture → Dispatcher console override with Loco Pilot & RPF alert button |
| `#women-safety` | **Station D: Platform Security** | Women safety core containing Module 01 (Handwave Visual SOS with skeleton vector detection) and Module 02 (FLIR Thermal + CCTV PTZ Sensor Fusion) |
| `#conclusion` | **Station E: Safe Arrival** | Journey conclusion with a call-to-action to restart the demo |

It also contains:
- **Sticky Train Tracker** at the bottom — a fixed railway track with a moving train icon that travels left to right as the user scrolls
- **ShieldGuard AI Tour Guide** — a floating chatbot card that walks through all 5 stations automatically

---

### `style.css`
All visual design rules for the entire website. Organized into clearly labeled sections:

| Section | What it Styles |
|---------|---------------|
| `:root` variables | Color palette (signal cyan, amber, red, green), layout constants, transition speeds |
| Navigation | Fixed glass-blur navigation bar with active link highlighting |
| Hero Section | Full-viewport hero with gradient headings and signal lamp mast |
| Pipeline Steps Bar | Horizontal step selector for the IoT alert pipeline (Stations B & C) |
| Web Admin Dashboard | Desktop window mockup with sidebar, CCTV canvas feed, and socket log terminal |
| Mobile Phone Frame | Vertical iPhone-style phone frame with push notification toast, status card, and GPS map mockup |
| Station C Verification | Acoustic graph monitor, PTZ camera feed with crosshair pivot animations, dispatcher terminal |
| Skeleton Vector | CSS-drawn human skeleton with `handwaveSOSLeft` and `handwaveSOSRight` keyframe swing animations |
| FLIR Thermal Panel | Radial gradient heat body simulation with blur and color shift effects |
| PTZ Pivot Animation | CSS `transform: translate + scale` transitions for the rotating camera crosshair |
| Sticky Train Tracker | Fixed bottom track bar with dashed rail lines and station marker dots |
| Tour Guide Card | Floating glass-blur chatbot card with slide-in/out transitions |
| Keyframe Animations | `blinkPulse`, `flashAlert`, `bounceUpDown`, `trainVibrate`, `handwaveSOSLeft/Right` |

---

### `app.js`
All interactive JavaScript logic. Organized into clearly labeled sections:

| Section | What it Does |
|---------|-------------|
| **Train Tracker** | Listens to `window.scroll` and maps scroll percentage (0–100%) to the train's horizontal position (5%–95%) across the bottom tracker. Updates the active station marker and nav link on each scroll event |
| **Web Audio Synthesizer** | Uses the browser's `Web Audio API` to generate a real-time dual-tone sawtooth wave siren sound. Oscillator frequency alternates between 750 Hz and 980 Hz to simulate an emergency buzzer |
| **IoT Pipeline Simulator** | A 5-step timed cascade (each step fires 1.5 seconds after the previous): Sensor → YOLO Camera → Sirens → Station Master log → RPF mobile push. Updates the Web Admin canvas, socket logs, and phone UI simultaneously |
| **Canvas Track Renderer** | Draws a looping railway track scene on `#simCanvas` using the `requestAnimationFrame` loop. Renders sleepers, rails, a moving train (safe state), and a red YOLO bounding box vehicle obstacle (alert state) |
| **Socket Log Terminal** | Appends timestamped `log-line` entries to the Web Admin terminal. The `resetPipeline()` function completely clears the terminal using `innerHTML` overwrite (bug fix) |
| **Acoustic Graph Plotter** | Draws a running sine wave on `#sensorGraphCanvas` using `requestAnimationFrame`. Wave amplitude and speed spike when an anomaly is detected, shifting from green to red |
| **Verification Loop Engine** | A 3-stage timed simulation: Acoustic spike → PTZ camera pivot (CSS class toggle) → Debris bounding box appear → Dispatcher console enables the 'ALERT LOCO PILOT & RPF' button |
| **Handwave SOS Module** | Toggles `alert-active` class on the CCTV panel to trigger the skeleton arm swing animations and make the nested bounding box appear aligned over the skeleton figure |
| **Thermal Fusion Module** | Activates the FLIR thermal glow body color shift and the PTZ camera `pivoted` class to animate the crosshair rotating and locking onto coordinates |
| **ShieldGuard Tour Conductor** | A 13-step automated guided tour that scrolls the page, highlights elements with a spotlight class, and triggers the simulations programmatically as the user clicks Next |

---

## 🔑 Key Features

- 🚂 **Scroll-Driven Train Journey** — Train moves in real time as you scroll through 5 stations
- 📡 **IoT Alert Pipeline** — Live 5-step sensor → camera → siren → SM → RPF cascade
- 🎵 **Web Audio Synthesizer** — Real synthesized emergency siren using the browser Audio API
- 🖥️ **Dual Interface Mockups** — Side-by-side Web Admin dashboard and RPF Mobile app
- 📷 **PTZ Camera Pivot Animation** — Camera crosshair rotates and locks onto threats
- 📈 **Live Acoustic Graph** — Real-time sine wave that spikes on sensor trigger
- 🤚 **Handwave Gesture SOS** — CSS skeleton model detects waving arm posture
- 🌡️ **Thermal Sensor Fusion** — FLIR camera + CCTV auto-pivot on body heat spike
- 🤖 **ShieldGuard AI Tour** — 13-step interactive guided tour through all modules
- 🔇 **Mutable Audio** — All sirens and chimes can be muted from within the UI

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Page structure and semantic layout |
| **CSS3** | Animations, glassmorphism, keyframes, transitions |
| **Vanilla JavaScript** | Simulations, DOM manipulation, scroll tracking |
| **Canvas API** | CCTV feed rendering and acoustic graph plotting |
| **Web Audio API** | Synthesized emergency siren generation |
| **Lucide Icons** | Icon library for UI elements |
| **Google Fonts (Outfit)** | Primary typeface |

---

## 🚀 How to Run Locally

No build tools or dependencies required. Just open the file in your browser:

```bash
# Clone the repository
git clone https://github.com/Jayesh45-master/RailSheild-AI.git

# Navigate into the project
cd RailSheild-AI

# Open in browser (double-click or use terminal)
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

---

## 👥 Team

| Name | Role |
|------|------|
| **Jayesh Chaudhary** | Project Lead, Frontend Development |
| *(Add teammates here)* | *(Add their roles)* |

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

> *"Not just a concept — a live, interactive demonstration of how Indian Railways can move from reactive incident reporting to proactive real-time threat response."*
